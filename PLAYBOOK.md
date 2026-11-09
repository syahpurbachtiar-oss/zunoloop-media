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
Nomor seri: N = jumlah baris `[x]` di `topics.md` + 1 (mesin-cuci = #1, kencing-astronot = #2). Dipakai di judul, caption, dan kalimat terakhir. Gaya: kasual, kalimat pendek, "kamu", bahasa Indonesia sehari-hari. Semua fakta dari `research.md`.
FORMAT WAJIB = rantai MASALAH → SOLUSI bertahap, persis seperti video mesin cuci (`pipeline/examples/mesin-cuci/data.json`). Penonton "ikut membangun" sistemnya dari versi paling primitif; tiap kalimat menutup satu masalah dan membuka masalah baru, sehingga penonton terus penasaran ke kalimat berikutnya.
- K1 = HOOK dari `topics.md` (boleh dipoles, ≤ 18 kata, kontras jijik/aneh vs hasil luar biasa). Hook juga jadi judul video.
- K2 = versi PALING PRIMITIF dengan sudut "kamu": "Kalau kamu cuma <cara paling sederhana>, kamu udah <setengah jalan>… tapi <masalah besar>."
- K3..K(n-2) = tiap kalimat = SATU masalah nyata dari tahap sebelumnya + SATU solusi (mesin/part/tahap nyata) dengan pola bergantian:
  "Tapi <masalah>. Jadi kamu pasang/tambah <solusi>." · "Masalahnya, <masalah baru>. Makanya <solusi>." · "Terus <efek samping solusi tadi>…"
  Solusi selalu memunculkan masalah berikutnya (efek samping, bahaya, sisa kotoran, energi, dll). Jangan ada kalimat yang cuma informasi tanpa masalah/solusi. Sisipkan 1 angka mengejutkan yang terverifikasi.
- K(n-1) = "Selamat, kamu udah bikin <sistem>." + payoff singkat bila muat (mis. "…airnya lebih bersih dari air keranmu.").
- K(n) = "Follow biar nggak ketinggalan Dibongkar #<N+1>… mau kita bongkar apa?" (≤ 12 kata).
Contoh pembuka (kencing-astronot): K1 "Astronot di luar angkasa minum air kencingnya sendiri… dan airnya lebih bersih dari air keranmu." K2 "Kalau kamu cuma saring pakai kain, kotorannya nyangkut… tapi baunya dan zat garamnya masih ikut." K3 "Tapi di luar angkasa nggak ada gravitasi, air nggak mau netes ke bawah. Jadi kamu pasang drum yang muter biar airnya kepental ke dinding." …
Topik bertanda SENSITIF: tone hormat & ilmiah, tanpa candaan.
Tulis ke `$W/data.json`:
`{"slug","hook":"<versi singkat hook, KAPITAL, ≤28 karakter>","footer":"DARI BIASA JADI BERGUNA","lines":[...],"chips":[...],"problems":[...],"keys":[...]}`
(`problems` = masalah singkat per kalimat untuk label pojok kiri atas, KAPITAL ≤22 karakter, "" bila tidak ada; `keys` = 1 kata kunci per kalimat yang diberi kotak biru di caption.)
(`chips` = nama tahap/mesin per kalimat, kosong "" untuk K1, K2, dua terakhir; KAPITAL, ≤18 karakter.)
Adegan 3D: K1–K2 tampilkan "bahan jijik/awal" (P1) atau aksi sehari-hari si ayah (P2) secara bersih & tidak vulgar (stilisasi, bukan realistis menjijikkan); tahap proses = mesin/alat nyata yang dirakit; dua adegan akhir = hasil akhir + fasilitas utuh.
**Gaya @kalbotau (WAJIB, hasil bedah 10 Nov 2026):**
- **Gagal dulu, baru solusi:** tiap MASALAH divisualkan terjadi di layar (melengkung, patah, bocor, runtuh, meledak kecil) dengan panah merah + chip "✗ <masalah>"; solusinya lalu muncul dan diuji ulang dengan chip "✓ <hasil>". Boleh efek teks onomatope besar miring (mis. "KRAAAK!", "BLUP!") dan efek mundur "◀◀ ULANG" saat percobaan gagal.
- **Label tahap pojok kiri atas** (tetap tampil per adegan): baris kecil KAPITAL "• MASALAH: <masalah singkat>" + di bawahnya nama solusi tebal dengan kata kunci di kotak biru (mis. "Gelagar huruf I [gelagar]"). Isi dari `chips`/`problems` di data.json.
- **Caption karaoke**: teks di tengah-bawah, muncul per kata mengikuti suara (estimasi waktu per kata dari durasi kalimat, proporsional panjang kata); kata kunci tiap kalimat diberi kotak biru tebal. Tambahkan field `keys` (1 kata kunci per kalimat) di data.json.
- **Label nama part di scene** (teks kecil KAPITAL + garis penunjuk) saat part pertama kali muncul.
- **Analogi sehari-hari** minimal 1 (mis. "kayak penggaris: tidur gampang ditekuk, berdiri susah banget") dan konteks Indonesia (motor, sawah, gang, dll) bila relevan.
- **Visual cerah**: siang hari, warna pastel bersih, low-poly rapi; hindari adegan gelap.
- **Ending loop**: adegan terakhir "Selamat!" dengan efek teks besar, lalu frame terakhir dibuat mirip/menyambung ke adegan K1 supaya video berulang mulus (penonton menonton ulang).
- Jangan menyalin aset, karakter, nama, atau kalimat khas akun itu; ambil polanya saja.

**Kit maskot & efek (WAJIB dipakai, `pipeline/kit/`)** — contoh lengkap: `pipeline/examples/kit-demo/scene.html`, pratinjau: `pipeline/kit/preview-maskot.png`.
- `makeCast(THREE,RoundedBoxGeometry)` → `ayah` (tokoh utama = "kamu", wajib tampil di K1, tiap adegan gagal, dan adegan "Selamat"), `ibu`, `kakak`, `adik` (pemeran pendukung bila cerita butuh: mis. ibu memakai hasilnya, anak bertanya). Jangan ganti desain/warna/emblem; atur skala agar proporsional dengan benda (`root.scale`).
- Tiap frame: `C.ayah.act(aksi, detikSejakMulaiAksi, ekspresi)`. Aksi: idle, walk, wave, point, think, shock, celebrate, facepalm, present, hold, crouch. Ekspresi: normal, happy, shock, worried, think, wink. Sesuaikan aksi dengan kalimat: masalah → shock/facepalm + worried; ide solusi → think lalu point; hasil → present/celebrate + happy.
- `makeFX(...)` dipanggil di `render(t)` setelah `R.render`: `FX.begin()` → `stage(problems[i], judulTahap, keys[i], u)` setiap adegan → `karaoke(lines[i], keys[i], progres)` setiap adegan → efek momen → `FX.end()`. Ganti overlay lama (#hb/#chip/#cap) dengan FX; hook tetap tampil besar di K1 (pakai `FX.boom` atau stage).
- Kuota minimal per video: ≥4 `arrow` (merah = gaya/masalah, biru = aliran, hijau = solusi), ≥4 `chip` (✗ bad untuk tiap masalah, ✓ good untuk tiap solusi), ≥6 `label` nama part, ≥3 `emote` (!, ?, idea, sweat, love), ≥2 `boom` onomatope (KRAAAK!, BLUP!, WUSSH!, DUAR!), ≥1 `rewind` (ULANG) setelah percobaan gagal, `lines` untuk angin/panas/kecepatan bila relevan, `confetti` + `boom('SELAMAT!')` di adegan akhir, `flash` kecil tiap ganti adegan.
- Gerak kamera ala @kalbotau: ganti shot 2–4 detik; campur wide (lihat karakter + benda), close-up wajah saat reaksi (shock/think), POV/over-the-shoulder karakter, top-down untuk skala, dan punch-in cepat saat momen gagal. Karakter & benda tidak boleh menembus satu sama lain.
**Hook visual 2 detik pertama (WAJIB):** begitu sampul 0.4 s lewat, K1 langsung menampilkan momen paling aneh/kontras (bahan jijik berdampingan dengan hasil akhirnya, atau benda dalam gerak) dengan gerak kamera cepat (punch-in/whip), bukan wide shot diam. `hook` di data.json berupa pertanyaan/klaim kontras (mis. "KENCING JADI AIR MINUM?") dan tampil besar di layar sepanjang K1.

## 3. Suara (ElevenLabs connector)
`creative_generate_speech` per kalimat: `voice_id=xlBOShi2835jfBgaEld4` (Rafiq), `model_id=eleven_v4`, `generations_count=1`. Kirim semua sekaligus, lalu poll `creative_get_flow_run_status`. Unduh `content_url` dengan curl ke `$W/mp3/NN.mp3` (01, 02, …). Kalimat yang gagal: generate ulang SATU kali saja. Kalau masih gagal / kredit habis → berhenti, catat di log.
Lalu: `python3 pipeline/build_audio.py $W 115` (115 = batas maksimal; tempo bicara dipercepat paling banyak 1.15×, jadi kalau total > 115 detik, PENDEKKAN naskah lalu generate ulang kalimat yang berubah, jangan dipaksa cepat). Mengisi starts/durs/total di data.json + mix.wav.

## 4. Scene 3D
Salin `pipeline/examples/kit-demo/scene.html` (kerangka cerah + maskot + FX) ke `$W/scene.html`; ambil sistem `part()`/highlight/model detail dari `pipeline/examples/mesin-cuci/scene.html` bila perlu. Pertahankan `render(t)`, `window.__render/__ready`, dan fungsi kamera. Ganti SEMUA model & animasi dengan benda topik hari ini:
- Adegan K1–K2: versi primitif dikerjakan maskot `ayah` (mis. menimba, menyaring, mengirim surat). Tangan/benda TIDAK boleh menembus objek lain.
- Tiap part muncul di kalimat yang menyebutnya (`part(name, sceneIndex, endIndex, flyOffset)`), modelnya harus menyerupai part asli (bentuk, material logam/plastik/karet, detail).
- Dua adegan terakhir: benda UTUH dan PENUH di frame (tidak terpotong, tidak terlalu zoom), kamera orbit pelan.
- Tanpa progress bar. Caption & chip dari data.json.

### 4a. Shot list WAJIB (tulis dulu sebelum coding, simpan di `$W/shots.md`)
Satu baris per kalimat: `K# | part yang dibahas | jenis angle | gerak kamera | posisi kamera [x,y,z] → target [x,y,z]`.
Aturan sinematografi (video harus atraktif, bukan asal):
- **Variasi angle**: pakai campuran dari — wide establishing, 3/4 depan, samping (profil), belakang, top-down (dari atas), low-angle (dari bawah ke atas), close-up/makro detail part, POV/"dari dalam" (kamera di dalam tabung/pipa/mesin), dan cutaway penampang. Minimal 6 jenis angle berbeda per video.
- **Tidak boleh** dua kalimat berturut-turut memakai sisi/angle yang sama (mis. depan → depan). Kamera harus pindah sisi minimal tiap kalimat; selang-seling kiri ↔ kanan, atas ↔ bawah, jauh ↔ dekat.
- **Tiap adegan punya gerak kamera sendiri** (bukan diam): orbit pelan, push-in (dolly maju), pull-out, crane naik/turun, truck/geser samping, atau tilt — variasikan antar adegan. Implementasikan di `camAt(i,t)` per adegan (mis. tabel `MOVES[i]`).
- **Transisi**: perpindahan kamera antar adegan 0.8–1.2 s ease-in-out; boleh whip/punch-in cepat untuk momen dramatis (bahaya, kecepatan tinggi).
- **Close-up wajib** saat part kecil dibahas (seal, katup, sensor, filter, membran): part mengisi ≥ 40% tinggi frame.
- Part yang dibahas harus jelas terlihat: tidak tertutup part lain/dinding (pakai cutaway/clipping, atau sembunyikan dinding sementara), dan di-highlight.
- Framing 9:16: objek utama di 2/3 atas frame; area caption (y > 1390 px) tidak menutupi part penting.

### 4b. Detail realistis WAJIB
- Bentuk mengikuti part asli (cek foto referensi lewat WebSearch bila perlu): proporsi benar, bevel/rounded edge (`RoundedBoxGeometry`), baut/mur, sambungan pipa (flange/klem), kabel, label/LED, ventilasi, rusuk penguat.
- Material sesuai: logam (metalness 0.8–1, roughness 0.2–0.4), plastik (roughness 0.4–0.6), karet (hitam, roughness 0.8+), kaca/air (transparan), beton/kain (tekstur kanvas).
- Gerak mekanis nyata: putaran, aliran cairan (partikel/tetesan), katup buka-tutup, getaran, lampu indikator — sesuai kalimat yang sedang dibicarakan.
- Pencahayaan 3 titik + environment (sudah ada di template); bayangan aktif.

### 4c. Cek visual (QC)
`python3 -I pipeline/render.py $W shot <satu waktu tengah tiap adegan>` lalu Read `$W/contact.png`. Checklist per frame: angle sesuai shot list & beda dari adegan sebelumnya · part yang dibahas jelas & besar · tidak ada objek tembus · tidak ada layar kosong/terhalang dinding · tidak terpotong aneh · caption tidak menutupi part. Perbaiki sampai lulus semua (maks 5 putaran). Untuk cek gerak kamera, ambil juga 3 frame berurutan (awal, tengah, akhir) di 2–3 adegan.

## 5. Render
`python3 -I pipeline/render.py $W full` (±40 menit; jalankan di background, cek berkala). Verifikasi `out.mp4`: 1080x1920, durasi = total, ada audio; ambil 6 frame dengan ffmpeg dan lihat.

### 5b. Sampul (WAJIB, tema Midnight)
`python3 -I pipeline/cover.py $W "<Kata Kunci>," "<pertanyaan pendek?>"` → `$W/cover.png` + `$W/final.mp4` (sampul 0.4 s di frame pertama, audio digeser 0.4 s).
- Baris 1 (putih, besar): bahan/objek jijik + koma, ≤ 12 karakter, mis. "Air Kencing," "Tinja," "HP Bekas,".
- Baris 2 (pill kuning): pertanyaan ≤ 18 karakter, mis. "kok bisa diminum?" "jadi medali emas?".
- Tanpa tagline, tanpa logo/nama akun. Objek = render 3D adegan terakhir (otomatis).
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
Caption (SEO, bukan hashtag generik): kalimat pertama memuat kata kunci yang dicari orang ("Cara kerja <benda/proses> …" / "Cara <bahan> diubah jadi <hasil> …"), lalu 1 kalimat isi, lalu "Dibongkar #N — komen alat apa yang harus kita bongkar berikutnya 👇", lalu 3–5 hashtag niche: #carakerja #animasi3d + 1–3 spesifik topik (mis. #daurulangair #iss). DILARANG #fyp, #reels, #viral, #edukasi dan hashtag generik lain.
Judul: "Dibongkar #N: <versi singkat hook>" (≤ 70 karakter, boleh 1 emoji, memuat kata kunci topik), mis. "Dibongkar #2: Astronot Minum Air Kencingnya Sendiri?! 🚀".
Pastikan ketiga respons `status: scheduled`.

## 8. Tutup
Centang topik di `topics.md`, tambah baris di `log.md` (tanggal, slug, durasi, 3 post id, catatan masalah), commit + push. Kirim ringkasan singkat ke user (SendUserMessage / PushNotification): topik, jam tayang, link video.

## Aturan gagal
Jangan pernah posting video yang belum dicek visual. Jika langkah apa pun gagal 2x, hentikan run, catat penyebab di `log.md`, push log, kabari user. Jangan mengubah/menghapus post Buffer yang sudah ada.
