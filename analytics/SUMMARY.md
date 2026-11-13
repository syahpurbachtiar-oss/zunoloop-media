# Ringkasan analitik kumulatif — ZunoLoop

_Terakhir diperbarui: 13 Nov 2026._

## Baseline
- Format lama (tips gaya hidup kota, 24 Okt–6 Nov, 60 s): rata-rata views TT 52 · YT 136 · IG 36; retensi TT ±12% (avg 7 s).
- Followers baseline (dari Ari, 10 Nov): TikTok ±600, YouTube 17, IG 0. Buffer tidak menyediakan data followers.

## Tren
| Tanggal | Video | Format | TT views / ret. | YT views | IG views |
|---|---|---|---|---|---|
| 8 Nov | mesin-cuci | 3D cara kerja, 61 s | 218 / 27% | 1.330 | 246 / 20% |
| 9 Nov | kencing-astronot | 3D tanpa maskot, 88 s, hook jijik | 223 / 13% | 1.146 | **1.237 / 37%** |
| 10 Nov | wa-luar-negeri (Dibongkar #3) | maskot 3D, 115 s, tayang 20:00 | 222 / 13% | **9 ⚠️** | 135 / 23% |
| 11 Nov | gps-einstein | maskot 3D, 102 s, caption = hook, CTA tebakan | **33 ⚠️** / 21% (16 jam) | 977 (19 jam) | **1.198 / 37%** (14 jam) |
| 12 Nov | newater-singapura | maskot 3D, 100 s, P1 jijik, CTA tebakan | belum ada data (Buffer belum refresh 13 Nov pagi) | | |
| 13 Nov | air-laut-tawar | maskot 3D, 97 s, P1, suara Gemini, CTA tebakan | terjadwal 19:30 | | |

## Topik pemenang / kalah
- Menang: 3D "cara kerja" (mesin-cuci 4,0–9,6× baseline). Pemenang terbesar: hook jijik→berguna (kencing-astronot: IG 34×, YT 8,4×, retensi IG 37%) dan hook klaim mengejutkan di judul (gps-einstein: IG 33×, YT 7,2×, retensi IG 37%, 41 like = rekor).
- Lemah: caption deskriptif tanpa hook (wa-luar-negeri: IG 135, YT 9).
- Kalah: tips gaya hidup kota (cuci tangan, minum air, rutinitas malam): IG sering < 15 views, TT retensi 5–12%.

## Platform
- YouTube Shorts ±1.000–1.360/video 3D; wa-luar-negeri (9 views) ternyata kasus tunggal — gps-einstein pulih ke 977 (13 Nov).
- **Instagram = platform terkuat** (±1.200 views & retensi ±37% di 2 dari 4 video 3D).
- **TikTok = titik lemah & platform target**: gps-einstein hanya 33 views (0,6× baseline) walau avg tonton 21 s → masalah distribusi FYP (13 Nov). Sebelumnya TikTok ±210/video; retensi turun di durasi panjang (61 s: 28% → 88 s: 14%).
- TikTok: avg tonton mentok ±12–20 s di semua durasi (61/88/115 s) → masalahnya titik keluar ±15 s, bukan durasi saja.
- Interaksi: 0 komentar & 0 share di 11 post 3D/maskot (s.d. 12 Nov) meski ada CTA komentar.

## Eksperimen berjalan
| Mulai | Eksperimen | Metrik sukses | Status |
|---|---|---|---|
| 10 Nov | Seri "Dibongkar #N" + maskot keluarga 3D, 85–115 s (keputusan Ari) | retensi TT ≥ 25%, views TT ≥ 190 | berjalan |
| 10 Nov | Hook pertanyaan di baris 1 caption (usulan) | avg tonton TT ≥ 25 s | usulan |
| 10 Nov | CTA silang YT/IG → TikTok (usulan) | views TT ≥ 290/video dalam 7 hari | usulan |
| 11 Nov | 1 topik P1 lebih awal (newater-singapura) | IG ≥ 500, YT ≥ 1.000 dlm 48 jam | diadopsi Ari (antrean P1 dulu); tayang 12 Nov |
| 11 Nov | Hook 3 dtk khusus TT: caption baris 1 = hook, sampul via thumbnailOffset | avg tonton TT ≥ 20 s | gps-einstein 21,3 s ✔ (1 video); tapi views TT hanya 33 |
| 11 Nov | CTA komentar pilihan/biner + pin komentar (usulan) | ≥ 3 komentar/video dlm 48 jam | CTA tebakan dipakai sejak gps-einstein (11 Nov); pin komentar belum |
| 12 Nov | Cek YT Studio wa-luar-negeri (usulan) | YT gps-einstein ≥ 500 dlm 48 jam | **tercapai** (977 dlm ±19 jam) → YT tidak bermasalah sistemik |
| 12 Nov | Hook kedua di detik 12–15 (usulan) | avg tonton TT ≥ 22 s (3 video) | usulan |
| 13 Nov | Cek TikTok Studio gps/newater: % FYP, status For You, label AI (usulan) | TT newater ≥ 150 dlm 48 jam | usulan |
| 13 Nov | Versi TikTok ≤ 70 s untuk 2 video (usulan) | retensi TT ≥ 30% & views TT ≥ 150 | usulan |

## Syarat naik ke 2 video/hari (dicek tiap Senin)
(a) views format baru ≥ 2× baseline di ≥ 2 platform · (b) retensi TT rata-rata ≥ 30% · (c) tidak ada run produksi gagal/QC dilewati.
Status 11 Nov: (a) video 3D 8–9 Nov ≥2× baseline di 3 platform, tapi format maskot belum ada data; (b) retensi TT rata-rata 3D = 21% (28%, 14%), belum; (c) 10 Nov run produksi gagal di tengah (ElevenLabs) lalu dilanjutkan manual, tayang 20:00 → catatan negatif. Review pertama: 16 Nov.
Status 12 Nov: (a) format maskot (1 video): TT 4,2×, IG 3,7× baseline, YT 0,05× → ≥2× di 2 platform; (b) retensi TT maskot 13% (wa) / 20% awal (gps) → belum; (c) catatan 10 Nov tetap berlaku.
Status 13 Nov: (a) format maskot (2 video): TT 2,5×, YT 3,6×, IG 18,5× → terpenuhi; (b) retensi TT maskot rata-rata 16,9% → belum; (c) run otomatis 13 Nov tertahan (GEMINI_API_KEY kosong di environment task), video dibuat di sesi Ari → catatan negatif.
