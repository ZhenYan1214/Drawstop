// Builds the demo video: website clips, slides and replays fitted to each narrated scene, the voiceover, and
// burned-in captions (plus a matching .srt).
// Usage: node compose.js [out.mp4]          AI voice from audio/rowN.mp3 + rowN.json (tts.py)
//        VOICE=voice/out node compose.js    your own voice: rowN.wav + rowN.json (align.py, then prep-voice.js)
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const ROOT = __dirname;
const VOICE = path.resolve(ROOT, process.env.VOICE || "audio");
const OUT = path.resolve(process.argv[2] || path.join(ROOT, "out", "drawstop-demo.mp4"));
const BUILD = path.join(ROOT, "build");
fs.mkdirSync(BUILD, { recursive: true });
fs.mkdirSync(path.dirname(OUT), { recursive: true });

const LEAD = 0.5; // silence before each scene's narration
const TAIL = 1.0; // beat after it
const ff = (args) => execFileSync("ffmpeg", ["-loglevel", "error", "-y", ...args], { cwd: BUILD, stdio: ["ignore", "inherit", "inherit"] });
const slash = (p) => p.replace(/\\/g, "/");
// concat needs one image codec throughout: PNG slides and replays are converted to JPEG once, into build/jpg/.
const JPG = path.join(BUILD, "jpg");
fs.mkdirSync(JPG, { recursive: true });
const asJpg = (file) => {
  if (!/\.png$/i.test(file)) return file;
  const out = path.join(JPG, path.relative(ROOT, file).replace(/[:\\/]/g, "_").replace(/\.png$/i, ".jpg"));
  if (!fs.existsSync(out) || fs.statSync(out).mtimeMs < fs.statSync(file).mtimeMs)
    execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-i", file, "-q:v", "1", out]);
  return slash(out);
};

const N = 11;
const rows = [...Array(N)].map((_, i) => JSON.parse(fs.readFileSync(path.join(VOICE, `row${i}.json`), "utf8")));
const audioFile = (i) => ["mp3", "wav", "m4a"].map((x) => path.join(VOICE, `row${i}.${x}`)).find((f) => fs.existsSync(f));
const spoken = rows.map((r) => r.words.at(-1).t + r.words.at(-1).d);
const HOLD = { 4: 2.0 }; // extra seconds after the narration, by scene index (scene 5: time to read the on-chain card)
const dur = spoken.map((s, i) => LEAD + s + TAIL + (HOLD[i] || 0));
const wordAt = (row, re, nth = 0) => {
  const hits = rows[row].words.map((w, k) => (re.test(w.w) ? k : -1)).filter((k) => k >= 0);
  if (hits.length <= nth) throw new Error(`word ${re} not in scene ${row + 1}`);
  return LEAD + rows[row].words[hits[nth]].t;
};

const clipData = (name) => JSON.parse(fs.readFileSync(path.join(ROOT, "clips", name, "frames.json"), "utf8"));
// The hero clip is the page loading: use its last (fully loaded) frame, however fast the page came up.
const lastFrameAt = (name) => { const f = clipData(name).frames; return f.at(-1).t - f[0].t; };
const markAt = (name, label) => clipData(name).marks.find((m) => m.label === label).t - clipData(name).frames[0].t;
const slide = (name, until) => ({ slide: path.join(ROOT, "slides", `${name}.png`), until });
// from/to: seconds from the clip's first frame (undefined = clip start/end)
const clip = (name, until, from, to) => ({ clip: name, until, from, to });

const plan = [
  /* 1 */ [clip("exhibit", wordAt(0, /^October/) - 0.3), slide("holdout", wordAt(0, /^Drawstop$/) - 0.2), clip("hero", undefined, lastFrameAt("hero"))],
  /* 2 */ [slide("plain", wordAt(1, /^But$/) - 0.2), clip("record")],
  /* 3 */ [slide("freeze")],
  /* 4 */ [clip("mechanism")],
  /* 5 */ [clip("terminal", wordAt(4, /^Broadcast/) - 0.2), clip("chain")],
  /* 6 */ [clip("sepolia", undefined, 0, markAt("sepolia", "act1-end"))],
  /* 7 */ [clip("sepolia", undefined, markAt("sepolia", "act1-end"), markAt("sepolia", "act2-start"))],
  /* 8 */ [clip("sepolia", undefined, markAt("sepolia", "act2-start"))],
  /* 9 */ [slide("s127")],
  /* 10 */ [clip("checked")],
  /* 11 */ [clip("limits", wordAt(10, /^Drawstop/) - 0.2), slide("close")],
];

