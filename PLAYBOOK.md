# PLAYBOOK — Video harian ZunoLoop (otomatis)

Tujuan tiap run: 1 video edukasi 3D 9:16 berbahasa Indonesia (85–115 detik) → push ke repo ini → jadwalkan ke YouTube, Instagram, TikTok via Buffer pada **19:30 WIB hari yang sama**. Tidak ada manusia yang menunggu: jangan bertanya, ambil keputusan terbaik, catat di `log.md`.

Contoh kualitas yang jadi patokan: `pipeline/examples/mesin-cuci/` (scene.html + data.json) dan `videos/mesin-cuci-3d.mp4`.

## 0. Persiapan (±3 menit)
```bash
cd <repo>/pipeline && npm i three@0.170.0 --no-audit --no-fund
pip install --break-system-packages soundfile numpy   # playwright + chromium sudah ada
SLUG=<slug-topik>; W=/tmp/zl/$SLUG; mkdir -p $W/mp3; ln -s <repo>/pipeline/node_modules $W/node_modules; ln -s <repo>/pipeline/kit $W/kit
```
Cek kuota Buffer dulu: `get_account` → org `6ac1597aca8206e9ab9d50f7`, batas `scheduledPosts` = 10 untuk SELURUH organisasi. `list_posts` status scheduled; kalau sisa slot < 3, berhenti dan catat di log (jangan hapus post orang lain).

## 1. Topik
Ambil baris pertama yang belum dicentang di `topics.md` (format: [P1|P2] slug — topik | HOOK). Antrean sudah selang-seling dua pilar:
- **P1 "Dari Jijik Jadi Berguna"**: bahan menjijikkan/terbuang → diolah jadi berguna.
- **P2 "Di Balik Hal Biasa"**: sistem raksasa tak terlihat di balik hal yang dialami tiap hari. Pola wajib: mulai dari aksi kecil sehari-hari si "kamu" (kirim chat, scan QRIS, naik lift) → kamera ZOOM OUT ke skala sistemnya (menara, kabel bawah laut, satelit, pusat data) → ZOOM IN sampai level mekanisme terkecil yang terverifikasi (sensor, sinyal, elektron, katup). Bedah lebih dalam dari "cara dibuat": tunjukkan KENAPA tiap komponen harus ada. Hindari topik yang mekanismenya rahasia perusahaan (tidak bisa diverifikasi).

## 1b. Riset (WAJIB sebelum menulis — tidak boleh mengarang)
- Cari dengan WebSearch/WebFetch minimal **3 sumber terpercaya**, utamakan sumber primer: situs resmi lembaga/perusahaan (NASA, PUB Singapura, Gates Foundation, Climeworks, operator fasilitas), jurnal/universitas, badan pemerintah/PBB, lalu media besar (BBC, Reuters, AP, National Geographic, dll). Hindari blog anonim, konten AI, forum, dan situs tanpa penulis/tanggal.
- Pahami prosesnya sampai detail: urutan tahap, nama mesin/komponen, prinsip kerjanya, angka kunci (kapasitas, persen, suhu, tahun, lokasi).
- Tulis `$W/research.md`: daftar sumber (judul, penerbit, URL, tanggal) + **tabel fakta**: `fakta | angka/nama | sumber #`. Setiap fakta harus ada di ≥1 sumber terpercaya; angka penting dicek silang ke ≥2 sumber bila memungkinkan.
- Kalau sumber berbeda, pakai angka yang paling konservatif/terbaru dan sebutkan secara umum ("hampir", "lebih dari"). Kalau sebuah klaim di hook/topik ternyata tidak terbukti, **perbaiki hook-nya** agar akurat (jangan dipaksakan) dan catat di log.
- Tidak boleh ada kalimat naskah yang memuat fakta di luar tabel fakta. Penyederhanaan boleh, distorsi tidak.
- Salin `research.md` ke repo `research/<slug>.md` saat publikasi.

