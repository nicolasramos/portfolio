// Checks for the monochrome scroll world: scenes, scrub behaviour, clip loading,
// reduced-motion fallback and mobile. Needs a preview server on BASE.
//   npm run build && npm run preview:lan   (then) node scripts/world-check.mjs
const pw = await import(process.env.PLAYWRIGHT_PATH ?? "playwright");
const { chromium } = pw.default ?? pw;
import fs from "node:fs";

const BASE = process.env.BASE ?? "http://127.0.0.1:4321";
const OUT = new URL("../../shots/", import.meta.url).pathname;
fs.mkdirSync(OUT, { recursive: true });
const launch = { executablePath: process.env.BROWSER_PATH ?? undefined };

const STOPS = ["brief", "system", "agents", "automation", "workshop", "finale"];
const problems = [];
const note = (m) => {
  problems.push(m);
  console.log("  ✗", m);
};

const browser = await chromium.launch(launch);

async function openPage(context, w, h, reduce = false) {
  const page = await context.newPage();
  await page.setViewportSize({ width: w, height: h });
  const errors = [];
  page.on("console", (msg) => msg.type() === "error" && errors.push(`console: ${msg.text()}`));
  page.on("requestfailed", (r) => errors.push(`requestfailed: ${r.url()}`));
  page.on("response", (r) => r.status() >= 400 && errors.push(`http ${r.status()}: ${r.url()}`));
  await page.goto(BASE + "/", { waitUntil: "load" });
  await page.waitForSelector("#world.sw-root", { timeout: 10000 }).catch(() => note("world did not mount"));
  return { page, errors };
}

// ---------- desktop ----------
console.log("desktop 1440x900");
{
  const context = await browser.newContext();
  const { page, errors } = await openPage(context, 1440, 900);

  const counts = await page.evaluate(() => ({
    scenes: document.querySelectorAll(".sw-scene").length,
    copies: document.querySelectorAll(".sw-copy").length,
    dots: document.querySelectorAll(".sw-route__dot").length,
    stills: document.querySelectorAll(".sw-scene__still[src]").length,
  }));
  console.log("  scenes/copies/dots/stills:", JSON.stringify(counts));
  if (counts.scenes !== STOPS.length * 1) note(`expected ${STOPS.length} scenes, got ${counts.scenes}`);
  if (counts.copies !== STOPS.length) note(`expected ${STOPS.length} copy blocks, got ${counts.copies}`);
  if (counts.stills !== STOPS.length) note(`expected ${STOPS.length} posters, got ${counts.stills}`);

  const total = await page.evaluate(() => document.querySelector(".sw-track").getBoundingClientRect().height);
  const vh = 900;
  const DIVE = 1.35; // must match diveScroll in ScrollWorld.astro

  for (let i = 0; i < STOPS.length; i++) {
    const frac = i === 0 ? 0.05 : i === STOPS.length - 1 ? 0.8 : 0.5;
    const y = ((i + frac) * DIVE * vh) | 0;
    await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: "instant" }), y);
    await page.waitForTimeout(1800);
    const state = await page.evaluate(() => {
      const scenes = [...document.querySelectorAll(".sw-scene")];
      let best = 0;
      let bestOp = -1;
      scenes.forEach((s, idx) => {
        const op = parseFloat(s.style.opacity || "0");
        if (op > bestOp) {
          bestOp = op;
          best = idx;
        }
      });
      const copies = [...document.querySelectorAll(".sw-copy")];
      const vid = scenes[best].querySelector("video");
      return {
        best,
        sceneOpacity: bestOp,
        copyOpacity: parseFloat(copies[best].style.opacity || "0"),
        hasVideo: !!vid,
        currentTime: vid ? vid.currentTime : null,
        seekable: vid && vid.seekable.length ? vid.seekable.end(0) : 0,
        title: copies[best].querySelector(".sw-copy__title")?.textContent ?? "",
      };
    });
    console.log(
      `  ${STOPS[i]}: scene ${state.best + 1} op=${state.sceneOpacity.toFixed(2)} copy=${state.copyOpacity.toFixed(2)} video=${state.hasVideo} t=${state.currentTime?.toFixed(2)} seekable=${state.seekable.toFixed(1)}s "${state.title}"`
    );
    if (state.sceneOpacity < 0.9) note(`${STOPS[i]}: active scene opacity ${state.sceneOpacity}`);
    if (state.copyOpacity < 0.5) note(`${STOPS[i]}: copy not visible (${state.copyOpacity})`);
    if (!state.hasVideo) note(`${STOPS[i]}: no <video> loaded`);
    else if (state.seekable <= 0) note(`${STOPS[i]}: clip not seekable (blob load failed)`);
    await page.screenshot({ path: `${OUT}world-${STOPS[i]}.png` });
  }

  // scrub: currentTime must track scroll inside one clip
  const i = 2;
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), (i + 0.15) * DIVE * vh);
  await page.waitForTimeout(1200);
  const t1 = await page.evaluate(() => document.querySelector(".sw-scene:nth-child(3) video")?.currentTime ?? -1);
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), (i + 0.9) * DIVE * vh);
  await page.waitForTimeout(1200);
  const t2 = await page.evaluate(() => document.querySelector(".sw-scene:nth-child(3) video")?.currentTime ?? -1);
  console.log(`  scrub: currentTime ${t1.toFixed(2)} -> ${t2.toFixed(2)}`);
  if (!(t2 > t1)) note(`currentTime did not track scroll (${t1} -> ${t2})`);

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  if (overflow > 1) note(`horizontal overflow ${overflow}px`);

  if (errors.length) note(`desktop errors: ${errors.slice(0, 5).join(" | ")}`);
  await context.close();
}

// ---------- reduced motion ----------
console.log("reduced motion");
{
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const { page, errors } = await openPage(context, 1440, 900, true);
  await page.evaluate(() => window.scrollTo({ top: 2200, behavior: "instant" }));
  await page.waitForTimeout(1200);
  const vids = await page.evaluate(() => document.querySelectorAll("video").length);
  const stills = await page.evaluate(() =>
    [...document.querySelectorAll(".sw-scene__still")].filter((i) => i.getBoundingClientRect().width > 0).length
  );
  console.log(`  videos=${vids} stills=${stills}`);
  if (vids !== 0) note(`reduced motion still loaded ${vids} videos`);
  if (stills !== STOPS.length) note(`reduced motion shows only ${stills} stills`);
  if (errors.length) note(`reduced-motion errors: ${errors.slice(0, 3).join(" | ")}`);
  await page.screenshot({ path: `${OUT}world-reduced.png` });
  await context.close();
}

// ---------- mobile ----------
console.log("mobile 390x844");
{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const { page, errors } = await openPage(context, 390, 844);
  await page.evaluate(() => window.scrollTo({ top: 1500, behavior: "instant" }));
  await page.waitForTimeout(2000);
  const ok = await page.evaluate(() => {
    const s = [...document.querySelectorAll(".sw-scene")].find((x) => parseFloat(x.style.opacity || 0) > 0.9);
    return { scene: !!s, video: !!document.querySelector("video") };
  });
  console.log("  ", JSON.stringify(ok));
  if (!ok.scene) note("mobile: no scene at full opacity");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  if (overflow > 1) note(`mobile horizontal overflow ${overflow}px`);
  if (errors.length) note(`mobile errors: ${errors.slice(0, 4).join(" | ")}`);
  await page.screenshot({ path: `${OUT}world-mobile.png` });
  await context.close();
}

await browser.close();
console.log(problems.length ? `\n${problems.length} problem(s)` : "\nall world checks passed");
process.exit(problems.length ? 1 : 0);