// Frames of a clip between from and to (seconds from its start), each with its own on-screen time.
function clipFrames({ clip: name, from = 0, to }) {
  const j = clipData(name);
  const dir = path.join(ROOT, "clips", name);
  const t0 = j.frames[0].t, end = j.frames.at(-1).t - t0;
  const b = to === undefined ? end : to;
  let first = 0;
  while (first + 1 < j.frames.length && j.frames[first + 1].t - t0 <= from) first++;
  const fr = j.frames.slice(first).filter((f, k) => k === 0 || f.t - t0 <= b);
  return fr.map((f, k) => ({
    file: slash(path.join(dir, f.file)),
    d: k + 1 < fr.length ? fr[k + 1].t - Math.max(f.t, t0 + from) : Math.max(0.3, t0 + b - f.t),
  }));
}

// Each segment is encoded on its own (images of one kind per segment), then the segments of a scene are joined,
// so a slide next to recorded frames can never be dropped by the concat demuxer.
const VF = "scale=1920:1080:flags=lanczos,fps=30,format=yuv420p,setsar=1";
const ENC = ["-c:v", "libx264", "-preset", "medium", "-crf", "18", "-r", "30"];
function renderRow(i) {
  const segs = [];
  let t = 0;
  plan[i].forEach((seg, s) => {
    const until = seg.until ?? dur[i];
    const slot = until - t;
    if (slot <= 0.05) throw new Error(`scene ${i + 1}: empty slot`);
    const out = `row${i}_${s}.mp4`;
    if (seg.slide) {
      ff(["-loop", "1", "-framerate", "30", "-i", asJpg(seg.slide), "-vf", VF, "-t", slot.toFixed(3), ...ENC, out]);
    } else {
      const fr = clipFrames(seg);
      const total = fr.reduce((a, f) => a + f.d, 0);
      const k = slot / total;
      console.log(`scene ${i + 1}: ${seg.clip} ${total.toFixed(1)}s -> ${slot.toFixed(1)}s (x${(1 / k).toFixed(2)})`);
      const list = fr.map((f) => ({ file: asJpg(f.file), d: f.d * k }));
      const txt = list.map((f) => `file '${f.file}'\nduration ${f.d.toFixed(4)}`).join("\n") + `\nfile '${list.at(-1).file}'\n`;
      fs.writeFileSync(path.join(BUILD, `row${i}_${s}.txt`), txt);
      ff(["-f", "concat", "-safe", "0", "-i", `row${i}_${s}.txt`, "-vf", `${VF},tpad=stop_mode=clone:stop_duration=2`, "-t", slot.toFixed(3), ...ENC, out]);
    }
    segs.push(out);
    t = until;
  });
  fs.writeFileSync(path.join(BUILD, `row${i}.txt`), segs.map((f) => `file '${f}'`).join("\n") + "\n");
  ff(["-f", "concat", "-safe", "0", "-i", `row${i}.txt`, "-vf", "tpad=stop_mode=clone:stop_duration=1", "-t", dur[i].toFixed(3), ...ENC, `row${i}.mp4`]);
}

