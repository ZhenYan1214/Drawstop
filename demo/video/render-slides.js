// Renders slides/slides.html to 1920x1080 PNGs, one per slide id. Usage: node render-slides.js
const { chromium } = require("playwright-core");
const path = require("path");
const { pathToFileURL } = require("url");

const DIR = path.join(__dirname, "slides");
const NAMES = ["holdout", "plain", "freeze", "s127", "close"];
const CHROME = process.env.CHROME || "C:/Program Files/Google/Chrome/Application/chrome.exe";

(async () => {
  const browser = await chromium.launch({ executablePath: CHROME, headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  for (const name of NAMES) {
    await page.goto(`${pathToFileURL(path.join(DIR, "slides.html")).href}#${name}`);
    await page.reload();
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(DIR, `${name}.png`) });
    console.log("wrote", name);
  }
  await browser.close();
})();
