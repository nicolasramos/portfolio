// Browser checks for the content pages: the CSS-only self-diagnosis on
// /servicios/, the CSS-only language filter on /proyectos/, the real-metadata
// sheet on a project page, and mobile overflow.
//   npm run build && npm run preview:lan && node scripts/pages-check.mjs
const pw = await import(process.env.PLAYWRIGHT_PATH ?? "playwright");
const { chromium } = pw.default ?? pw;

const BASE = process.env.BASE ?? "http://127.0.0.1:4321";
const launch = { executablePath: process.env.BROWSER_PATH ?? undefined };
const problems = [];
const note = (msg) => problems.push(msg);
const ok = (msg) => console.log(`  ok ${msg}`);

const browser = await chromium.launch(launch);

async function open(width, height) {
  const page = await browser.newPage();
  await page.setViewportSize({ width, height });
  return page;
}

async function overflow(page) {
  return page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
}

async function visibleCount(page, selector) {
  return page.$$eval(selector, (els) => els.filter((el) => el.offsetParent !== null).length);
}

async function opacities(page) {
  return page.$$eval(".sheet", (els) =>
    els.map((el) => ({ svc: el.dataset.svc, opacity: Number(getComputedStyle(el).opacity) }))
  );
}

// --- /servicios/ -------------------------------------------------------------
console.log("servicios (desktop)");
{
  const page = await open(1440, 900);
  await page.goto(`${BASE}/servicios/`, { waitUntil: "load" });
  await page.waitForTimeout(1200);

  const sheets = await page.$$eval(".sheet", (els) => els.map((el) => el.dataset.svc));
  if (sheets.length < 4) note(`expected 4 service sheets, found ${sheets.length}`);
  else ok(`${sheets.length} service sheets: ${sheets.join(", ")}`);

  const chips = await visibleCount(page, ".fit__input");
  if (chips < 4) note(`expected self-diagnosis chips, found ${chips}`);
  else ok(`${chips} self-diagnosis chips`);

  const faqs = await page.$$eval("details", (els) => els.length);
  if (faqs < 4) note(`expected FAQ items, found ${faqs}`);
  else ok(`${faqs} FAQ items`);

  const before = await opacities(page);
  if (before.some((s) => s.opacity < 0.9)) note("sheets are dimmed before any chip is ticked");
  else ok("all sheets lit at rest");

  const target = await page.$eval(".fit__input", (el) => ({
    id: el.id,
    svc: el.dataset.svc,
  }));
  await page.click(`label[for="${target.id}"]`);
  await page.waitForTimeout(900);
  const after = await opacities(page);
  const lit = after.find((s) => s.svc === target.svc);
  const dimmed = after.filter((s) => s.svc !== target.svc);
  if (!lit || lit.opacity < 0.9) note(`ticking ${target.id} did not keep ${target.svc} lit`);
  else if (dimmed.some((s) => s.opacity > 0.6))
    note(`ticking ${target.id} left a non-matching sheet lit`);
  else ok(`chip ${target.id} keeps ${target.svc} lit and dims ${dimmed.length} sheets`);

  await page.click(`label[for="${target.id}"]`);
  await page.waitForTimeout(900);
  const restored = await opacities(page);
  if (restored.some((s) => s.opacity < 0.9)) note("unticking the chip did not restore every sheet");
  else ok("unticking restores every sheet");

  const px = await overflow(page);
  if (px > 0) note(`desktop horizontal overflow ${px}px`);
  else ok("no horizontal overflow at 1440");
  await page.close();
}

console.log("servicios (mobile 390)");
{
  const page = await open(390, 844);
  await page.goto(`${BASE}/servicios/`, { waitUntil: "load" });
  await page.waitForTimeout(1000);
  const px = await overflow(page);
  if (px > 0) note(`mobile overflow ${px}px on /servicios/`);
  else ok("no horizontal overflow at 390");
  await page.close();
}

// --- /proyectos/ -------------------------------------------------------------
console.log("proyectos (desktop)");
{
  const page = await open(1440, 900);
  await page.goto(`${BASE}/proyectos/`, { waitUntil: "load" });
  await page.waitForTimeout(1500);

  const langs = await page.$$eval(".repo", (els) => els.map((el) => el.dataset.lang));
  if (langs.length < 5) note(`expected the project cards, found ${langs.length}`);
  else ok(`${langs.length} cards: ${[...new Set(langs)].join(", ")}`);

  const broken = await page.$$eval(".repo img", (els) => els.filter((i) => !(i.complete && i.naturalWidth > 0)).length);
  if (broken > 0) note(`${broken} card artwork failed to load`);
  else ok("every card artwork loads");

  const bars = await page.$$eval('li span[style*="width"]', (els) => els.length);
  if (bars < langs.length) note(`expected ${langs.length} star bars, found ${bars}`);
  else ok(`${bars} star bars rendered`);

  for (const lang of [...new Set(langs)]) {
    const id = `lang-${lang.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
    await page.click(`label[for="${id}"]`);
    await page.waitForTimeout(400);
    const shown = await page.$$eval(".repo", (els) =>
      els.filter((el) => el.offsetParent !== null).map((el) => el.dataset.lang)
    );
    const expected = langs.filter((value) => value === lang).length;
    if (shown.length !== expected || shown.some((value) => value !== lang))
      note(`filter ${id} showed ${shown.length} cards, expected ${expected} of ${lang}`);
    else ok(`filter ${id} leaves ${expected} ${lang} card(s)`);
  }

  await page.click('label[for="lang-all"]');
  await page.waitForTimeout(400);
  if ((await visibleCount(page, ".repo")) !== langs.length) note("the All filter did not restore the grid");
  else ok("the All filter restores the grid");
  await page.close();
}

console.log("proyectos (mobile 390)");
{
  const page = await open(390, 844);
  await page.goto(`${BASE}/proyectos/`, { waitUntil: "load" });
  await page.waitForTimeout(1200);
  const px = await overflow(page);
  if (px > 0) note(`mobile overflow ${px}px on /proyectos/`);
  else ok("no horizontal overflow at 390");
  await page.close();
}

// --- project detail ----------------------------------------------------------
console.log("project detail");
{
  const page = await open(1440, 900);
  await page.goto(`${BASE}/proyectos/odooclaw/`, { waitUntil: "load" });
  await page.waitForTimeout(1000);
  const labels = await page.$$eval("dl dt", (els) => els.map((el) => el.textContent.trim()));
  const wanted = ["Issues", "Colaboradores", "marcha desde"];
  const missing = wanted.filter((needle) => !labels.some((label) => label.includes(needle)));
  if (missing.length) note(`detail sheet is missing ${missing.join(", ")}`);
  else ok(`detail sheet carries ${labels.length} rows`);
  const art = await page.$(".relative img[src^='/world/']");
  if (!art) note("detail page has no artwork band");
  else ok("detail page carries the artwork band");
  const px = await overflow(page);
  if (px > 0) note(`detail overflow ${px}px`);
  else ok("no horizontal overflow on the detail page");
  await page.close();
}

await browser.close();

if (problems.length) {
  console.log(`\n${problems.length} problem(s):`);
  for (const problem of problems) console.log(`  - ${problem}`);
  process.exit(1);
}
console.log("\nall page checks passed");
