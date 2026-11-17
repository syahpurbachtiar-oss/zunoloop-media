"""Gerbang QC otomatis setelah render penuh. Video TIDAK boleh ke Buffer bila exit code != 0.

Pakai: python3 -I qc.py WORKDIR [VIDEO]   (VIDEO default WORKDIR/final.mp4)
Cek:
  1. Kedap-kedip: frame tunggal yang beda jauh dari kedua tetangganya padahal tetangganya mirip
     (z-fighting / objek hilang-muncul). Potongan shot biasa tidak terhitung.
  2. Pelanggaran overlay dari fx.js (panah menimpa subtitle, subtitle menimpa wajah) — WORKDIR/qc_fx.json dari render.py.
  3. Video: 1080x1920, ada audio, durasi = total data.json + 0.4 s sampul (toleransi 0.15 s).
  4. Loop: frame 0.4 s vs frame terakhir mirip (selisih rata-rata < 6, selain subtitle).
Juga membuat WORKDIR/qc/sheet_NN.png (1 frame per detik, 10 per lembar) untuk dicek mata SATU PER SATU.
"""
import glob, json, os, subprocess, sys
import numpy as np
from PIL import Image

W = os.path.abspath(sys.argv[1]); V = sys.argv[2] if len(sys.argv) > 2 else f"{W}/final.mp4"
fail = []
ld = lambda f: np.asarray(Image.open(f).convert("L").resize((135, 240)), dtype=np.float32)

# 1. kedap-kedip (dari frame PNG hasil render.py)
fs = sorted(glob.glob(f"{W}/frames/[0-9]*.png"))
if not fs: fail.append("frames/ kosong — jalankan render.py full dulu")
im = [ld(f) for f in fs]
dd = lambda a, b: float(np.abs(a - b).mean())
glitch = []
for i in range(1, len(im) - 1):
    a, b = dd(im[i - 1], im[i]), dd(im[i], im[i + 1])
    if a > 6 and b > 6 and dd(im[i - 1], im[i + 1]) < 0.35 * min(a, b): glitch.append((round(i / 30, 2), round(a, 1)))
print(f"[1] kedap-kedip: {len(glitch)} frame", glitch[:20])
if glitch: fail.append(f"{len(glitch)} frame kedap-kedip (detik: {[g[0] for g in glitch[:10]]}...)")

# 1b. R30 determinisme (dari render.py full): 2 browser harus identik, kalau tidak frame genap/ganjil kedap-kedip (kasus lantai pabrik 17 Nov)
try: det = json.load(open(f"{W}/qc_det.json"))
except Exception: det = {"ok": False, "beda": "qc_det.json tidak ada — render ulang dengan render.py full"}
print("[1b] determinisme 2 browser:", "OK" if det["ok"] else det["beda"])
if not det["ok"]: fail.append(f"render tidak deterministik (R30): {det['beda']}")

# 1c. R30 kedap-kedip lokal: ubin 8×16 px (di 360×640) yang berosilasi A-B-A-B dan kembali ke nilai semula ≥6 frame berturut
#     = tekstur beda antar-frame, z-fighting, atau efek strobo (rotor terlalu cepat). Partikel bergerak tidak kembali ke nilai semula → tidak terhitung.
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", V, "-vf", "scale=360:640,format=gray", "-f", "rawvideo", "-"], capture_output=True).stdout
G = np.frombuffer(raw, np.uint8).reshape(-1, 640, 360).astype(np.float32); run = np.zeros((39, 45), int); kedip = {}
for i in range(1, len(G) - 2):
    d1, d2, d3 = G[i] - G[i - 1], G[i + 1] - G[i], G[i + 2] - G[i + 1]
    if max(abs(d1).mean(), abs(d2).mean(), abs(d3).mean()) > 12: run[:] = 0; continue
    o = (d1 * d2 < 0) & (d2 * d3 < 0) & (abs(d1) > 10) & (abs(d2) > 10) & (abs(d3) > 10) & (abs(G[i + 1] - G[i - 1]) < 5) & (abs(G[i + 2] - G[i]) < 5)
    run = np.where(o[:624].reshape(39, 16, 45, 8).mean(axis=(1, 3)) > .08, run + 1, 0)
    if (run >= 6).any(): kedip[int(i / 30)] = max(kedip.get(int(i / 30), 0), int((run >= 6).sum()))
print("[1c] kedap-kedip lokal (detik: jumlah ubin):", sorted(kedip.items())[:20])
if kedip: fail.append(f"kedap-kedip lokal di detik {sorted(kedip)[:15]} (R30: tekstur acak/z-fighting/strobo)")

# 2. pelanggaran overlay
qf = f"{W}/qc_fx.json"
if os.path.exists(qf):
    v = json.load(open(qf)); print(f"[2] overlay: {len(v)} frame bermasalah", list(v.items())[:10])
    if v: fail.append(f"{len(v)} frame overlay bertabrakan (contoh: {list(v.items())[:3]})")
else: fail.append("qc_fx.json tidak ada — render.py lama?")

# 3. video
pr = json.loads(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "stream=codec_type,width,height,sample_rate:format=duration", "-of", "json", V]))
vs = [s for s in pr["streams"] if s["codec_type"] == "video"]; au = [s for s in pr["streams"] if s["codec_type"] == "audio"]
dur = float(pr["format"]["duration"]); want = json.load(open(f"{W}/data.json"))["total"] + 0.4
print(f"[3] video {vs[0]['width']}x{vs[0]['height']} audio={bool(au)} durasi {dur:.2f}/{want:.2f}")
if (vs[0]["width"], vs[0]["height"]) != (1080, 1920): fail.append("resolusi bukan 1080x1920")
if not au: fail.append("tanpa audio")
if au and int(au[0].get("sample_rate", 0)) > 48000: fail.append(f"audio {au[0]['sample_rate']} Hz — Instagram menolak (>48 kHz); encode ulang -ar 48000")
if abs(dur - want) > 0.15: fail.append(f"durasi {dur:.2f} != {want:.2f}")

# 4. loop
os.makedirs(f"{W}/qc", exist_ok=True)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", "0.4", "-i", V, "-frames:v", "1", f"{W}/qc/first.png"], check=True)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-sseof", "-0.05", "-i", V, "-frames:v", "1", f"{W}/qc/last.png"], check=True)
lp = dd(ld(f"{W}/qc/first.png"), ld(f"{W}/qc/last.png")); print(f"[4] loop selisih {lp:.2f}")
if lp > 6: fail.append(f"frame akhir tidak sama dengan frame awal (selisih {lp:.1f})")

# lembar kontak 1 frame/detik untuk cek mata
for f in glob.glob(f"{W}/qc/sheet_*.png"): os.remove(f)
secs = list(range(0, int(dur)))
for k in range(0, len(secs), 10):
    grp = secs[k:k + 10]; sheet = Image.new("RGB", (216 * 5, 384 * 2), "white")
    for j, s in enumerate(grp):
        p = f"{W}/qc/t.png"; subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(s + .5), "-i", V, "-frames:v", "1", p], check=True)
        sheet.paste(Image.open(p).resize((216, 384)), ((j % 5) * 216, (j // 5) * 384))
    sheet.save(f"{W}/qc/sheet_{k // 10:02d}.png")
print(f"lembar kontak: {W}/qc/sheet_*.png ({(len(secs) + 9) // 10} lembar) — WAJIB dibuka semua")

print("\nQC GAGAL:\n- " + "\n- ".join(fail) if fail else "\nQC LULUS (otomatis). Lanjut cek mata semua lembar kontak.")
sys.exit(1 if fail else 0)
