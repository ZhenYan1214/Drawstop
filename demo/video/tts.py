"""Synthesises the narration of demo/video-script.md, one MP3 per scene, with word timings.

Usage: PYTHONPATH=pylib python tts.py [video-script.md] [out-dir] [voice] [rate]
Reads the scene rows "| n | screen | narration | notes |" and writes rowN.mp3 plus rowN.json
({n, text, voice, rate, words:[{t, d, w}]}) for N = 0, 1, ... in scene order.
The voice is Microsoft's online en-US-AndrewNeural by default, so the narration text is sent to that service.
"""
import asyncio, json, re, sys
from pathlib import Path
import edge_tts

here = Path(__file__).resolve().parent
script = Path(sys.argv[1]) if len(sys.argv) > 1 else here.parent / "video-script.md"
out = Path(sys.argv[2]) if len(sys.argv) > 2 else here / "audio"
voice = sys.argv[3] if len(sys.argv) > 3 else "en-US-AndrewNeural"
rate = sys.argv[4] if len(sys.argv) > 4 else "+0%"
out.mkdir(parents=True, exist_ok=True)

rows = []
for line in script.read_text(encoding="utf-8").splitlines():
    if re.match(r"^\|\s*\d+\s*\|", line):
        cells = [c.strip() for c in line.split("|")]
        rows.append({"n": int(cells[1]), "text": cells[3]})


async def synth(i, row):
    comm = edge_tts.Communicate(row["text"], voice, rate=rate, boundary="WordBoundary")
    words = []
    with open(out / f"row{i}.mp3", "wb") as f:
        async for chunk in comm.stream():
            if chunk["type"] == "audio":
                f.write(chunk["data"])
            elif chunk["type"] == "WordBoundary":
                words.append({"t": chunk["offset"] / 1e7, "d": chunk["duration"] / 1e7, "w": chunk["text"]})
    (out / f"row{i}.json").write_text(json.dumps({**row, "voice": voice, "rate": rate, "words": words}, indent=1), encoding="utf-8")
    spoken = (words[-1]["t"] + words[-1]["d"]) if words else 0
    print(f"scene {row['n']:>2}: spoken {spoken:5.1f}s  {len(row['text'].split())} words")


async def main():
    for i, row in enumerate(rows):
        await synth(i, row)


asyncio.run(main())
