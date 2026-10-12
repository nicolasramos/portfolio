// Browser checks for the portfolio. Requires Playwright:
//   npm i -D playwright && npx playwright install chromium
// Override discovery when Playwright lives elsewhere:
//   PLAYWRIGHT_PATH=/abs/path/playwright/index.js BROWSER_PATH=/abs/chrome-headless-shell node scripts/verify.mjs
const pw = await import(process.env.PLAYWRIGHT_PATH ?? "playwright");
const { chromium } = pw.default ?? pw;

const BASE = process.env.BASE ?? "http://127.0.0.1:4321";
const launch = { executablePath: process.env.BROWSER_PATH ?? undefined };

import fs from "node:fs";
const OUT = new URL("../../shots/", import.meta.url).pathname;
fs.mkdirSync(OUT, { recursive: true });

const desktop = [
  ["home-es", "/"],
  ["servicios", "/servicios/"],
  ["proyectos", "/proyectos/"],
  ["proyecto-odooclaw", "/proyectos/odooclaw/"],
  ["sobre-mi", "/sobre-mi/"],
  ["contacto", "/contacto/"],
  ["home-en", "/en/"],
  ["en-project", "/en/projects/odooclaw/"],
];

const mobile = [
  ["m-home-es", "/"],
  ["m-proyectos", "/proyectos/"],
  ["m-contacto", "/contacto/"],
];

const browser = await chromium.launch(launch);
const report = [];

async function newPage(width, height) {
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1, reducedMotion: process.env.MOTION === "animate" ? "no-preference" : "reduce" });
  const page = await context.newPage();
  const problems = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") problems.push(`console: ${msg.text().slice(0, 140)}`);
  });
  page.on("pageerror", (err) => problems.push(`pageerror: ${String(err).slice(0, 140)}`));
  page.on("requestfailed", (req) => problems.push(`reqfail: ${req.url().slice(0, 120)}`));
  page.on("response", (res) => {
    if (res.status() >= 400) problems.push(`http ${res.status()}: ${res.url().slice(0, 120)}`);
  });
  return { context, page, problems };
}

for (const [name, path] of desktop) {
  const { context, page, problems } = await newPage(1440, 900);
  await page.goto(BASE + path, { waitUntil: "load" });
  await page.waitForTimeout(900);
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(900);
  const revealState = await page.evaluate(async () => {
    const items = [...document.querySelectorAll("[data-reveal]")];
    const before = items.filter((el) => getComputedStyle(el).opacity === "0").length;
    window.scrollTo(0, document.body.scrollHeight);
    await new Promise((r) => setTimeout(r, 400));
    const marked = document.querySelectorAll("[data-reveal].is-in").length;
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 200));
    return { total: items.length, hiddenAtTop: before, markedAfterScroll: marked };
  });
  await page.screenshot({ path: `${OUT}${name}.png`, fullPage: true });
  report.push({ name, path, problems: problems.length ? problems : [], ...revealState });
  await context.close();
}

for (const [name, path] of mobile) {
  const { context, page, problems } = await newPage(390, 844);
  await page.goto(BASE + path, { waitUntil: "load" });
  await page.waitForTimeout(700);
  const burger = await page.$("[data-nav-toggle]");
  let navOk = "no burger";
  if (burger) {
    await burger.click();
    await page.waitForTimeout(800);
    navOk = await page.evaluate(() => {
      const panel = document.querySelector("[data-nav-panel]");
      if (!panel || panel.hidden) return "panel hidden";
      const link = panel.querySelector("[data-navlink]");
      return link && getComputedStyle(link).opacity === "1" ? "open + links visible" : "links hidden";
    });
    await page.screenshot({ path: `${OUT}${name}-nav.png` });
    await page.keyboard.press("Escape");
    await page.waitForTimeout(500);
    navOk += ` | esc closed=${await page.evaluate(() => document.querySelector("[data-nav-panel]").hidden)}`;
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: `${OUT}${name}.png`, fullPage: true });
  report.push({ name, path, problems: problems.length ? problems : [], nav: navOk });
  await context.close();
}

// OG image: 1200x630 above the fold of the home page
{
  const { context, page } = await newPage(1200, 630);
  await page.goto(BASE + "/", { waitUntil: "load" });
  await page.waitForTimeout(1400);
  await page.screenshot({ path: `${OUT}og-image.png` });
  await context.close();
}

// Contact copy button
{
  const { context, page } = await newPage(1440, 900);
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto(BASE + "/contacto/", { waitUntil: "load" });
  await page.click("[data-copy]");
  await page.waitForTimeout(400);
  const label = await page.textContent("[data-copy-label]");
  const clip = await page.evaluate(() => navigator.clipboard.readText()).catch(() => "denied");
  report.push({ name: "copy-button", path: "/contacto/", problems: [], copyLabel: label, clipboard: clip });
  await context.close();
}

await browser.close();

for (const row of report) {
  const extras = Object.entries(row)
    .filter(([k]) => !["name", "path", "problems"].includes(k))
    .map(([k, v]) => `${k}=${Array.isArray(v) ? v.join(",") : v}`)
    .join(" ");
  console.log(`${row.name.padEnd(20)} ${row.path.padEnd(26)} issues=${row.problems.length} ${extras}`);
  row.problems.slice(0, 4).forEach((p) => console.log(`    ! ${p}`));
}
