# Demo video tools

How `drawstop-demo.mp4` (about 3:02, 1080p, burned-in English captions plus `.srt`) is built. Same method as the
Kept video: slides and recorded website clips fitted to each narrated scene of `../video-script.md`.
Needs Node, ffmpeg in PATH, Chrome, Bun (for `readback.ts`) and Python. Run everything from this folder.

1. **Voice (AI):** `python -m pip install --target pylib edge-tts==7.3.1`, then `PYTHONPATH=pylib python tts.py`
   writes `audio/rowN.mp3` + word timings. Voice en-US-AndrewNeural, an online Microsoft service: the script text is sent to it.
2. **Slides:** `node render-slides.js` renders `slides/slides.html` (same palette and type as the website).
3. **Screen:** `npm install`, then `node record.js` records the live site (read-only: scrolls and clicks its own controls).
4. **Scene 5:** `node make-terminal.js` replays the real CLI output in `../cre-simulate-live-2026-10-22.log` at its own
   timestamps, unedited; `bun readback.ts && node make-chain.js` reads the two attestations back from Sepolia (read-only).
5. **Check:** `node sheet.js <clip> 12` writes a contact sheet to `check/`.
6. **Edit:** `node compose.js` writes `out/drawstop-demo.mp4` and `.srt`.

## Your own voice

1. Record each paragraph of `逐字稿.txt` as `1.m4a` … `11.m4a` (any format), in one folder.
2. `node import-voice.js <folder>` → `voice/rawN.wav`.
3. `PYTHONPATH=wlib python align.py audio voice` (faster-whisper `small.en`, runs locally) → word timings in `voice/rowN.json`.
   Install once with `python -m pip install --target wlib faster-whisper`.
4. `node prep-voice.js voice 1.0` → light denoise, trimmed ends, long pauses shortened, into `voice/out/`.
5. `VOICE=voice/out node compose.js` → the same video, cut to your timing, captions re-timed.
