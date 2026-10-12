// WCAG contrast audit: walks visible text nodes on each route and reports any
// element whose text colour sits too close to its resolved background.
//   npm run build && npm run preview:lan && node scripts/contrast.mjs
const pw = await import(process.env.PLAYWRIGHT_PATH ?? "playwright");
const { chromium } = pw.default ?? pw;

const BASE = process.env.BASE ?? "http://127.0.0.1:4321";
const launch = { executablePath: process.env.BROWSER_PATH ?? undefined };

const ROUTES = [
  "/", "/en/", "/servicios/", "/proyectos/", "/proyectos/odooclaw/", "/sobre-mi/", "/contacto/",
];

const luma = (rgb) => {
  const [r, g, b] = rgb.map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const browser = await chromium.launch(launch);
const page = await browser.newPage();
await page.setViewportSize({ width: 1440, height: 900 });

const report = [];

for (const route of ROUTES) {
  await page.goto(BASE + route, { waitUntil: "load" });
  await page.waitForTimeout(route === "/" || route === "/en/" ? 2500 : 700);

  const bad = await page.evaluate((lumaSrc) => {
    const luma = eval("(" + lumaSrc + ")");
    const parse = (s) => {
      // Chrome returns modern syntax for some colours: color(srgb r g b / a) is 0..1.
      const m = s.match(/color\(\s*srgb\s+([^)/]+)/);
      if (m) return m[1].trim().split(/\s+/).slice(0, 3).map((v) => Math.round(parseFloat(v) * 255));
      return (s.match(/[\d.]+/g) || []).slice(0, 3).map(Number);
    };
    const alphaOf = (s) => {
      const m = s.match(/rgba?\(([^)]+)\)/);
      if (!m) return 1;
      const parts = m[1].split(/[,/]/).map((x) => parseFloat(x));
      return parts.length > 3 ? parts[3] : 1;
    };
    const bgOf = (el) => {
      let node = el;
      while (node && node !== document.documentElement) {
        const c = getComputedStyle(node).backgroundColor;
        if (c && alphaOf(c) > 0.05) {
          const [r, g, b] = parse(c);          const a = alphaOf(c);
          return [r * a + 10 * (1 - a), g * a + 10 * (1 - a), b * a + 10 * (1 - a)];
        }
        node = node.parentElement;
      }
      return [10, 10, 10];
    };

    const out = [];
    for (const el of document.querySelectorAll("a, button, h1, h2, h3, p, li, span, dd, dt")) {
      const text = (el.textContent || "").trim();
      if (!text || text.length > 90) continue;
      const r = el.getBoundingClientRect();
      if (r.width < 4 || r.height < 4) continue;
      const cs = getComputedStyle(el);
      if (cs.opacity === "0" || parseFloat(cs.opacity) < 0.92) continue;
      if (el.closest(".sr-only")) continue;
      // Gradient headline: colour is transparent by design, contrast is the gradient's.
      if (cs.webkitBackgroundClip === "text" || cs.backgroundClip === "text") continue;
      // Pre-animation states: reveal words and un-revealed blocks are meant to be dim
      // until they cross the trigger line; the reduced-motion path shows them at full.
      if (el.matches("[data-word]:not(.is-in)")) continue;
      if (el.closest("[data-reveal]:not(.is-in)")) continue;
      const fg = parse(cs.color);
      const bg = bgOf(el);
      const [l1, l2] = [luma(fg), luma(bg)].sort((a, b) => b - a);
      const ratio = (l1 + 0.05) / (l2 + 0.05);
      const px = parseFloat(cs.fontSize);
      const bold = parseInt(cs.fontWeight || "400", 10) >= 700;
      const min = px >= 24 || (px >= 18.66 && bold) ? 3 : 4.5;
      if (ratio < min) {
        out.push({
          tag: el.tagName.toLowerCase(),
          cls: (el.className || "").toString().slice(0, 46),
          text: text.slice(0, 34),
          px: Math.round(px),
          ratio: Number(ratio.toFixed(2)),
          min,
          fg: cs.color,
          bg: bg.map((v) => Math.round(v)).join(","),
        });
      }
    }
    return out;
  }, luma.toString());

  report.push({ route, bad });
  console.log(`${route.padEnd(24)} ${bad.length === 0 ? "ok" : bad.length + " low-contrast"}`);
  for (const b of bad.slice(0, 8)) {
    console.log(
      `   ${b.tag}.${b.cls} "${b.text}" ${b.px}px ratio=${b.ratio} (min ${b.min}) fg=${b.fg} bg=${b.bg}`
    );
  }
}

await browser.close();
const total = report.reduce((n, r) => n + r.bad.length, 0);
console.log(total ? `\n${total} low-contrast element(s)` : "\nall text passes WCAG AA");
process.exit(total ? 1 : 0);