## 2. Naskah (18–26 kalimat, total 230–320 kata → video 85–115 detik) — seri "Dibongkar" (P1 / P2)
Durasi 85–115 detik (keputusan Ari 10 Nov 2026, patokan akun @kalbotau ±1:45 dengan 1,29 juta likes): cukup panjang supaya tiap masalah & solusi tersampaikan utuh. Panjang hanya boleh dari tahap nyata, setiap kalimat WAJIB masalah→solusi baru atau visualisasi masalahnya, bukan pengisi. Tempo cepat: ganti shot tiap 2–4 detik. Hook + masalah pertama harus selesai dalam 3 detik pertama.
TANPA nomor seri ("Dibongkar #N" dihapus dari judul, caption, dan naskah — keputusan Ari 11 Nov 2026). Gaya: kasual, kalimat pendek, "kamu", bahasa Indonesia sehari-hari. Semua fakta dari `research.md`.
FORMAT WAJIB = rantai MASALAH → SOLUSI bertahap, persis seperti video mesin cuci (`pipeline/examples/mesin-cuci/data.json`). Penonton "ikut membangun" sistemnya dari versi paling primitif; tiap kalimat menutup satu masalah dan membuka masalah baru, sehingga penonton terus penasaran ke kalimat berikutnya.
- K1 = HOOK. **Inti kejutannya harus terucap dalam 2 detik pertama** (≤ 10 kata, kata kuncinya di depan), mis. "Chat WA-mu nyelam ke dasar laut dulu!" — BUKAN "Chat WA-mu ke kakak di Belanda… hampir pasti nyelam…". Boleh mengganti hook `topics.md` asal lebih bikin berhenti scroll DAN tetap akurat (tabel fakta). **Judul video = hook ini persis** (lihat langkah 7).
- K2 = versi PALING PRIMITIF dengan sudut "kamu": "Kalau kamu cuma <cara paling sederhana>, kamu udah <setengah jalan>… tapi <masalah besar>."
- K3..K(n-2) = tiap kalimat = SATU masalah nyata dari tahap sebelumnya + SATU solusi (mesin/part/tahap nyata) dengan pola bergantian:
  "Tapi <masalah>. Jadi kamu pasang/tambah <solusi>." · "Masalahnya, <masalah baru>. Makanya <solusi>." · "Terus <efek samping solusi tadi>…"
  Solusi selalu memunculkan masalah berikutnya (efek samping, bahaya, sisa kotoran, energi, dll). Jangan ada kalimat yang cuma informasi tanpa masalah/solusi. Sisipkan 1 angka mengejutkan yang terverifikasi.
- K(n-1) = "Selamat, kamu udah bikin <sistem>." + payoff singkat bila muat (mis. "…airnya lebih bersih dari air keranmu.").
- K(n) = ajakan singkat tanpa nomor seri, mis. "Follow, besok kita bongkar yang lain… mau apa?" (≤ 12 kata).
Contoh pembuka (kencing-astronot): K1 "Astronot di luar angkasa minum air kencingnya sendiri… dan airnya lebih bersih dari air keranmu." K2 "Kalau kamu cuma saring pakai kain, kotorannya nyangkut… tapi baunya dan zat garamnya masih ikut." K3 "Tapi di luar angkasa nggak ada gravitasi, air nggak mau netes ke bawah. Jadi kamu pasang drum yang muter biar airnya kepental ke dinding." …
Topik bertanda SENSITIF: tone hormat & ilmiah, tanpa candaan.
Tulis ke `$W/data.json`:
`{"slug","hook":"<versi singkat hook, KAPITAL, ≤28 karakter>","lines":[...],"chips":[...],"problems":[...],"stageKeys":[...],"keys":[...]}`
(`problems` = masalah singkat per kalimat untuk baris kecil label tahap, KAPITAL ≤22 karakter, "" bila tidak ada. `stageKeys` = bagian judul tahap yang disorot biru: satu kata, frasa beberapa kata, atau "*" untuk seluruh judul — pilih yang paling enak dibaca. `keys` = kata/frasa yang dikotak biru di subtitle bawah. `stageKeys` dan `keys` TIDAK harus sama.)
(`chips` = nama tahap/mesin per kalimat, kosong "" untuk K1, K2, dua terakhir; KAPITAL, ≤18 karakter.)
Adegan 3D: K1–K2 tampilkan "bahan jijik/awal" (P1) atau aksi sehari-hari si ayah (P2) secara bersih & tidak vulgar; tahap proses = mesin/alat/fasilitas nyata; adegan akhir = hasil/sistem utuh.