// Captions: the script text cut into short cues, timed by the voice's word boundaries.
function cues(i, offset) {
  const words = rows[i].words;
  const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
  const tokens = rows[i].text.replace(/[‘’]/g, "'").split(/\s+/).filter(Boolean);
  const at = [];
  let w = 0, acc = "";
  tokens.forEach((tok) => {
    if (w >= words.length) w = words.length - 1;
    at.push(w);
    acc += norm(tok);
    if (acc.length >= norm(words[w].w).length) { w++; acc = ""; }
  });
  const groups = [];
  let cur = [];
  tokens.forEach((tok, k) => {
    cur.push(k);
    if (/[.?!:;]["']?$/.test(tok) || k === tokens.length - 1) { groups.push(cur); cur = []; }
  });
  const text = (g) => g.map((k) => tokens[k]).join(" ");
  const split = (g) => {
    if (text(g).length <= 80) return [g];
    let best = -1, score = 1e9;
    g.forEach((k, n) => {
      if (n === g.length - 1) return;
      const left = text(g.slice(0, n + 1)).length, s = Math.abs(left - text(g).length / 2) - (/[,;:]$/.test(tokens[k]) ? 30 : 0);
      if (s < score) { score = s; best = n; }
    });
    return [...split(g.slice(0, best + 1)), ...split(g.slice(best + 1))];
  };
  const out = groups.flatMap(split).map((g) => {
    const a = words[at[g[0]]], b = words[at[g.at(-1)]];
    return { start: offset + LEAD + a.t, end: offset + LEAD + b.t + b.d, text: text(g) };
  });
  out.forEach((c, k) => { c.end = Math.min(c.end + 0.5, k + 1 < out.length ? out[k + 1].start - 0.05 : c.end + 0.8); });
  return out;
}
const stamp = (s) => {
  const ms = Math.round(s * 1000), h = Math.floor(ms / 3.6e6), m = Math.floor(ms / 6e4) % 60, x = Math.floor(ms / 1000) % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(x).padStart(2, "0")},${String(ms % 1000).padStart(3, "0")}`;
};

const offsets = dur.map((_, i) => dur.slice(0, i).reduce((s, d) => s + d, 0));
const total = offsets.at(-1) + dur.at(-1);
console.log("scenes:", dur.map((d) => d.toFixed(1)).join(" "), "total", total.toFixed(1));

const pick = process.env.ROWS ? process.env.ROWS.split(",").map((n) => Number(n) - 1) : plan.map((_, i) => i);
if (!process.env.ONLY_SRT) pick.forEach((i) => renderRow(i));
if (process.env.ROWS) process.exit(0);

const all = rows.flatMap((_, i) => cues(i, offsets[i]));
const srt = all.map((c, k) => `${k + 1}\n${stamp(c.start)} --> ${stamp(c.end)}\n${c.text}\n`).join("\n");
fs.writeFileSync(path.join(BUILD, "captions.srt"), srt);
fs.writeFileSync(OUT.replace(/\.mp4$/, ".srt"), srt);
console.log(`${all.length} cues, longest ${Math.max(...all.map((c) => c.text.length))} chars`);
if (process.env.ONLY_SRT) process.exit(0);

fs.writeFileSync(path.join(BUILD, "rows.txt"), plan.map((_, i) => `file 'row${i}.mp4'`).join("\n") + "\n");
ff(["-f", "concat", "-safe", "0", "-i", "rows.txt", "-c", "copy", "video.mp4"]);

const ins = rows.flatMap((_, i) => ["-i", audioFile(i)]);
const delays = rows.map((_, i) => `[${i}]adelay=${Math.round((offsets[i] + LEAD) * 1000)}:all=1[a${i}]`).join(";");
ff([...ins, "-filter_complex", `${delays};${rows.map((_, i) => `[a${i}]`).join("")}amix=inputs=${rows.length}:normalize=0,apad,atrim=0:${total.toFixed(3)},loudnorm=I=-16:TP=-1.5:LRA=11[a]`,
  "-map", "[a]", "-ar", "48000", "-c:a", "aac", "-b:a", "192k", "voice.m4a"]);

fs.copyFileSync(process.env.FONT || "C:/Windows/Fonts/arial.ttf", path.join(BUILD, "arial.ttf"));
const style = "FontName=Arial,FontSize=11,PrimaryColour=&H00FFFFFF,OutlineColour=&H50141A1A,BorderStyle=3,Outline=5,Shadow=0,MarginV=30,MarginL=40,MarginR=40";
ff(["-i", "video.mp4", "-i", "voice.m4a", "-vf", `subtitles=captions.srt:fontsdir=.:force_style='${style}'`,
  "-map", "0:v", "-map", "1:a", "-c:v", "libx264", "-preset", "medium", "-crf", "19", "-pix_fmt", "yuv420p", "-c:a", "copy", "-movflags", "+faststart", OUT]);
console.log("wrote", OUT);
