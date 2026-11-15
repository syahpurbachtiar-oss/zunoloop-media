"""KISI — pemeriksa statis sebelum render (menolak pelanggaran revisi Ari yang bisa dicek dari kode/naskah/riset).

Pakai: python3 -I lint_scene.py WORKDIR
Exit 1 bila ada pelanggaran (GAGAL). Peringatan (CEK) tidak menggagalkan tapi wajib dibaca.
Setiap aturan memakai kode revisi dari REVISI.md. Saat Ari memberi revisi baru: tambahkan baris di REVISI.md
DAN aturan di sini (atau di qc.py/zfight.py) bila bisa dicek otomatis.
"""
import json, os, re, sys
W = os.path.abspath(sys.argv[1])
s = open(f"{W}/scene.html").read()
d = json.load(open(f"{W}/data.json"))
rs = open(f"{W}/research.md").read() if os.path.exists(f"{W}/research.md") else ""
fail, warn = [], []
F = lambda code, msg: fail.append(f"[{code}] {msg}")
C = lambda code, msg: warn.append(f"[{code}] {msg}")
code = re.sub(r"//[^\n]*", "", s)  # abaikan komentar

# R08/R14 anti kedap-kedip
if "autoNear(" not in code: F("R08", "render(t) tidak memanggil autoNear(cam,tg,U) setelah cam.lookAt")
if "function coverPose" in code and not re.search(r"function coverPose\(\)\{[^}]*cam\.near", code): F("R19", "coverPose() tidak mengatur ulang cam.near")
if "kit/assets.js" not in code: C("R17", "scene tidak memakai kit/assets.js — benda umum (rumah, cerobong, pipa, truk, pohon, laut, ski, dinding panjat) WAJIB dari perpustakaan aset")
for mm in re.finditer(r"BoxGeometry\(m\(([\d.]+)\),m\(([\d.]+)\),m\(([\d.]+)\)\)[^;]*BackSide", code): pass
if re.search(r"side:THREE\.BackSide", code) and "polygonOffset" not in code: F("R14", "ada ruangan BackSide tetapi tidak ada polygonOffset pada lantai (lantai sebidang dengan alas ruangan)")

# R09 panah dilarang
n_arrow = len(re.findall(r"FX\.arrow\(", code))
if n_arrow: F("R09", f"{n_arrow} FX.arrow — panah tidak dipakai (keputusan Ari 14 Nov). Ganti dengan label/gerak 3D")

# R10 air bukan bola
for mm in re.finditer(r"(\w+(?:\.\w+)?)\s*=\s*dots\(([^;]*)\)", s):
    name, args = mm.group(1), mm.group(2)
    line = s[s.rfind("\n", 0, mm.start()) + 1:s.find("\n", mm.end())]
    if "/*butiran" in line: continue  # izin eksplisit: butiran yang memang butiran (tetes semprot halus, garam, debu) + alasan di komentar
    if re.search(r"(water|air|pour|flow|stream|spray|drip|jet|wat|tetes|hujan)", name, re.I) or re.search(r"0x(5fb4e8|7fc4e8|3fa2e0|2f8fe0|bfe6ff|9fd8f5|cfeeff)", args, re.I):
        F("R10", f"`{name}` memakai dots() untuk air — pakai L.pour/L.stream/L.body dari kit/water.js")
if re.search(r"ConeGeometry[^;]*(ff6a1a|ffd84a|ff7a1a|flame|api)", code, re.I): F("R15", "api dari ConeGeometry — pakai sprite gradasi aditif")

# R11 laut biru tua
for mm in re.finditer(r"(sea|laut)\w*\s*[:=][^;]*?noiseTex\('#([0-9a-f]{6})'", code, re.I):
    hx = mm.group(2); r, g, b = int(hx[:2], 16), int(hx[2:4], 16), int(hx[4:], 16)
    if not (b > r + 60 and b > g + 20 and (r + g + b) / 3 < 120): F("R11", f"warna laut #{hx} bukan biru tua (pakai AS.sea)")
if re.search(r"turb\?0x9a9a6a|sea[^;]*color[^;]*0x(9a9a6a|4f6a4a)", code): F("R11", "laut diwarnai hijau/zaitun tanpa dasar sumber")

# R18 pose sesuai aktivitas
for mm in re.finditer(r"(\w+)\.act\('(hold|idle)'", code):
    ctx = code[code.rfind(";", 0, max(0, mm.start() - 160)) + 1:mm.start()]  # pernyataan yang sama: posisi karakter
    if re.search(r"climb|panjat|wall|BZ0-|roofY|slope|yAt", ctx, re.I): F("R18", f"{mm.group(1)} memakai pose '{mm.group(2)}' di konteks memanjat/ski — pakai 'climb'/'ski' (+ AS.placeClimber / AS.skiGear)")

# R01 teks tidak menutupi wajah/emblem: overlay wajib mendaftarkan wajah + emblem
if "A.root" in code and "FX.avoidPts" not in code: F("R01", "maskot tampil tetapi wajah/emblem tidak didaftarkan ke FX.avoidPts")
if "A.root" in code and not re.search(r"A\.torso\.localToWorld\(V\(x_,y_,5\)\)", code): C("R01", "emblem dada tidak dilindungi (lihat blok overlay di examples/copenhill)")