### 2a. DUNIA 3D HARUS MASUK AKAL (WAJIB — revisi Ari 11 Nov 2026)
1. **Skala dunia nyata.** Semua benda dimodelkan dengan ukuran asli × `C.M` (unit per meter dari kit; ayah = 1,70 m). Patokan: pintu 0,9×2,1 m · rumah 1 lantai ±3,5 m (atap ±5–6 m) · motor 1,9 m panjang × 1,1 m tinggi · mobil 4,5×1,5 m · kotak pos ±1,2 m · tiang listrik 9–12 m · menara BTS 30–60 m · kapal kabel 100–150 m · kabel laut dalam ±2–3 cm (dekat pantai berlapis baja ±5 cm) · repeater ±1 m · rak server 2 m · HP ±15 cm. Orang TIDAK boleh lebih besar dari rumah/kendaraan. Kalau ukuran asli membuat karakter tidak bisa memegang/berinteraksi dengan benda, JANGAN dipaksakan (jangan perbesar benda/perkecil orang) — tampilkan bendanya sendiri dengan close-up.
2. **Karakter hanya di tempat yang masuk akal.** Karakter muncul di darat/rumah/jalan/kantor/dek kapal/ruang server (sebagai pengunjung/teknisi). TIDAK di bawah laut, di dalam kabel/pipa/mesin, di luar angkasa, atau di skala mikroskopis. Karakter TIDAK wajib ada di setiap adegan; adegan tanpa karakter dijelaskan lewat suara, label, panah, chip.
3. **Lokasi terpisah dan utuh, BUKAN diorama potongan.** Dilarang "potongan tanah" (rumah lalu tanahnya terpotong tegak jadi laut, sisi tanah terlihat seperti kue lapis). Tiap tempat dibuat sebagai lingkungan nyata yang utuh dan menerus ke cakrawala (tanah/rumput/jalan meluas, laut meluas, langit): mis. **Adegan rumah** (rumah, jalan, BTS di sebelah) → **adegan pantai** (stasiun kabel di tepi pantai, kamera turun dari pasir ke ombak lalu menyelam) → **adegan dasar laut** (pasir, batu, kabel, repeater) → **adegan data center**. Perpindahan tempat lewat gerak kamera (terbang/menyelam/zoom) atau cut, bukan dipaksakan dalam satu frame.
4. **Penampang/cutaway HANYA untuk benda**, bukan untuk geografi: boleh memotong kabel serat optik, mesin, pipa, HP untuk menunjukkan isinya (mis. inti kaca + cladding + pelindung dengan berkas cahaya memantul). Konsep abstrak (kecepatan cahaya, enkripsi, sinyal) WAJIB divisualkan lewat benda 3D nyata seperti ini, bukan karakter di ruang kosong dengan garis.
5. **Tidak ada yang tembus.** Benda padat bertemu benda padat (jangkar–kabel, tangan–HP, kaki–lantai, kapal–air, kabel–batu) harus berhenti di permukaan atau menimbulkan akibat fisik yang benar: jangkar menyangkut → kabel tertarik → PUTUS jadi dua potongan dengan ujung serabut terlihat. Yang boleh "menembus" hanya yang di dunia nyata memang tidak padat: aliran air, berkas cahaya/laser, gelombang sinyal, dan grafis (panah/label).
6. **Peran karakter logis.** `ayah` = "kamu". Penerima pesan/orang lain dewasa = `ibu` atau `orang` (dewasa generik). Penyadap/orang jahat/orang asing = `orang` (JANGAN anggota keluarga, apalagi anak). Anak hanya sebagai anak (bertanya, ikut melihat).
**Gaya @kalbotau (WAJIB, hasil bedah 10 Nov 2026):**
- **Gagal dulu, baru solusi:** tiap MASALAH divisualkan terjadi di layar (melengkung, patah, bocor, runtuh, meledak kecil) dengan panah merah + chip "✗ <masalah>"; solusinya lalu muncul dan diuji ulang dengan chip "✓ <hasil>". Boleh efek teks onomatope besar miring (mis. "KRAAAK!", "BLUP!") dan efek mundur "◀◀ ULANG" saat percobaan gagal.
- **Label tahap kiri atas** (di bawah UI nama akun): baris kecil KAPITAL "• MASALAH: <masalah singkat>" + judul tahap tebal; sorotan biru = `stageKeys[i]` (kata, frasa, atau "*" seluruh judul).
- **Subtitle karaoke**: per kelompok 2–4 kata, hanya kata yang sudah diucapkan yang tampil (TANPA kata abu-abu/transparan), kata aktif pop; sorotan biru = `keys[i]`. Semua ini sudah ditangani `FX.karaoke`.
- **Label nama part di scene** (teks kecil KAPITAL + garis penunjuk) saat part pertama kali muncul; `FX.label` otomatis menghindari tabrakan dengan subtitle/label lain dan tidak keluar layar (kalau tidak ada tempat, label tidak ditampilkan — pilih posisi lain).
- **SAFE ZONE teks**: y < 300 px (nama akun/"Audio asli"), y > 1500 px (caption/deskripsi aplikasi), dan x > 960 px (tombol like/share) tidak boleh berisi teks penting.
- **TIDAK ADA YANG TUMPANG TINDIH (revisi Ari 11 Nov 2026)**: teks apa pun (boom/SELAMAT!, ULANG, chip, label, subtitle) TIDAK boleh menutupi wajah karakter, emblem/dada jaket, layar HP, atau part yang dibahas; panah TIDAK boleh menimpa label tahap, label, chip, atau wajah. Caranya: setiap frame, setelah `FX.begin()`, daftarkan area terlindung: `FX.avoidPts(titikWajah, 18, true)`, `FX.avoidPts(titikEmblem, 8, true)`, `FX.avoidPts(sudutLayarHP, 4, true)` (lihat `render()` di `pipeline/examples/gps-einstein/scene.html`). FX lalu otomatis memindahkan/mengecilkan teks ke ruang kosong, memotong panah, dan menggeser subtitle. Kalau teks penting hilang karena tidak ada ruang, mundurkan kamera (beri langit/latar kosong), jangan matikan perlindungan.
- **Label tahap** kini teks putih + garis tepi gelap + bayangan (terbaca di langit, laut, maupun luar angkasa) — jangan diganti hitam.
- **Tangan**: jari & ibu jari bersendi; panggil `C.ayah.grip(1,true)` untuk tangan yang memegang HP (ibu jari menyusuri tepi lalu melengkung ke depan layar; jari menopang di belakang). Jari tidak boleh tampak patah/menekuk ke arah tidak wajar.
- **Memegang HP**: HP bertumpu di telapak (punggung HP di depan telapak, jari & ibu jari di belakang/tepi) — tidak boleh ada jari/tangan masuk ke HP. Close-up layar HP = sudut pandang mata karakter (POV) dengan tangan memegang HP terlihat; sembunyikan lengan lain yang terlalu dekat kamera.
- **Analogi sehari-hari** minimal 1 (mis. "kayak penggaris: tidur gampang ditekuk, berdiri susah banget") dan konteks Indonesia (motor, sawah, gang, dll) bila relevan.
- **Visual cerah & REALISTIS**: siang hari terang, tapi SEMUA objek (maskot, part, mesin, bangunan, lingkungan) 3D detail ala video mesin cuci: material PBR (logam/plastik/karet/kain/kaca/beton), bevel, baut, sambungan, tekstur. DILARANG gaya low-poly/kotak/kartun datar. Objek lingkungan di `kit-demo` (pohon kerucut, pipa polos, rumah sederhana) hanya placeholder — wajib diganti model detail sesuai topik.
- **Ending (disepakati 11 Nov 2026)**: adegan "Selamat!" = close-up ayah selebrasi (dada ke atas, wajah utuh) + konfeti + `boom('SELAMAT!')` 1–2 detik → kamera mundur ke shot lebar yang proporsional (ayah boleh kecil di frame) → frame terakhir dibuat menyambung ke frame pembuka K1 (lokasi, angle, pose ayah sama) supaya video berulang mulus. **Revisi Ari 12 Nov 2026:** urutan akhir = close-up "Selamat!" → zoom out → bidikan lebar yang SAMA PERSIS dengan frame pertama setelah sampul (scene t=0: kamera, pose, ekspresi, FOV identik; satu fungsi pose `aK()` + `camA()` dipakai K1 dan K19). Di pose awal/akhir mulut ayah HARUS terlihat jelas (senyum kecil yang terbaca di bidikan lebar), jangan terlihat seperti tak punya mulut. Cek: ambil frame di 0.4 s dan frame terakhir `final.mp4` (ffmpeg `-ss 0.4` dan `-sseof -0.05`), bandingkan dengan Read — hanya subtitle yang boleh beda.
- Jangan menyalin aset, karakter, nama, atau kalimat khas akun itu; ambil polanya saja.

