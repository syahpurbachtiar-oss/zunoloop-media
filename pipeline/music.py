"""Musik latar sintetis (Am-F-C-G, pad + arpeggio + kick + hat) + whoosh tiap ganti adegan.
Pakai: python3 music.py WORKDIR  (baca data.json: starts, total) -> WORKDIR/music.wav"""
import json, sys
import numpy as np, soundfile as sf

W = sys.argv[1]; d = json.load(open(f"{W}/data.json"))
SR = 44100; TOTAL = d["total"]; ST = d["starts"]; n = int(SR * TOTAL)
rng = np.random.default_rng(len(d["lines"]) * 7 + int(TOTAL))
out = np.zeros(n)

def env(start, dur, a, dc):
    i0 = int(start * SR); L = min(int(dur * SR), n - i0)
    if i0 >= n or L <= 0: return None, None
    e = np.ones(L); ai = max(1, int(a * SR)); di = max(1, min(int(dc * SR), L))
    e[:min(ai, L)] = np.linspace(0, 1, min(ai, L)); e[-di:] *= np.linspace(1, 0, di); return i0, e

def tone(f, start, dur, amp, a=.02, dc=.3, harm=(1, .3, .12)):
    i0, e = env(start, dur, a, dc)
    if i0 is None: return
    tt = np.arange(len(e)) / SR; w = sum(h * np.sin(2 * np.pi * f * k * tt) for k, h in enumerate(harm, 1))
    out[i0:i0 + len(e)] += w * e * amp

NOTE = lambda s: 440 * 2 ** (s / 12)
CH = [[-12, -9, -5, 0], [-16, -9, -4, 0], [-9, -5, 0, 4], [-14, -7, -2, 2]]
BAR = 3.9
for b in range(int(TOTAL / BAR) + 2):
    c = CH[b % 4]; s = b * BAR
    for sm in c: tone(NOTE(sm) / 2, s, BAR * 1.02, .055, a=.5, dc=1.1, harm=(1, .18, .06))
    for q in range(8): tone(NOTE(c[[0, 2, 1, 3, 2, 1, 3, 2][q]]) * 2, s + q * BAR / 8, .42, .028, a=.004, dc=.34, harm=(1, .22, .08))
    for k in (0, 2):
        i0, e = env(s + k * BAR / 4, .26, .002, .24)
        if i0 is None: continue
        tt = np.arange(len(e)) / SR; out[i0:i0 + len(e)] += np.sin(2 * np.pi * (112 * np.exp(-tt * 22) + 44) * tt) * e * .2
    for q in range(8):
        i0, e = env(s + q * BAR / 8 + BAR / 16, .05, .001, .045)
        if i0 is None: continue
        h = rng.standard_normal(len(e)); h = h - np.convolve(h, np.ones(9) / 9, 'same'); out[i0:i0 + len(e)] += h * e * .022
for s in ST[2:]:
    i0, e = env(s - .18, .42, .05, .36)
    if i0 is None: continue
    nz = rng.standard_normal(len(e)); f = np.clip(.02 + np.arange(len(e)) / SR * 6, 0, .95)
    y = np.zeros(len(e)); acc = 0.0
    for i in range(len(e)): acc += f[i] * (nz[i] - acc); y[i] = nz[i] - acc
    out[i0:i0 + len(e)] += y * e * .075
out = out / max(1e-9, np.abs(out).max()) * .72
sf.write(f"{W}/music.wav", out.astype(np.float32), SR)