# R24 anatomi & fisika karakter (otomatis per frame)
if re.search(r"C\.(ayah|ibu|kakak|adik|orang)|\bA\.act\(", code) and "checkCast(" not in code:
    F("R24", "karakter tampil tetapi render(t) tidak memanggil checkCast(THREE,C,sc,groundFn,{U}) dari kit/physics.js (kaki melayang/tembus, skala, sendi lepas)")
if re.search(r"(ayah|ibu|kakak|adik|orang|A)\.root\.scale\.(set|setScalar)", code): F("R24", "karakter di-scale — tinggi tubuh harus ukuran asli (C.M)")

# R05/R22 loop: shot terakhir = camA (frame pembuka)
last_shot = re.findall(r"S\((\d+),[\d.]+,\{set:'(\w+)',cam:\(u[^)]*\)=>\{([^}]*)\}", code)
if "camA()" not in code: F("R05", "tidak ada camA() (bidikan pembuka yang diulang di akhir untuk loop)")

# R21 hook & naskah
L = d.get("lines", [])
if L:
    if re.search(r"#\s*\d|dibongkar\s*#?\d", L[0], re.I): F("R21", "kalimat 1 memuat nomor seri")
    if len(L[0].split()) > 12: C("R21", f"kalimat 1 {len(L[0].split())} kata — inti hook harus terucap ≤2 detik")
    if not re.search(r"selamat", " ".join(L[-3:]), re.I): F("R22", "tidak ada kalimat 'Selamat…' di penutup")
    if "tts" in d and len(d["tts"]) != len(L): F("R07", "jumlah tts ≠ jumlah lines")
    if "tts" in d:
        for i, t in enumerate(d["tts"]):
            if re.search(r"\d", t): F("R07", f"tts kalimat {i+1} masih memuat angka — tulis ejaan lisan")

# R25 tokoh nyata & klaim berwaktu wajib dikenalkan lengkap (kasus "Ketuanya dulu habis… belum beli lagi", 15 Nov)
ROLE = r"\b(ketua|kepala|pemilik|pengelola|pendiri|direktur|petani|peternak|warga|ibu rumah tangga|pengurus)(nya)?\b"
for i, l in enumerate(L):
    if re.search(ROLE, l, re.I) and not re.search(r"\b(Pak|Bu|Bapak|Ibu|Mbak|Mas)\s+[A-Z]\w+|\b[A-Z]\w+,\s*(ketua|kepala|pemilik|pengelola|pendiri|direktur)", l) and re.search(r"(ketua|kepala|pemilik|pengelola|pendiri|direktur|pengurus)nya\b", l, re.I):
        F("R25", f"kalimat {i+1} menyebut tokoh ('...nya') tanpa nama + peran — tulis 'Pak <Nama>, ketua koperasinya, ...'")
    if re.search(r"\b(sejak|sampai sekarang|belum .{0,20}lagi|nggak .{0,20}lagi|tidak .{0,20}lagi)\b", l, re.I) and re.search(r"\b(beli|bayar|pakai|pernah|lagi)\b", l, re.I) and not re.search(r"\b(19|20)\d\d\b", l):
        F("R25", f"kalimat {i+1} klaim berwaktu ('sejak…/…lagi') tanpa tahun sumber — tambahkan 'sampai <bulan> <tahun>'")

# R27 benda dipegang wajib digenggam (kasus wajan melayang di antara dua tangan, 16 Nov)
if re.search(r"hand\w*\(\)\.add\(\s*hand\w*\(\)\s*\)\.multiplyScalar\(\s*\.5\s*\)", code) or re.search(r"\.copy\(\s*hand[RL]?\(\)\s*\)\.add\(", code):
    F("R27", "benda ditempatkan di titik tangan (melayang) — pakai c.hold(sisi, benda) + c.aim(...) dari kit/mascot.js supaya benar-benar digenggam")
if re.search(r"checkCast\(", code) and not re.search(r"checkCast\([^;]*\bt\s*[,}]", code):
    F("R26", "checkCast dipanggil tanpa {t} — arah jalan (mundur/di tempat/meluncur) tidak bisa dicek")

# R12/R16 riset
if not rs: F("R12", "research.md tidak ada")
else:
    if not re.search(r"\|\s*lokasi\s*\|", rs, re.I): F("R12", "tabel fakta research.md tidak punya kolom 'lokasi'")
    if not re.search(r"fakta visual", rs, re.I): F("R16", "research.md tidak punya tabel 'fakta visual' (warna/material/ukuran asli benda utama)")
    locs = set()
    for row in re.findall(r"^\|([^\n]*)\|\s*$", rs, re.M):
        cells = [c.strip() for c in row.split("|")]
        if len(cells) >= 4 and cells[0] not in ("fakta", "benda", "---", "") and not set(cells[0]) <= set("-: "): locs.add(cells[2].lower())
    locs -= {"lokasi", "", "—", "-"}
    if len(locs) > 2: C("R12", f"tabel fakta memuat beberapa lokasi {sorted(locs)} — pastikan semuanya fasilitas yang sama dengan judul")

for x in warn: print("CEK  ", x)
for x in fail: print("GAGAL", x)
print(f"\nlint: {len(fail)} gagal, {len(warn)} cek")
sys.exit(1 if fail else 0)
