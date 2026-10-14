#!/usr/bin/env bash
# Provision the portfolio on a self-hosted Coolify: project -> application -> domains -> webhook.
#
# It is idempotent: every step looks for what already exists and only fills the gaps, so it is safe
# to re-run after an interruption. Read-only calls always run; mutations are skipped by --dry-run.
#
#   COOLIFY_API_TOKEN=cn_... ./tools/coolify-provision.sh --dry-run
#   COOLIFY_API_TOKEN=cn_... ./tools/coolify-provision.sh
#
# The token decides the owning team: create it as a member of the team that should own the project
# (for us, Root). Coolify has no team parameter on these endpoints.
#
# Requires: curl, jq. Optional: gh, only for --set-webhook-secret.

set -euo pipefail

BASE_URL="${COOLIFY_BASE_URL:-https://app.nramos.dev/api/v1}"
PROJECT_NAME="${PROJECT_NAME:-nicolasramos.es}"
APP_NAME="${APP_NAME:-portfolio}"
REPO="${REPO:-https://github.com/nicolasramos/portfolio.git}"
BRANCH="${BRANCH:-main}"
DOMAINS="${DOMAINS:-nicolasramos.es,www.nicolasramos.es}"
BUILD_PACK="${BUILD_PACK:-dockerfile}"
SERVER="${SERVER:-}"
GH_REPO="${GH_REPO:-nicolasramos/portfolio}"

DRY_RUN=0
DEPLOY=1
SET_WEBHOOK=0
PRINT_WEBHOOK=0

usage() {
  awk 'NR>1 && /^#/ { sub(/^# ?/, ""); print; next } NR>1 { exit }' "$0"
  cat <<'EOF'

Options
  --project NAME      Coolify project to create or reuse   (nicolasramos.es)
  --app NAME          application name                    (portfolio)
  --repo URL          git repository                      (nicolasramos/portfolio)
  --branch NAME       branch to track                     (main)
  --domains LIST      comma-separated domains             (nicolasramos.es,www.nicolasramos.es)
  --server UUID       Coolify server uuid; required only when the token sees more than one
  --no-deploy         create the app without starting the first deployment
  --set-webhook-secret  store the deploy webhook as the COOLIFY_WEBHOOK_URL Actions secret (gh)
  --print-webhook     also print the deploy webhook (it embeds the API token — avoid in shared logs)
  --dry-run           run every read, print every mutation, change nothing
  --base-url URL      Coolify API base                    (https://app.nramos.dev/api/v1)
EOF
}

while [ $# -gt 0 ]; do
  case "$1" in
    --project) PROJECT_NAME="$2"; shift 2 ;;
    --app) APP_NAME="$2"; shift 2 ;;
    --repo) REPO="$2"; shift 2 ;;
    --branch) BRANCH="$2"; shift 2 ;;
    --domains) DOMAINS="$2"; shift 2 ;;
    --server) SERVER="$2"; shift 2 ;;
    --no-deploy) DEPLOY=0; shift ;;
    --set-webhook-secret) SET_WEBHOOK=1; shift ;;
    --print-webhook) PRINT_WEBHOOK=1; shift ;;
    --dry-run) DRY_RUN=1; shift ;;
    --base-url) BASE_URL="$2"; shift 2 ;;
    -h|--help) usage; exit 0 ;;
    *) echo "unknown option: $1" >&2; usage; exit 2 ;;
  esac
done

for dep in curl jq; do
  command -v "$dep" >/dev/null || { echo "missing dependency: $dep" >&2; exit 1; }
done
if [ -z "${COOLIFY_API_TOKEN:-}" ]; then
  echo "COOLIFY_API_TOKEN is not set. Create one in Coolify (your profile -> API tokens) as a" >&2
  echo "member of the team that should own the project, then export it." >&2
  exit 1
fi

step() { printf '\n\033[1m== %s\033[0m\n' "$1"; }
note() { printf '   %s\n' "$1"; }
die() { printf '\n\033[31mfailed: %s\033[0m\n' "$1" >&2; exit 1; }

# api METHOD PATH [JSON_BODY] -> body on stdout; dies on a non-2xx status.
api() {
  local method="$1" path="$2" body="${3:-}"
  local tmp http out
  tmp="$(mktemp)"
  if [ -n "$body" ]; then
    http="$(curl -sS -o "$tmp" -w '%{http_code}' -m 60 -X "$method" \
      -H "Authorization: Bearer ${COOLIFY_API_TOKEN}" -H 'Content-Type: application/json' \
      -d "$body" "${BASE_URL}${path}")" || { rm -f "$tmp"; die "$method $path did not answer"; }
  else
    http="$(curl -sS -o "$tmp" -w '%{http_code}' -m 60 -X "$method" \
      -H "Authorization: Bearer ${COOLIFY_API_TOKEN}" "${BASE_URL}${path}")" \
      || { rm -f "$tmp"; die "$method $path did not answer"; }
  fi
  out="$(cat "$tmp")"; rm -f "$tmp"
  case "$http" in
    2??) printf '%s' "$out" ;;
    *) printf '%s\n' "$out" >&2; die "$method $path -> HTTP $http" ;;
  esac
}

mutate() { # METHOD PATH BODY LABEL
  if [ "$DRY_RUN" = 1 ]; then
    note "[dry-run] $1 $2"
    note "          $4"
    printf '%s' "$3"
    return 0
  fi
  api "$1" "$2" "$3"
}

