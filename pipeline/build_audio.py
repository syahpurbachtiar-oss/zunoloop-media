"""Gabung MP3 per kalimat jadi satu trek narasi + hitung timing.

Pakai: python3 build_audio.py WORKDIR [TARGET_DETIK]
Input : WORKDIR/mp3/01.mp3 .. NN.mp3 (urut sesuai kalimat), WORKDIR/data.json (punya "lines")
Output: WORKDIR/vo.wav, WORKDIR/music.wav, WORKDIR/mix.wav, dan data.json diisi starts/durs/total
"""
import json, os, subprocess, sys

W = sys.argv[1]
TARGET = float(sys.argv[2]) if len(sys.argv) > 2 else 90.0
GAP, LEAD, TAIL = 0.06, 0.25, 0.45
run = lambda *a: subprocess.run(a, check=True)
dur = lambda f: float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]))

d = json.load(open(f"{W}/data.json"))
n = len(d["lines"])
os.makedirs(f"{W}/trim", exist_ok=True); os.makedirs(f"{W}/sp", exist_ok=True)
for i in range(1, n + 1):
    run("ffmpeg", "-v", "error", "-y", "-i", f"{W}/mp3/{i:02d}.mp3", "-af",
        "silenceremove=start_periods=1:start_silence=0.03:start_threshold=-50dB:detection=peak,areverse,"
        "silenceremove=start_periods=1:start_silence=0.05:start_threshold=-50dB:detection=peak,areverse",
        "-ar", "44100", "-ac", "1", f"{W}/trim/{i:02d}.wav")
speech = sum(dur(f"{W}/trim/{i:02d}.wav") for i in range(1, n + 1))
fixed = GAP * (n - 1) + LEAD + TAIL
tempo = max(1.0, min(1.15, speech / max(1, TARGET - fixed)))
print(f"speech {speech:.2f}s -> tempo {tempo:.3f}")

starts, durs, t, files = [], [], LEAD, []
for i in range(1, n + 1):
    o = f"{W}/sp/{i:02d}.wav"
    run("ffmpeg", "-v", "error", "-y", "-i", f"{W}/trim/{i:02d}.wav", "-af", f"atempo={tempo:.4f}", "-ar", "44100", "-ac", "1", o)
    dd = dur(o); starts.append(round(t, 3)); durs.append(round(dd, 3)); files.append(o); t += dd + GAP
total = round(t - GAP + TAIL, 3)
if total > TARGET + 0.5:
    print(f"PERINGATAN: total {total:.1f}s > {TARGET}s — pendekkan naskah")

lst, prev = [], 0.0
def sil(x, k):
    f = f"{W}/sp/sil{k}.wav"
    run("ffmpeg", "-v", "error", "-y", "-f", "lavfi", "-i", "anullsrc=r=44100:cl=mono", "-t", f"{x:.4f}", f); return f
for k, (s, dd, f) in enumerate(zip(starts, durs, files)):
    if s - prev > 0.001: lst.append(sil(s - prev, k))
    lst.append(f); prev = s + dd
if total - prev > 0.001: lst.append(sil(total - prev, 999))
open(f"{W}/list.txt", "w").write("".join(f"file '{os.path.abspath(x)}'\n" for x in lst))
run("ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", f"{W}/list.txt", "-ar", "44100", "-ac", "1", f"{W}/vo.wav")

d.update(starts=starts, durs=durs, total=total)
json.dump(d, open(f"{W}/data.json", "w"), ensure_ascii=False, indent=1)

here = os.path.dirname(os.path.abspath(__file__))
run("python3", f"{here}/music.py", W)
run("ffmpeg", "-v", "error", "-y", "-i", f"{W}/vo.wav", "-i", f"{W}/music.wav", "-filter_complex",
    "[0:a]aformat=channel_layouts=mono,asplit=2[v1][vk];"
    "[vk]agate=threshold=0.02:ratio=1:attack=5:release=240[key];"
    "[1:a]aformat=channel_layouts=mono,volume=0.26[m];"
    "[m][key]sidechaincompress=threshold=0.035:ratio=9:attack=8:release=320:makeup=1[md];"
    "[v1][md]amix=inputs=2:normalize=0:dropout_transition=0,highpass=f=55,"
    "acompressor=threshold=-14dB:ratio=3:attack=12:release=220,loudnorm=I=-14:TP=-1.5:LRA=11,"
    "aformat=sample_fmts=fltp:channel_layouts=stereo[a]", "-map", "[a]", "-c:a", "pcm_s16le", f"{W}/mix.wav")
print(f"total {total}s, {n} kalimat, mix.wav siap")
