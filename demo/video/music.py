"""Original background music for the demo video, synthesised from scratch (no samples, no licence questions).

A quiet documentary bed in A minor: soft pad chords (Am - F - C - G - Am - F - Dm - E), a sub bass, and a
plucked arpeggio with a little echo. No drums, so it never competes with the narration.

Usage: PYTHONPATH=<dir with numpy> python music.py <seconds> <out.wav>
"""
import sys, wave
import numpy as np

SR = 48000
dur = float(sys.argv[1]) if len(sys.argv) > 1 else 230.0
out = sys.argv[2] if len(sys.argv) > 2 else "audio/music.wav"
rng = np.random.default_rng(7)

def hz(midi):
    return 440.0 * 2 ** ((midi - 69) / 12)

# chords as MIDI notes (pad voicing), one chord per bar of 4 s
A3, C4, E4, F3, A4, G3, B3, D4, D3, F4, E3, Gs3 = 57, 60, 64, 53, 69, 55, 59, 62, 50, 65, 52, 56
CHORDS = [
    (45, [A3, C4, E4]),        # Am
    (41, [F3, A3, C4]),        # F
    (48, [G3, C4, E4]),        # C
    (43, [G3, B3, D4]),        # G
    (45, [A3, C4, E4]),        # Am
    (41, [F3, A3, C4]),        # F
    (38, [F3, A3, D4]),        # Dm
    (40, [Gs3, B3, E4]),       # E
]
BAR = 4.0
n = int(dur * SR)
t = np.arange(n) / SR
left = np.zeros(n)
right = np.zeros(n)

def env(length, attack, release):
    e = np.ones(length)
    a = min(int(attack * SR), length)
    r = min(int(release * SR), length - a)
    e[:a] = np.linspace(0, 1, a) ** 2
    if r > 0:
        e[length - r:] = np.linspace(1, 0, r) ** 1.5
    return e

def add(buf, start, sig):
    s = int(start * SR)
    if s >= n:
        return
    e = min(n, s + len(sig))
    buf[s:e] += sig[: e - s]

bars = int(np.ceil(dur / BAR))
for b in range(bars):
    bass, pad = CHORDS[b % len(CHORDS)]
    t0 = b * BAR
    # pad: three notes, two detuned voices each, gentle 2nd harmonic, overlapping release
    L = int((BAR + 1.6) * SR)
    tt = np.arange(L) / SR
    e = env(L, 1.4, 1.8)
    for k, m in enumerate(pad):
        f = hz(m)
        v = (np.sin(2 * np.pi * f * 0.998 * tt) + np.sin(2 * np.pi * f * 1.002 * tt) + 0.35 * np.sin(2 * np.pi * 2 * f * tt) + 0.15 * np.sin(2 * np.pi * 3 * f * tt)) * e * 0.05
        pan = 0.35 + 0.15 * k
        add(left, t0, v * (1 - pan) * 2)
        add(right, t0, v * pan * 2)
    # sub bass
    f = hz(bass)
    v = np.sin(2 * np.pi * f * tt) * env(L, 0.5, 1.6) * 0.05
    add(left, t0, v)
    add(right, t0, v)
    # plucked arpeggio, eighth notes at 60 bpm, an octave up, with a 3/8 echo
    arp = [pad[0] + 12, pad[1] + 12, pad[2] + 12, pad[1] + 12] * 2
    for j, m in enumerate(arp):
        if b == 0 and j < 4:
            continue  # let the first bar breathe
        f = hz(m)
        P = int(1.2 * SR)
        tp = np.arange(P) / SR
        pl = (np.sin(2 * np.pi * f * tp) + 0.45 * np.sin(2 * np.pi * 2 * f * tp) + 0.2 * np.sin(2 * np.pi * 3 * f * tp)) * np.exp(-tp * 4.2) * env(P, 0.005, 0.2) * 0.13
        st = t0 + j * 0.5
        side = 0.3 if j % 2 else 0.7
        add(left, st, pl * side * 2)
        add(right, st, pl * (1 - side) * 2)
        add(left, st + 0.75, pl * 0.35 * (1 - side) * 2)
        add(right, st + 0.75, pl * 0.35 * side * 2)

# bell: two octaves up on beats 1 and 3 from the second bar, soft, so small speakers hear the harmony
for b in range(1, bars):
    bass, pad = CHORDS[b % len(CHORDS)]
    for j, m in enumerate([pad[2] + 24, pad[0] + 24]):
        f = hz(m)
        P = int(2.0 * SR)
        tp = np.arange(P) / SR
        bell = (np.sin(2 * np.pi * f * tp) + 0.25 * np.sin(2 * np.pi * 2.76 * f * tp)) * np.exp(-tp * 2.2) * env(P, 0.004, 0.3) * 0.035
        add(left, b * BAR + j * 2.0, bell * (0.6 if j else 0.4) * 2)
        add(right, b * BAR + j * 2.0, bell * (0.4 if j else 0.6) * 2)

# tiny bit of air so silence is not digital
noise = rng.normal(0, 0.0015, n)
left += noise
right += noise

# fades, normalise to -1 dBFS peak
fade_in, fade_out = int(2.5 * SR), int(5.0 * SR)
for buf in (left, right):
    buf[:fade_in] *= np.linspace(0, 1, fade_in)
    buf[-fade_out:] *= np.linspace(1, 0, fade_out)
peak = max(np.abs(left).max(), np.abs(right).max())
stereo = np.stack([left, right], axis=1) / peak * 0.89
pcm = (stereo * 32767).astype("<i2")
with wave.open(out, "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print(f"wrote {out}: {dur:.1f} s")