step "Coolify instance"
version="$(api GET /version)"
note "version: ${version}"

step "Project: ${PROJECT_NAME}"
project_uuid="$(api GET /projects | jq -r --arg n "$PROJECT_NAME" \
  '.[] | select(.name == $n) | .uuid' | head -n1)"
if [ -n "$project_uuid" ] && [ "$project_uuid" != null ]; then
  note "reusing existing project $project_uuid"
else
  project_uuid="$(mutate POST /projects \
    "$(jq -nc --arg n "$PROJECT_NAME" --arg d "Personal site — $(echo "$DOMAINS" | cut -d, -f1)" \
        '{name:$n, description:$d}')" \
    "create project ${PROJECT_NAME}" | jq -r '.uuid // empty')"
  [ -n "$project_uuid" ] || [ "$DRY_RUN" = 1 ] || die "no uuid came back from POST /projects"
  note "project uuid: ${project_uuid}"
fi

step "Environment"
env_name="production"
env_uuid=""
if [ -n "$project_uuid" ] && [ "$project_uuid" != null ]; then
  env_uuid="$(api GET "/projects/${project_uuid}/environments" \
    | jq -r '.[] | select(.name == "production") | .uuid' | head -n1)"
  if [ -z "$env_uuid" ] || [ "$env_uuid" = null ]; then
    env_uuid="$(api GET "/projects/${project_uuid}/environments" | jq -r '.[0].uuid // empty')"
    env_name="$(api GET "/projects/${project_uuid}/environments" | jq -r '.[0].name // "production"')"
  fi
fi
note "environment: ${env_name} ${env_uuid}"

step "Server"
if [ -z "$SERVER" ]; then
  servers="$(api GET /servers)"
  count="$(printf '%s' "$servers" | jq 'length')"
  if [ "$count" = "1" ]; then
    SERVER="$(printf '%s' "$servers" | jq -r '.[0].uuid')"
    note "only one server: $(printf '%s' "$servers" | jq -r '.[0].name') (${SERVER})"
  else
    printf '%s' "$servers" | jq -r '.[] | "   \(.uuid)  \(.name) (\(.ip))"' >&2
    die "$count servers visible — pass --server <uuid>"
  fi
else
  note "using --server ${SERVER}"
fi

step "Application: ${APP_NAME}"
apps="$(api GET /applications)"
app_uuid="$(printf '%s' "$apps" | jq -r --arg r "$REPO" --arg b "$BRANCH" \
  '.[] | select(.git_repository == $r and .git_branch == $b) | .uuid' | head -n1)"
if [ -n "$app_uuid" ] && [ "$app_uuid" != null ]; then
  note "reusing existing application $app_uuid"
else
  payload="$(jq -nc \
    --arg project "$project_uuid" --arg server "$SERVER" \
    --arg env "$env_name" --arg envuuid "$env_uuid" \
    --arg repo "$REPO" --arg branch "$BRANCH" --arg pack "$BUILD_PACK" \
    --arg name "$APP_NAME" --arg domains "$DOMAINS" \
    '{project_uuid:$project, server_uuid:$server, environment_name:$env,
      environment_uuid:$envuuid, git_repository:$repo, git_branch:$branch,
      build_pack:$pack, name:$name, domains:$domains, is_auto_deploy_enabled:true}')"
  app_uuid="$(mutate POST /applications/public "$payload" \
    "create app ${APP_NAME} from ${REPO}@${BRANCH} -> ${DOMAINS}" | jq -r '.uuid // empty')"
  [ -n "$app_uuid" ] || [ "$DRY_RUN" = 1 ] || die "no uuid came back from POST /applications/public"
  note "application uuid: ${app_uuid}"
fi

webhook="${BASE_URL}/deploy?uuid=${app_uuid}&token=${COOLIFY_API_TOKEN}"
if [ "$PRINT_WEBHOOK" = 1 ]; then
  note "deploy webhook: ${webhook}"
else
  note "deploy webhook ready (not printed: it embeds the API token)"
fi

if [ "$SET_WEBHOOK" = 1 ]; then
  step "Actions secret COOLIFY_WEBHOOK_URL on ${GH_REPO}"
  command -v gh >/dev/null || die "gh is required for --set-webhook-secret"
  if [ "$DRY_RUN" = 1 ]; then
    note "[dry-run] gh secret set COOLIFY_WEBHOOK_URL -R ${GH_REPO}"
  else
    printf '%s' "$webhook" | gh secret set COOLIFY_WEBHOOK_URL -R "$GH_REPO" --body -
    note "secret set — every push to ${BRANCH} now publishes on its own"
  fi
fi

if [ "$DEPLOY" = 1 ]; then
  step "First deployment"
  if [ "$DRY_RUN" = 1 ]; then
    note "[dry-run] POST /deploy?uuid=${app_uuid}"
  else
    api POST "/deploy?uuid=${app_uuid}" | jq -c '{message, deployment_uuid: .deployment_uuid}'
    note "watch it in Coolify, or: curl -H \"Authorization: Bearer \$COOLIFY_API_TOKEN\" ${BASE_URL}/applications/${app_uuid}"
  fi
fi

step "Next step (not automated)"
note "DNS: nicolasramos.es and www must resolve to this Coolify host; Traefik issues the certificate."
note "Check: curl -sI https://nicolasramos.es | head -1"
