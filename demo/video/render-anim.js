// Renders one animated scene from anim/scenes.html to JPEG frames at 30 fps, frame by frame (deterministic: the page
// draws a pure function of time). Usage: node render-anim.js <spec.json>
//   spec: { scene, dur, cues: {name: seconds}, out }   -> out/00000.jpg ... + out/frames.json
const { chromium } = require("playwright-core");
const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");

const spec = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const FPS = 30;
const CHROME = process.env.CHROME || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const data = JSON.parse(fs.readFileSync(path.join(__dirname, "anim-data.json"), "utf8"));

(async () => {
  fs.rmSync(spec.out, { recursive: true, force: true });
  fs.mkdirSync(spec.out, { recursive: true });
  const browser = await chromium.launch({ executablePath: CHROME, headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto(pathToFileURL(path.join(__dirname, "anim", "scenes.html")).href, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(([s, d, c, x]) => window.setup(s, d, c, x), [spec.scene, spec.dur, spec.cues, data]);
  const n = Math.ceil(spec.dur * FPS);
  const frames = [];
  for (let i = 0; i < n; i++) {
    const t = i / FPS;
    await page.evaluate((t) => window.seek(t), t);
    const file = String(i).padStart(5, "0") + ".jpg";
    await page.screenshot({ path: path.join(spec.out, file), type: "jpeg", quality: 90 });
    frames.push({ file, t });
  }
  frames.push({ file: frames.at(-1).file, t: n / FPS });
  fs.writeFileSync(path.join(spec.out, "frames.json"), JSON.stringify({ name: spec.scene, frames }));
  console.log(`anim ${spec.scene}: ${n} frames, ${spec.dur.toFixed(1)} s`);
  await browser.close();
})();
