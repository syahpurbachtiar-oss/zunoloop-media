# REVISI.md — semua revisi Ari + penegaknya (KISI)

Aturan: **revisi yang sudah tercatat di sini TIDAK BOLEH terulang.** Setiap revisi punya penegak:
- **OTOMATIS** = skrip menolak (exit ≠ 0) → video tidak boleh lanjut.
- **KIT** = sudah ditanam di kit/perpustakaan aset; kalau memakai kit dengan benar, kesalahannya tidak bisa muncul.
- **MATA** = wajib dicek mata di langkah yang disebut; tulis hasilnya di baris log ("R04 ok").

Urutan gerbang per video: `lint_scene.py` (sebelum render penuh) → render → sampul → `qc.py` → `zfight.py` → cek mata semua `qc/sheet_*.png` dengan daftar MATA di bawah → baru Buffer.
**Saat Ari memberi revisi baru:** (1) tambah baris di sini dengan kode R berikutnya, (2) tambahkan pemeriksa otomatis bila mungkin (lint_scene.py / qc.py / zfight.py) atau tanam di kit, (3) catat aturannya di PLAYBOOK, (4) uji pemeriksa pada video lama yang melanggar — harus tertangkap.

| kode | tanggal | revisi Ari | penegak |
|---|---|---|---|
| R01 | 11 Nov | Teks (subtitle, label, chip, boom) tidak boleh menutupi wajah, emblem dada, layar HP, part yang dibahas | OTOMATIS: `fx.js` + `qc_fx.json` (subtitle-wajah, boom-hilang) via `qc.py`; lint wajib `FX.avoidPts` wajah+emblem |
| R02 | 11 Nov | Dunia 3D masuk akal: skala nyata (C.M), lokasi utuh, tidak ada yang tembus, karakter hanya di tempat logis | KIT (assets.js berukuran meter) + MATA (4c) |
| R03 | 11 Nov | Caption: CTA tebakan biner yang nyambung isi video, bukan "komen alat apa" | MATA (langkah Buffer) |
| R04 | 12 Nov | Gigi putih polos tanpa bintik; mulut terlihat di pose awal/akhir | KIT (mascot.js) + MATA crop close-up "Selamat" |
| R05 | 12 Nov | Ending: Selamat → zoom out → frame terakhir IDENTIK frame pembuka (loop) | OTOMATIS: `qc.py` [4] loop < 6; lint wajib `camA()` |
| R06 | 12 Nov | Kamera adegan interior harus di dalam ruangan | MATA (4c) |
| R07 | 13 Nov | Suara HANYA Gemini; angka & merek di `tts` ditulis ejaan lisan | OTOMATIS: lint (tts tanpa digit, jumlah = lines) + `gemini_verify.py` |
| R08 | 14 Nov | Tidak ada kedap-kedip (frame meloncat) | OTOMATIS: `qc.py` [1]; lint wajib `autoNear` |
| R09 | 14 Nov | Panah tidak dipakai (mengganggu, tidak jelas) | OTOMATIS: lint (FX.arrow = 0) |
| R10 | 14 Nov | Air = cairan 3D kontinu, BUKAN bola-bola (bola hanya mikroba/garam/debu) | OTOMATIS: lint (dots untuk air ditolak; butiran sah wajib komentar `/*butiran: alasan*/`) + KIT water.js |
| R11 | 14 Nov | Laut biru tua; jangan mengarang warna (laut hijau) | OTOMATIS: lint warna laut + KIT `AS.sea` |
| R12 | 14 Nov | Satu video = satu lokasi/fasilitas (kasus Dubai + Israel) | OTOMATIS: lint kolom `lokasi` + peringatan multi-lokasi; MATA cek fakta akhir |
| R13 | 14 Nov | QC wajib sebelum Buffer; tidak boleh "buat lalu lempar" | OTOMATIS: urutan gerbang di atas; baris QC di log wajib |
| R14 | 14 Nov | Tidak ada permukaan sebidang (atap rumah berkedip, lantai ruangan) | OTOMATIS: `zfight.py`; lint BackSide+polygonOffset; KIT `AS.house` atap menjorok |
| R15 | 14 Nov | Asap/uap = kepulan lembut, bongkahan bersegi, api = sprite (bukan bola/kerucut) | OTOMATIS: lint (api ConeGeometry) + MATA |
| R16 | 15 Nov | Semua benda mengikuti kenyataan: tabel **fakta visual** (warna/material/ukuran dari foto/sumber) sebelum coding | OTOMATIS: lint (tabel fakta visual wajib) + MATA ("kalau ini foto asli, apa yang palsu?") |
| R17 | 15 Nov | Sambungan menyatu, bukan ditempel (cerobong berkerah, pipa berflens, kaki mesin berpelat) | KIT `AS.chimney`/`AS.pipe`; lint peringatan bila tidak memakai assets.js |
| R18 | 15 Nov | Pose sesuai aktivitas (pemanjat menempel dinding + harness + tali; pemain ski lutut menekuk + tongkat di tangan) | OTOMATIS: lint (hold/idle di dinding/lereng ditolak) + KIT pose `climb`/`ski`/`work`, `AS.placeClimber`, `AS.skiGear` |
| R19 | 14 Nov | Sampul: judul satu baris muat, benda tidak terpotong, near-plane direset | OTOMATIS: lint `coverPose` + MATA `cover.png` |
| R20 | 13 Nov | Jangan beruntun topik jijik sejenis (tinja ditahan) | MATA saat pilih topik; baris `[-]` di topics.md dilewati |
| R21 | 10–11 Nov | Hook inti terucap ≤2 detik, tanpa nomor seri | OTOMATIS: lint kalimat 1 |
| R22 | 11 Nov | Ada adegan "Selamat!" di penutup | OTOMATIS: lint |
| R23 | 15 Nov | Bila kenyataan berlawanan dugaan penonton (lintasan ski hijau, bukan salju), naskah/chip WAJIB menjelaskannya | MATA (naskah) |
| R24 | 15 Nov | Tubuh karakter tanpa cacat: mata, tangan, kaki, badan proporsional; kaki menapak (tidak melayang/tembus); ukuran tubuh asli; sendi tidak lepas; pose sesuai permukaan (lereng → pose ski, dinding → climb) | OTOMATIS: `kit/physics.js` `checkCast` per frame → qc_fx.json → `qc.py` GAGAL; lint wajib checkCast & larang scale karakter. Bila `mascot.js` diubah: render `pipeline/examples/pose-gallery` (semua tokoh × pose × sudut) dan cek mata dulu |
| R25 | 15 Nov | Tokoh nyata dikenalkan lengkap (nama + peran: "Pak Suhadi, ketua koperasinya"), bukan "ketuanya" tiba-tiba; klaim berwaktu ("sejak…/belum beli lagi") wajib diberi batas waktu sumber ("sampai Maret 2021"); visual klaim perbandingan menunjukkan dulu vs sekarang (5 tabung → 0), bukan satu benda diam | OTOMATIS: lint (peran + -nya tanpa nama; 'sejak/…lagi' tanpa tahun) + MATA (visual dulu→sekarang) |
| R26 | 16 Nov | Karakter berjalan harus MAJU searah hadapan badan dan punya tujuan yang jelas di cerita (kasus SPBU: jalan mundur tanpa konteks); pose diam tidak boleh meluncur | OTOMATIS: `physics.js checkCast(...,{U,t})` → `jalan-mundur`, `jalan-di-tempat`, `meluncur` ke qc_fx.json → qc.py GAGAL; lint wajib `{t}` di checkCast. MATA: tiap adegan jalan punya tujuan (membawa sesuatu ke tempat yang disebut naskah) |
| R27 | 16 Nov | Benda yang dipegang harus digenggam realistis (kasus wajan melayang di antara dua tangan, gagang menusuk wajah); ukuran benda sesuai tangan (botol 600 mL, jerigen 5 L); menuang = wadah dimiringkan, mulut tepat di atas tujuan, aliran jatuh tegak | OTOMATIS: lint menolak benda ditempel ke titik tangan (`handR().add(...)`); KIT `c.hold(sisi, benda)` (jari menggenggam, benda jadi anak tangan) + `c.aim(...)` (pergelangan diputar dalam batas sendi) + pose `carry`/`show`/`pour`; `AS.oilBottle`, `AS.jerrycan({grip:true})`. MATA: crop tangan tiap adegan memegang |
| R28 | 17 Nov | Tidak ada benda yang tembus benda lain (kasus botol menembus dinding tong sampah) — tumpukan disusun fisik, benda jatuh berhenti di atas tumpukan | OTOMATIS: `kit/collide.js` `COL.check` per frame (`tembus-*`, `tembus-lantai-*`) → qc_fx.json → qc.py GAGAL; lint wajib makeCollide + COL.check{t,shot} + COL.solid/COL.item; KIT `COL.settle` untuk tumpukan. Uji: scene botol v1 tertangkap (`tembus-botol-tong-tong`, lint R28 GAGAL) |
| R29 | 17 Nov | Benda masuk mesin lewat bukaan nyata (corong terbuka, konveyor bersekat yang kepalanya di atas corong), tidak menembus dinding/lenyap di udara; mesin berbentuk & berukuran nyata (rangka, motor, transmisi, corong, saluran keluar, panel) dan prosesnya terlihat detail (luar + penampang) | OTOMATIS: `COL.check` → `hilang-*`/`muncul-*` bila benda lenyap/muncul di layar di luar `COL.intake`; lint R29 (mesin berlabel tanpa COL.intake = GAGAL). MATA: tiap mesin dicocokkan dengan baris mesin di tabel fakta visual research.md |
| R30 | 17 Nov | Tidak boleh ada yang kedap-kedip, termasuk lantai/ubin & tekstur (kasus lantai pabrik & bal botol berkedip: tekstur dibuat dengan Math.random → 2 worker render punya pola berbeda → frame genap/ganjil selang-seling) | OTOMATIS: lint menolak Math.random/Date.now/performance.now di scene; render.py mengunci Math.random (seed) di semua halaman + GERBANG determinisme sebelum render penuh (2 browser, urutan berbeda, harus identik → qc_det.json); qc.py [1b] GAGAL bila tidak deterministik + [1c] ubin berosilasi A-B-A-B ≥6 frame berturut. Uji: botol v2 tertangkap (lint R30 GAGAL, 1246 titik berkedip) |
