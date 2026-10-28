// Screenshots of the real public records shown in the video (Crown copyright, Open Government Licence v3.0;
// Sourcify). Cookie banners are hidden with CSS for the screenshot; no consent is given or refused.
// Usage: node capture-real.js   -> real/*.png
const { chromium } = require("playwright-core");
const fs = require("fs");
const path = require("path");
const OUT = path.join(__dirname, "real");
fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const b = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
  const p = await b.newPage({ viewport: { width: 1400, height: 900 }, deviceScaleFactor: 2 });
  const go = async (url) => { await p.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 }); await p.evaluate(() => {
    // hide the cookie banner: the block around the "Cookies on ..." heading (no consent given or refused)
    const hd = [...document.querySelectorAll("h1,h2,h3,p")].find((e) => /^Cookies on /.test(e.textContent.trim()));
    if (!hd) return;
    let e = hd; while (e.parentElement && e.parentElement !== document.body && e.parentElement.textContent.length < 1500) e = e.parentElement;
    e.style.display = "none";
  }); await p.waitForTimeout(2500); };
  // element that contains a given text (smallest such block)
  const shot = async (text, file, pad = 12, up = 0) => {
    const box = await p.evaluate(([t, up]) => {
      const all = [...document.querySelectorAll("p, li, dd, dl, div, td, tr, h1, section, article")].filter((e) => e.textContent.replace(/\s+/g, " ").includes(t) && e.getBoundingClientRect().height > 0);
      all.sort((a, b) => a.textContent.length - b.textContent.length);
      let e = all[0]; for (let i = 0; i < up; i++) e = e.parentElement;
      e.scrollIntoView({ block: "center" });
      const r = e.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height };
    }, [text, up]);
    await p.waitForTimeout(300);
    await p.screenshot({ path: path.join(OUT, file), clip: { x: Math.max(0, box.x - pad), y: Math.max(0, box.y - pad), width: box.width + 2 * pad, height: box.height + 2 * pad } });
    console.log(file, Math.round(box.width), "x", Math.round(box.height));
  };

  await go("https://www.thegazette.co.uk/notice/5219886");
  await shot("presented on 11 August 2026", "gz-petition-text.png", 14);
  await shot("Publication date:", "gz-petition-details.png", 10, 1);
  await p.screenshot({ path: path.join(OUT, "gz-petition-page.png") });

  await go("https://www.thegazette.co.uk/insolvency/notice?text=&categorycode-all=all&noticetypes=2450&sort-by=");
  await p.screenshot({ path: path.join(OUT, "gz-petitions-list.png"), fullPage: false });

  await go("https://find-and-update.company-information.service.gov.uk/company/11877818/filing-history");
  await shot("Order of court to wind up", "ch-filing-cocomp.png", 10, 1);

  await go("https://repo.sourcify.dev/11155111/0x911646d683E2D9bFF45DEc5BcEE9b0bc142a0Ab0");
  await p.screenshot({ path: path.join(OUT, "sourcify-facility.png") });
  await b.close();
})();