**Kit maskot & efek (WAJIB dipakai, `pipeline/kit/`)** — contoh lengkap: `pipeline/examples/kit-demo/scene.html`, pratinjau: `pipeline/kit/preview-maskot.png`.
- `makeCast(THREE,RoundedBoxGeometry,cam)` → `ayah` (tokoh utama = "kamu", tampil di K1 dan "Selamat", plus adegan lain yang secara fisik masuk akal — lihat 2a), `ibu`, `kakak`, `adik`, `orang` (dewasa generik bertopi). Jangan ganti desain/warna/emblem dan JANGAN ubah `root.scale` — skala karakter sudah ukuran asli; benda yang menyesuaikan pakai `C.M` (unit per meter).
- Mata otomatis menatap kamera; untuk menatap benda yang dibahas isi `C.ayah.gaze = new THREE.Vector3(...)` (posisi dunia). Atur posisi kamera SEBELUM memanggil `act()`.
- DILARANG T-pose / kedua lengan lurus ke samping. Karakter selalu sedang melakukan aksi yang cocok. Close-up wajah minimal sebatas dada (wajah utuh, tidak terpotong).
- Tiap frame: `C.ayah.act(aksi, detikSejakMulaiAksi, ekspresi)`. Aksi: idle, walk, wave, point, think, shock, celebrate, facepalm, present, hold, crouch. Ekspresi: normal, happy, shock, worried, think, wink. Sesuaikan aksi dengan kalimat: masalah → shock/facepalm + worried; ide solusi → think lalu point; hasil → present/celebrate + happy.
- `makeFX(...)` dipanggil di `render(t)` setelah `R.render`: `FX.begin()` → `stage(problems[i], judulTahap, stageKeys[i], u)` → `karaoke(lines[i], keys[i], progres)` → efek momen (label/chip/arrow/emote/boom…) → `FX.end()` (WAJIB: label & chip digambar di sini setelah dicek tabrakan). Ganti overlay lama (#hb/#chip/#cap) dengan FX; hook tetap tampil besar di K1 (pakai `FX.boom` atau stage).
- Kuota minimal per video: ≥4 `arrow` (merah = gaya/masalah, biru = aliran, hijau = solusi), ≥4 `chip` (✗ bad untuk tiap masalah, ✓ good untuk tiap solusi), ≥6 `label` nama part, ≥3 `emote` (!, ?, idea, sweat, love — hanya di adegan yang ada karakternya), ≥2 `boom` onomatope (KRAAAK!, BLUP!, WUSSH!, DUAR!), ≥1 `rewind` (ULANG) setelah percobaan gagal, `lines` untuk angin/panas/kecepatan bila relevan, `confetti` + `boom('SELAMAT!')` di adegan akhir, `flash` kecil tiap ganti adegan.
- Gerak kamera ala @kalbotau: **ganti shot setiap 2–4 detik — juga DI DALAM satu kalimat panjang** (satu kalimat 7 detik = minimal 2 shot). Dilarang satu angle bertahan > 4 detik. Campur wide, close-up reaksi (shock/think), POV/over-the-shoulder, top-down untuk skala, dan punch-in cepat saat momen gagal.
**Hook visual 2 detik pertama (WAJIB):** begitu sampul 0.4 s lewat, K1 langsung menampilkan momen paling aneh/kontras (mis. bubble chat terjun menyelam ke laut) dengan gerak kamera cepat (punch-in/whip), bukan wide shot diam. `hook` di data.json berupa pertanyaan/klaim kontras (mis. "KENCING JADI AIR MINUM?") dan tampil besar di layar sepanjang K1.

## 3. Suara
**Utama dan satu-satunya (keputusan Ari 13 Nov 2026): Gemini TTS** (Google AI Studio, domain `generativelanguage.googleapis.com`); JANGAN pakai layanan suara lain. API key dibaca dari variabel environment `GEMINI_API_KEY` (diset Ari SEKALI di pengaturan environment cloud, 11 Nov 2026) — JANGAN pernah ditulis ke repo/memori/log dan JANGAN minta key ke Ari lagi; kalau variabel kosong, JANGAN ganti ke suara lain: simpan riset+naskah+scene di `wip/<slug>/`, kembalikan centang topik ke `[ ]`, catat di log "tertahan: GEMINI_API_KEY kosong" dan kabari Ari. Catatan: kuota gratis ±10 permintaan/hari PER MODEL, jadi buat SELURUH naskah dalam SATU permintaan (`gemini-2.5-flash-preview-tts`, voice `Puck`, teks = kalimat dipisah baris kosong, TANPA instruksi gaya karena ikut terbaca), lalu potong audio per kalimat dengan pencarian jeda diam (DP: pilih N−1 titik diam terdekat dengan proporsi jumlah kata; jangan pakai penanda waktu dari model teks — hasilnya melebihi durasi audio, tidak bisa dipakai, terbukti 11 Nov 2026), simpan ke `$W/mp3/NN.mp3`, verifikasi semua potongan dengan transkripsi (`gemini-3.5-flash`; retry bila HTTP 429; salah dengar nama seperti "Pureit" tidak masalah selama urutan benar). Angka dan nama merek ditulis ejaan lisan di versi `tts` di data.json ("empat puluh delapan", "New Water"), teks tampil tetap angka. Tempo 1.0 bila total ≤ 115 detik. Satu video = satu suara (jangan campur model/suara). Skrip siap pakai (key dari env `GEMINI_API_KEY`): `python3 pipeline/gemini_tts.py $W` → `$W/full.wav`; `python3 pipeline/gemini_cut.py $W` → potong ke `$W/mp3/NN.mp3` (buat dulu folder `mp3/`); `python3 pipeline/gemini_verify.py $W` → cetak "bermasalah: 0" bila lolos; lanjut `build_audio.py`.
Lalu: `python3 pipeline/build_audio.py $W 115` (115 = batas maksimal; tempo bicara dipercepat paling banyak 1.15×, jadi kalau total > 115 detik, PENDEKKAN naskah lalu generate ulang kalimat yang berubah, jangan dipaksa cepat). Mengisi starts/durs/total di data.json + mix.wav. **Tempo harus SAMA untuk semua kalimat** — jangan pakai `build_audio_keep.py` (mempercepat sebagian kalimat saja) kecuali darurat dan dicatat di log.

## 4. Scene 3D
Salin `pipeline/examples/kit-demo/scene.html` (kerangka cerah + maskot + FX) ke `$W/scene.html`; ambil sistem `part()`/highlight/model detail dari `pipeline/examples/mesin-cuci/scene.html` bila perlu. Pertahankan `render(t)`, `window.__render/__ready`, dan fungsi kamera. Ganti SEMUA model & animasi dengan benda topik hari ini:
- Adegan K1–K2: versi primitif dikerjakan maskot `ayah` (mis. menimba, menyaring, mengirim surat). Tangan/benda TIDAK boleh menembus objek lain. Semua ukuran pakai `C.M` (lihat 2a).
- Tiap part muncul di kalimat yang menyebutnya (`part(name, sceneIndex, endIndex, flyOffset)`), modelnya harus menyerupai part asli (bentuk, material logam/plastik/karet, detail).
- Adegan akhir: lihat aturan Ending; sistem/benda utuh, proporsional, tidak terpotong.
- Tanpa progress bar. Caption & chip dari data.json.

### 4a. Shot list WAJIB (tulis dulu sebelum coding, simpan di `$W/shots.md`)
Satu baris per kalimat: `K# | part yang dibahas | jenis angle | gerak kamera | posisi kamera [x,y,z] → target [x,y,z]`.
Aturan sinematografi (video harus atraktif, bukan asal):
- **Variasi angle**: pakai campuran dari — wide establishing, 3/4 depan, samping (profil), belakang, top-down (dari atas), low-angle (dari bawah ke atas), close-up/makro detail part, POV/"dari dalam" (kamera di dalam tabung/pipa/mesin), dan cutaway penampang. Minimal 6 jenis angle berbeda per video.
- **Tidak boleh** dua shot berturut-turut memakai sisi/angle yang sama (mis. depan → depan). Satu kalimat > 4 detik dipecah jadi ≥2 shot (tulis tiap shot di shots.md dengan waktu mulainya). Selang-seling kiri ↔ kanan, atas ↔ bawah, jauh ↔ dekat.
- **Tiap adegan punya gerak kamera sendiri** (bukan diam): orbit pelan, push-in (dolly maju), pull-out, crane naik/turun, truck/geser samping, atau tilt — variasikan antar adegan. Implementasikan di `camAt(i,t)` per adegan (mis. tabel `MOVES[i]`).
- **Transisi**: perpindahan kamera antar adegan 0.8–1.2 s ease-in-out; boleh whip/punch-in cepat untuk momen dramatis (bahaya, kecepatan tinggi).
- **Close-up wajib** saat part kecil dibahas (seal, katup, sensor, filter, membran): part mengisi ≥ 40% tinggi frame.
- Part yang dibahas harus jelas terlihat: tidak tertutup part lain/dinding (pakai cutaway/clipping, atau sembunyikan dinding sementara), dan di-highlight.
- Framing 9:16: objek utama di area y 300–1250 px; subtitle di y ±1250–1450; jangan taruh part penting di bawah subtitle atau di safe zone.

### 4b. Detail realistis WAJIB
- Bentuk mengikuti part asli (cek foto referensi lewat WebSearch bila perlu): proporsi benar, bevel/rounded edge (`RoundedBoxGeometry`), baut/mur, sambungan pipa (flange/klem), kabel, label/LED, ventilasi, rusuk penguat.
- Material sesuai: logam (metalness 0.8–1, roughness 0.2–0.4), plastik (roughness 0.4–0.6), karet (hitam, roughness 0.8+), kaca/air (transparan), beton/kain (tekstur kanvas).
- Gerak mekanis nyata: putaran, aliran cairan (partikel/tetesan), katup buka-tutup, getaran, lampu indikator — sesuai kalimat yang sedang dibicarakan.
- Pencahayaan 3 titik + environment (sudah ada di template); bayangan aktif.

### 4c. Cek visual (QC)
`python3 -I pipeline/render.py $W shot <satu waktu tengah tiap adegan>` lalu Read `$W/contact.png`. Ambil frame di tengah SETIAP shot (bukan hanya tiap kalimat). Checklist per frame:
- angle sesuai shot list & beda dari shot sebelumnya; tidak ada angle yang bertahan > 4 detik
- **skala proporsional** (orang vs pintu/rumah/kendaraan/kapal sesuai patokan 2a)
- **karakter hanya di lokasi yang masuk akal** (tidak di bawah laut/dalam benda); tidak T-pose; wajah close-up utuh; mata menatap kamera/benda
- **lokasi utuh, bukan diorama potongan tanah**
- part yang dibahas jelas & besar; konsep abstrak tampil sebagai benda 3D nyata
- **tidak ada yang tembus** — untuk setiap momen kontak (jangkar, tangan, kapal, kabel) cek 3 frame: sebelum, saat, sesudah kontak
- teks tidak masuk safe zone, label tidak menabrak subtitle/label lain, tidak terpotong tepi layar
- tidak ada layar kosong/terhalang dinding
- **kamera adegan interior harus DI DALAM ruangan** (dinding bidang DoubleSide menutupi kamera di luar → layar kosong); posisi ayah dan kamera dicoba dulu di contact sheet sebelum render penuh
- **wajah (revisi Ari 12 Nov 2026):** crop frame close-up senyum lebar (adegan "Selamat!") dan frame diam awal/akhir, perbesar: gigi putih polos tanpa bintik/goresan hitam, mulut terlihat jelas, bibir wajar
Perbaiki sampai lulus semua (maks 5 putaran). Untuk cek gerak kamera, ambil juga 3 frame berurutan (awal, tengah, akhir) di 2–3 shot.

## 5. Render
`python3 -I pipeline/render.py $W full` (±40 menit; jalankan di background, cek berkala). Verifikasi `out.mp4`: 1080x1920, durasi = total, ada audio; ambil 6 frame dengan ffmpeg dan lihat.

### 5b. Sampul (WAJIB, tema Midnight)
`python3 -I pipeline/cover.py $W "<Kata Kunci>," "<pertanyaan pendek?>"` → `$W/cover.png` + `$W/final.mp4` (sampul 0.4 s di frame pertama, audio digeser 0.4 s).
- Baris 1 (putih, besar): objek/aksi + koma, ≤ 12 karakter, mis. "Chat WA," "Air Kencing," "GPS,".
- Baris 2 (pill kuning): pertanyaan ≤ 18 karakter yang senada dengan hook/judul, mis. "lewat dasar laut?" "kok bisa diminum?".
- Tanpa tagline, tanpa logo/nama akun. Objek = render 3D adegan terakhir (otomatis).
- `cover.py` membuang piksel dengan alpha < 235 → benda transparan (kaca, air) HILANG dari sampul; di scene sampul (`window.__cover`) pakai material opak untuk gelas/air, dan susun objek di tengah frame (toilet+gelas: kamera jarak ±3.1 m, fov 36). Pastikan objek tidak terpotong tepi.
- Read `$W/cover.png`: judul & pill tidak tertimpa objek, semua elemen di dalam y 285–1635 (aman untuk grid IG 4:5). Kalau objek terlalu tinggi, ulangi dengan scene render yang objeknya lebih kecil atau ubah `mh` di cover.py.

## 6. Publikasi
```bash
cp $W/final.mp4 <repo>/videos/$SLUG.mp4 && cp $W/cover.png <repo>/covers/$SLUG.png && mkdir -p <repo>/research && cp $W/research.md <repo>/research/$SLUG.md && cp $W/scene.html $W/data.json -t <repo>/pipeline/examples/$SLUG/
git add -A && git commit -m "Video: $SLUG" && git push
```
(commit sebagai `Claude <noreply@anthropic.com>`). URL publik: `https://raw.githubusercontent.com/syahpurbachtiar-oss/zunoloop-media/main/videos/$SLUG.mp4` — cek `curl -sIL` = 200 dan content-length sama.

## 7. Buffer (19:30 WIB = 12:30 UTC; akun Buffer zona America/Chicago)
`dueAt` = hari ini `T12:30:00Z` dikonversi ke offset Chicago (CST −06:00 → `T06:30:00-06:00`; CDT −05:00 → `T07:30:00-05:00`). Kalau jam itu sudah lewat, pakai besok. `mode=customScheduled`, `schedulingType=automatic`. Asset: YouTube `{video:{url}}`; TikTok & Instagram `{video:{url, metadata:{thumbnailOffset:0}}}` (sampul = frame pertama).
- YouTube `6ac1643bea19ca0bde68cfb1`: metadata.youtube `{title:"<judul> #shorts", categoryId:"27", privacy:"public", madeForKids:false, isAiGenerated:true}`.
- TikTok `6ac15e0eea19ca0bde687599`: metadata.tiktok `{title:"<judul>", isAiGenerated:true}`.
- Instagram `6ae9be9de29c69a17148c2fc`: metadata.instagram `{type:"reel", shouldShareToFeed:true, isAiGenerated:true}`.
Caption (SEO, bukan hashtag generik): kalimat pertama = judul/hook; kalimat kedua memuat kata kunci yang dicari orang ("Cara kerja <benda/proses> …" / "Cara <bahan> diubah jadi <hasil> …"), lalu CTA TEBAKAN yang gampang dijawab dan nyambung isi video (pilihan/biner, jawabannya ada di video), mis. "Tebak dulu: HP-mu butuh sinyal dari berapa satelit biar tahu posisimu? 1 / 2 / 4 👇" — BUKAN "Komen alat apa yang harus kita bongkar" (0 komentar di 6 video; keputusan Ari 11 Nov 2026). Kalimat kedua = pemancing penasaran, JANGAN membocorkan jawaban. Lalu 3–5 hashtag niche: #carakerja #animasi3d + 1–3 spesifik topik (mis. #daurulangair #iss). DILARANG #fyp, #reels, #viral, #edukasi dan hashtag generik lain.
Judul = HOOK K1 persis (atau versi yang sama-sama menohok), TANPA "Dibongkar #N", ≤ 70 karakter, boleh 1 emoji, memuat kata kunci topik, mis. "Chat WA-mu Nyelam ke Dasar Laut Dulu?! 🌊". Kalimat pertama caption = judul yang sama.
Pastikan ketiga respons `status: scheduled`.

## 8. Tutup
Centang topik di `topics.md`, tambah baris di `log.md` (tanggal, slug, durasi, 3 post id, catatan masalah), commit + push. Kirim ringkasan singkat ke user (SendUserMessage / PushNotification): topik, jam tayang, link video.

## 9. Mode draft & revisi (disepakati Ari 11–12 Nov 2026)
- **Mode draft** (diminta di awal run atau selama formula belum pas): lakukan langkah 0–6 (push video ke repo), JANGAN centang `topics.md` dan JANGAN sentuh Buffer; log.md ditandai DRAFT. Kirim videonya ke chat (`SendUserFile`) supaya Ari menonton dulu.
- **Revisi**: bila Ari menulis revisi, ULANGI dulu revisinya dengan kata sendiri (sebutkan tebakan yang ambigu) dan tunggu konfirmasi; baru kerjakan. Perbaiki akar masalahnya (mis. kit maskot) dengan perubahan sekecil mungkin, render ulang PENUH dengan kualitas sama (CRF 19, 1080x1920), cek frame, kirim ke chat. Jangan push video revisi sebelum Ari bilang approve.
- **Setelah approve**: push video (ganti file lama), jadwalkan Buffer langkah 7 (jam 19:30 WIB hari yang sama bila belum lewat), centang topik, ganti baris DRAFT di log.md dengan baris final (3 post id), update memori.
- Kit maskot (`pipeline/kit/mascot.js`) dikoreksi 12 Nov 2026: lapisan gigi/lidah/bibir mulut `happy` punya `renderOrder` eksplisit + jarak z lebih besar, mulut digeser ke depan `R*.03`, gigi `MeshBasicMaterial` polos (tanpa bintik hitam akibat z-fighting dengan rongga mulut), mulut `normal` lebih tebal & gelap supaya terlihat di bidikan lebar.
- Bila Ari sendiri menempelkan key Gemini di chat: simpan hanya di file chmod 600 di scratchpad (bukan repo/memori/log) dan ingatkan Ari me-rotate key karena tampil di transkrip.

## Aturan gagal
Jangan pernah posting video yang belum dicek visual. Jika langkah apa pun gagal 2x, hentikan run, catat penyebab di `log.md`, push log, kabari user. Jangan mengubah/menghapus post Buffer yang sudah ada.
