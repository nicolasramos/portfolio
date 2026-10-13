// Refresh the GitHub facts behind /proyectos/.
//   node scripts/refresh-repos.mjs   ->  writes src/data/repos.json (committed)
//
// The build never touches the network: repos.json is the committed snapshot and
// `npm run refresh` is what updates it. Uses the authenticated `gh` CLI when
// present (the anonymous API quota is easy to burn), otherwise falls back to the
// public REST endpoints and says so if they are rate limited.
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(root, "src", "data", "repos.json");

const narrative = readFileSync(join(root, "src", "data", "projects.ts"), "utf8");
const repos = [...narrative.matchAll(/repo:\s*"([^"]+)"/g)].map((m) => m[1]);
if (repos.length === 0) {
  console.error("no `repo: \"owner/name\"` entries found in src/data/projects.ts");
  process.exit(1);
}

const hasGh = (() => {
  try {
    execFileSync("gh", ["auth", "status"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
})();

async function gh(path) {
  return JSON.parse(
    execFileSync("gh", ["api", path], { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 })
  );
}

async function rest(path) {
  const res = await fetch(`https://api.github.com/${path}`, {
    headers: { Accept: "application/vnd.github+json", "User-Agent": "nicolasramos-es-site" },
  });
  if (!res.ok) throw new Error(`${path} -> HTTP ${res.status}`);
  return res.json();
}

const fetchOne = hasGh ? gh : rest;

function cleanLicense(value) {
  if (!value || value === "NOASSERTION" || value === "none") return null;
  return value;
}

const out = { generated: new Date().toISOString().slice(0, 10), repos: {} };

for (const repo of repos) {
  const meta = await fetchOne(`repos/${repo}`);
  const contributors = await fetchOne(`repos/${repo}/contributors?per_page=100`);
  let release = null;
  try {
    release = (await fetchOne(`repos/${repo}/releases/latest`)).tag_name ?? null;
  } catch {
    release = null;
  }
  out.repos[repo] = {
    stars: meta.stargazers_count,
    forks: meta.forks_count,
    language: meta.language ?? "—",
    pushed: (meta.pushed_at ?? "").slice(0, 10),
    created: (meta.created_at ?? "").slice(0, 10),
    license: cleanLicense(meta.license?.spdx_id),
    openIssues: meta.open_issues_count,
    contributors: Array.isArray(contributors) ? contributors.length : 0,
    release,
    defaultBranch: meta.default_branch ?? "main",
  };
  console.log(
    `${repo.padEnd(42)} ${String(out.repos[repo].stars).padStart(3)}* ${out.repos[repo].language.padEnd(10)} ${out.repos[repo].license ?? "licencia sin definir"}`
  );
}

writeFileSync(OUT, `${JSON.stringify(out, null, 2)}\n`);
console.log(`\nwrote ${OUT.replace(`${root}/`, "")} (${repos.length} repos, source: ${hasGh ? "gh" : "api.github.com"})`);
