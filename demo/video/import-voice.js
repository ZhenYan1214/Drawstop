// Copies your recordings into voice/ for align.py: <dir>/1.<ext> ... <dir>/11.<ext> -> voice/raw0.wav ... raw10.wav
// (mono, 48 kHz). Any audio format ffmpeg reads. Usage: node import-voice.js <dir-with-recordings>
const fs = require("fs"), path = require("path"), { execFileSync } = require("child_process");
const src = path.resolve(process.argv[2]), out = path.join(__dirname, "voice");
fs.mkdirSync(out, { recursive: true });
const files = fs.readdirSync(src);
for (let n = 1; n <= 11; n++) {
  const f = files.find((x) => path.parse(x).name.trim() === String(n));
  if (!f) throw new Error(`no recording named ${n}.* in ${src}`);
  execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-i", path.join(src, f), "-ac", "1", "-ar", "48000", path.join(out, `raw${n - 1}.wav`)]);
  console.log(`${f} -> voice/raw${n - 1}.wav`);
}
