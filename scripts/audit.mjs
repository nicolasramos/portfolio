// Structural and accessibility audit across every route, at two viewports.
// Same Playwright discovery rules as verify.mjs.
const pw = await import(process.env.PLAYWRIGHT_PATH ?? "playwright");
const { chromium } = pw.default ?? pw;

const BASE = process.env.BASE ?? "http://127.0.0.1:4321";
const launch = { executablePath: process.env.BROWSER_PATH ?? undefined };

const pages = ["/", "/servicios/", "/proyectos/", "/proyectos/odooclaw/", "/sobre-mi/", "/contacto/", "/en/", "/en/services/", "/en/projects/", "/en/projects/odooclaw/", "/en/about/", "/en/contact/"];
const sizes = [["desk", 1440, 900], ["mob", 390, 844]];

const browser = await chromium.launch(launch);

const rows = [];
for (const [tag, width, height] of sizes) {
  for (const path of pages) {
    const ctx = await browser.newContext({ viewport: { width, height }, reducedMotion: "reduce" });
    const page = await ctx.newPage();
    await page.goto(BASE + path, { waitUntil: "load" });
    await page.waitForTimeout(500);
    const r = await page.evaluate(() => {
      const body = getComputedStyle(document.body);
      const h1 = document.querySelectorAll("h1").length;
      const overflow = document.documentElement.scrollWidth - window.innerWidth;
      const wide = [...document.querySelectorAll("body *")]
        .filter((el) => el.getBoundingClientRect().right > window.innerWidth + 2)
        .slice(0, 3)
        .map((el) => `${el.tagName.toLowerCase()}.${(el.className || "").toString().split(" ")[0]}`);
      const texts = [...document.querySelectorAll("main *")]
        .map((el) => (el.children.length === 0 ? el.textContent.trim() : ""))
        .filter(Boolean);
      const bad = texts.filter((t) => /undefined|\[object |Lorem ipsum|\bTODO\b|\bFIXME\b/.test(t));
      const unnamedLinks = [...document.querySelectorAll("a")].filter(
        (a) => !a.textContent.trim() && !a.getAttribute("aria-label") && !a.querySelector("img[alt]")
      ).length;
      const h1el = document.querySelector("h1");
      const heroClip = h1el ? getComputedStyle(h1el).backgroundImage.includes("gradient") : false;
      return {
        font: body.fontFamily.split(",")[0].replace(/"/g, ""),
        fontsLoaded: document.fonts.status,
        manrope: document.fonts.check('600 16px "Manrope Variable"'),
        mono: document.fonts.check('400 12px "Geist Mono Variable"'),
        h1,
        overflowPx: overflow,
        wideEls: wide,
        badText: bad.slice(0, 3),
        unnamedLinks,
        heroClip,
        bg: body.backgroundColor,
        color: body.color,
        title: document.title,
        canonical: document.querySelector('link[rel="canonical"]')?.href ?? "none",
        desc: (document.querySelector('meta[name="description"]')?.content ?? "").length,
        textLen: document.querySelector("main")?.innerText.replace(/\s+/g, " ").length ?? 0,
      };
    });
    // focus ring check
    await page.keyboard.press("Tab");
    const focus = await page.evaluate(() => {
      const el = document.activeElement;
      const s = getComputedStyle(el);
      return `${el.tagName.toLowerCase()}:${s.outlineStyle !== "none" ? "ring" : "none"}`;
    });
    rows.push({ tag, path, ...r, focus });
    await ctx.close();
  }
}
await browser.close();

for (const r of rows) {
  const flags = [];
  if (r.h1 !== 1) flags.push(`h1=${r.h1}`);
  if (r.overflowPx > 1) flags.push(`overflowX=${r.overflowPx}px ${r.wideEls.join(",")}`);
  if (r.badText.length) flags.push(`badText=${JSON.stringify(r.badText)}`);
  if (r.unnamedLinks) flags.push(`unnamedLinks=${r.unnamedLinks}`);
  if (!r.manrope || !r.mono) flags.push(`fonts=${r.manrope}/${r.mono}`);
  if (r.focus.endsWith("none")) flags.push(`focus=${r.focus}`);
  if (r.desc < 60) flags.push(`descLen=${r.desc}`);
  console.log(
    `${r.tag} ${r.path.padEnd(28)} ${String(r.textLen).padStart(5)}ch font=${r.font} h1=${r.h1} heroGrad=${r.heroClip ? "y" : "n"} bg=${r.bg} ${flags.length ? "FAIL " + flags.join(" | ") : "ok"}`
  );
}
