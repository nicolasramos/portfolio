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
# Requires: curl, jq. Optional: gh, only for --set-ci-secrets.

set -euo pipefail

BASE_URL="${COOLIFY_BASE_URL:-https://app.nramos.dev/api/v1}"
PROJECT_NAME="${PROJECT_NAME:-nicolasramos.es}"
APP_NAME="${APP_NAME:-portfolio}"
REPO="${REPO:-https://github.com/nicolasramos/portfolio.git}"
BRANCH="${BRANCH:-main}"
DOMAINS="${DOMAINS:-nicolasramos.es,www.nicolasramos.es}"
BUILD_PACK="${BUILD_PACK:-dockerfile}"
SERVER="${SERVER:-}"
DESTINATION="${DESTINATION:-}"
GH_REPO="${GH_REPO:-nicolasramos/portfolio}"

DRY_RUN=0
DEPLOY=1
SET_CI_SECRETS=0

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
  --destination UUID  proxy destination; by default the one the other apps on that server use
  --no-deploy         create the app without starting the first deployment
  --set-ci-secrets    store the three Actions secrets the deploy job needs (needs gh)
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
    --destination) DESTINATION="$2"; shift 2 ;;
    --no-deploy) DEPLOY=0; shift ;;
    --set-ci-secrets) SET_CI_SECRETS=1; shift ;;
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
    { note "[dry-run] $1 $2"; note "          $4"; } >&2
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
    "$(jq -nc --arg n "$PROJECT_NAME" --arg d "Personal site for $(echo "$DOMAINS" | cut -d, -f1)" \
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
# Coolify stores git_repository as "owner/repo.git", not the URL you sent, so compare the
# normalized form. Falling back to the app name still finds it when the remote was rewritten.
app_uuid="$(printf '%s' "$apps" | jq -r --arg r "$REPO" --arg b "$BRANCH" '
  def norm(s): s // "" | sub("^https?://[^/]+/"; "") | sub("^git@[^:]+:"; "") | sub("\\.git$"; "");
  .[] | select(norm(.git_repository) == norm($r) and .git_branch == $b) | .uuid' | head -n1)"
if [ -z "$app_uuid" ]; then
  app_uuid="$(printf '%s' "$apps" | jq -r --arg n "$APP_NAME" \
    '.[] | select(.name == $n) | .uuid' | head -n1)"
  [ -n "$app_uuid" ] && note "matched by name (git_repository is stored as owner/repo.git)"
fi
if [ -n "$app_uuid" ] && [ "$app_uuid" != null ]; then
  note "reusing existing application $app_uuid"
else
  # Coolify wants full URLs in `domains`, and it rejects bare hostnames with "Invalid URL".
  norm_domains=""
  IFS=',' read -ra _domains_in <<< "$DOMAINS"
  for _d in "${_domains_in[@]}"; do
    [ -n "$_d" ] || continue
    case "$_d" in *://*) ;; *) _d="https://$_d" ;; esac
    norm_domains="${norm_domains:+$norm_domains,}$_d"
  done
  note "domains: ${norm_domains}"
  if [ -z "$DESTINATION" ]; then
    # Coolify 4.1.x has no destinations endpoint: take the destination the other apps on this
    # server already use, which is the only safe reading of "where the proxy listens".
    DESTINATION="$(printf '%s' "$apps" | jq -r --arg s "$SERVER" \
      '[.[] | select(.destination.server.uuid? == $s) | .destination.uuid]
        | group_by(.) | map({u:.[0], n:length}) | sort_by(-.n) | (.[0].u // empty)')"
    if [ -n "$DESTINATION" ]; then
      note "destination taken from the other apps on this server: ${DESTINATION}"
    fi
  fi
  payload="$(jq -nc \
    --arg dest "$DESTINATION" \
    --arg project "$project_uuid" --arg server "$SERVER" \
    --arg env "$env_name" --arg envuuid "$env_uuid" \
    --arg repo "$REPO" --arg branch "$BRANCH" --arg pack "$BUILD_PACK" \
    --arg name "$APP_NAME" --arg domains "$norm_domains" \
    '{project_uuid:$project, server_uuid:$server, destination_uuid:$dest, environment_name:$env,
      environment_uuid:$envuuid, git_repository:$repo, git_branch:$branch,
      build_pack:$pack, name:$name, domains:$domains, is_auto_deploy_enabled:true}
      | if $dest == "" then del(.destination_uuid) else . end')"
  app_uuid="$(mutate POST /applications/public "$payload" \
    "create app ${APP_NAME} from ${REPO}@${BRANCH} -> ${DOMAINS}" | jq -r '.uuid // empty')"
  [ -n "$app_uuid" ] || [ "$DRY_RUN" = 1 ] || die "no uuid came back from POST /applications/public"
  note "application uuid: ${app_uuid}"
fi

# Coolify 4.1.x rejects a token in the query string (`/deploy?uuid=..&token=..` answers 401), so
# CI authenticates the way the API documents it: a bearer header plus the app uuid.
set_ci_secrets() {
  command -v gh >/dev/null || die "gh is required for --set-ci-secrets"
  printf '%s' "$COOLIFY_API_TOKEN" | gh secret set COOLIFY_API_TOKEN -R "$GH_REPO"
  printf '%s' "$app_uuid"        | gh secret set COOLIFY_APP_UUID  -R "$GH_REPO"
  printf '%s' "$BASE_URL"        | gh secret set COOLIFY_BASE_URL  -R "$GH_REPO"
  note "COOLIFY_API_TOKEN, COOLIFY_APP_UUID and COOLIFY_BASE_URL stored on ${GH_REPO}"
}

if [ "$SET_CI_SECRETS" = 1 ]; then
  step "Actions secrets on ${GH_REPO}"
  if [ "$DRY_RUN" = 1 ]; then
    note "[dry-run] gh secret set COOLIFY_API_TOKEN / COOLIFY_APP_UUID / COOLIFY_BASE_URL -R ${GH_REPO}"
  else
    set_ci_secrets
    note "the deploy job can now publish on its own on every push to ${BRANCH}"
  fi
fi

if [ "$DEPLOY" = 1 ]; then
  step "First deployment"
  if [ "$DRY_RUN" = 1 ]; then
    note "[dry-run] POST /deploy?uuid=${app_uuid}"
  else
    api POST "/deploy?uuid=${app_uuid}" | jq -c '{queued: .deployments[0].message, deployment_uuid: .deployments[0].deployment_uuid}'
    note "watch it in Coolify, or: curl -H \"Authorization: Bearer \$COOLIFY_API_TOKEN\" ${BASE_URL}/applications/${app_uuid}"
  fi
fi

step "Next step (not automated)"
note "DNS: nicolasramos.es and www must resolve to this Coolify host; Traefik issues the certificate."
note "Check: curl -sI https://nicolasramos.es | head -1"
