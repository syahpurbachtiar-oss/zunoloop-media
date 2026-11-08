# PLAYBOOK — Video harian ZunoLoop (otomatis)

Tujuan tiap run: 1 video edukasi 3D 9:16 berbahasa Indonesia (~60 detik) → push ke repo ini → jadwalkan ke YouTube, Instagram, TikTok via Buffer pada **19:30 WIB hari yang sama**. Tidak ada manusia yang menunggu: jangan bertanya, ambil keputusan terbaik, catat di `log.md`.

Contoh kualitas yang jadi patokan: `pipeline/examples/mesin-cuci/` (scene.html + data.json) dan `videos/mesin-cuci-3d.mp4`.

## 0. Persiapan (±3 menit)
```bash
cd <repo>/pipeline && npm i three@0.170.0 --no-audit --no-fund
pip install --break-system-packages soundfile numpy   # playwright + chromium sudah ada
SLUG=<slug-topik>; W=/tmp/zl/$SLUG; mkdir -p $W/mp3; ln -s <repo>/pipeline/node_modules $W/node_modules
```
Cek kuota Buffer dulu: `get_account` → org `6ac1597aca8206e9ab9d50f7`, batas `scheduledPosts` = 10 untuk SELURUH organisasi. `list_posts` status scheduled; kalau sisa slot < 3, berhenti dan catat di log (jangan hapus post orang lain).

## 1. Topik
Ambil baris pertama yang belum dicentang di `topics.md`. Judul selalu format "cara kerja / teknik pembuatan <benda>".

## 2. Naskah (13–15 kalimat, total 150–175 kata)
Gaya sama persis dengan contoh: kasual, kalimat pendek, "kamu".
- K1 hook: "Kalau kamu <cara paling primitif>, kamu udah punya <benda>."
- K2 masalah versi primitif.
- K3..K(n-2): tiap kalimat menambah SATU part nyata + alasannya ("Tapi … Jadi kamu pasang …").
- K(n-1): "Selamat, kamu udah bikin <benda>."
- K(n): "Habis ini, mau kita bongkar apa?"
Fakta teknis harus benar (cek web bila ragu). Tulis ke `$W/data.json`:
`{"slug","hook":"KAMU SUDAH PUNYA <BENDA>","footer":"TEKNIK PEMBUATAN <BENDA>","lines":[...],"chips":[...]}`
(`chips` = label part per kalimat, kosong "" untuk K1, K2, dua terakhir; huruf kapital, ≤18 karakter.)

## 3. Suara (ElevenLabs connector)
`creative_generate_speech` per kalimat: `voice_id=xlBOShi2835jfBgaEld4` (Rafiq), `model_id=eleven_v4`, `generations_count=1`. Kirim semua sekaligus, lalu poll `creative_get_flow_run_status`. Unduh `content_url` dengan curl ke `$W/mp3/NN.mp3` (01, 02, …). Kalimat yang gagal: generate ulang SATU kali saja. Kalau masih gagal / kredit habis → berhenti, catat di log.
Lalu: `python3 pipeline/build_audio.py $W 60` (mengisi starts/durs/total di data.json + mix.wav).

## 4. Scene 3D
Salin `pipeline/examples/mesin-cuci/scene.html` ke `$W/scene.html`. Pertahankan kerangka (renderer, lampu, lantai, sistem `part()`, highlight, overlay caption/chip/hook, `render(t)`, fungsi kamera). Ganti SEMUA model & animasi dengan benda topik hari ini:
- Adegan K1–K2: versi primitif (seperti ember + tangan). Tangan/benda TIDAK boleh menembus objek lain.
- Tiap part muncul di kalimat yang menyebutnya (`part(name, sceneIndex, endIndex, flyOffset)`), modelnya harus menyerupai part asli (bentuk, material logam/plastik/karet, detail).
- `CAMS[i]` per kalimat: framing fokus ke part yang sedang dibahas, tidak terhalang dinding/part lain.
- Dua adegan terakhir: benda UTUH dan PENUH di frame (tidak terpotong, tidak terlalu zoom), kamera orbit pelan.
- Tanpa progress bar. Caption & chip dari data.json.
Cek visual wajib: `python3 -I pipeline/render.py $W shot <satu waktu tengah tiap adegan>` lalu lihat `$W/contact.png` (Read). Perbaiki sampai semua adegan benar. Ulangi maksimal 4 putaran.

## 5. Render
`python3 -I pipeline/render.py $W full` (±40 menit; jalankan di background, cek berkala). Verifikasi `out.mp4`: 1080x1920, durasi = total, ada audio; ambil 6 frame dengan ffmpeg dan lihat.

## 6. Publikasi
```bash
cp $W/out.mp4 <repo>/videos/$SLUG.mp4 && cp $W/scene.html $W/data.json -t <repo>/pipeline/examples/$SLUG/
git add -A && git commit -m "Video: $SLUG" && git push
```
(commit sebagai `Claude <noreply@anthropic.com>`). URL publik: `https://raw.githubusercontent.com/syahpurbachtiar-oss/zunoloop-media/main/videos/$SLUG.mp4` — cek `curl -sIL` = 200 dan content-length sama.

## 7. Buffer (19:30 WIB = 12:30 UTC; akun Buffer zona America/Chicago)
`dueAt` = hari ini `T12:30:00Z` dikonversi ke offset Chicago (CST −06:00 → `T06:30:00-06:00`; CDT −05:00 → `T07:30:00-05:00`). Kalau jam itu sudah lewat, pakai besok. `mode=customScheduled`, `schedulingType=automatic`, asset `{video:{url}}`.
- YouTube `6ac1643bea19ca0bde68cfb1`: metadata.youtube `{title:"<judul> #shorts", categoryId:"27", privacy:"public", madeForKids:false, isAiGenerated:true}`.
- TikTok `6ac15e0eea19ca0bde687599`: metadata.tiktok `{title:"<judul>", isAiGenerated:true}`.
- Instagram `6ae9be9de29c69a17148c2fc`: metadata.instagram `{type:"reel", shouldShareToFeed:true, isAiGenerated:true}`.
Caption: 1–2 kalimat isi + "Komen alat apa yang harus kita bongkar berikutnya 👇" + 6–8 hashtag Indonesia (#carakerja #edukasi #faktaunik #teknologi #animasi3d + 2 spesifik topik; YouTube + #shorts, TikTok + #fyp, IG + #reels #fyp).
Judul: "Gimana Sih <Benda> Dibuat? 🔧 Dibongkar dalam 60 Detik" (variasikan sedikit).
Pastikan ketiga respons `status: scheduled`.

## 8. Tutup
Centang topik di `topics.md`, tambah baris di `log.md` (tanggal, slug, durasi, 3 post id, catatan masalah), commit + push. Kirim ringkasan singkat ke user (SendUserMessage / PushNotification): topik, jam tayang, link video.

## Aturan gagal
Jangan pernah posting video yang belum dicek visual. Jika langkah apa pun gagal 2x, hentikan run, catat penyebab di `log.md`, push log, kabari user. Jangan mengubah/menghapus post Buffer yang sudah ada.
