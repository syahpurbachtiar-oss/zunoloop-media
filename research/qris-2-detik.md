# qris-2-detik — Alur pembayaran QRIS (warung di Indonesia → penerbit → switching → acquirer)

Dikumpulkan 27 Nov 2026 (mode beruntun). Satu "fasilitas": **sistem pembayaran QRIS (standar Bank Indonesia & ASPI), satu transaksi di warung di Indonesia**. Tanpa merek/logo bank atau dompet digital; pihak disebut menurut perannya. Klaim "2 detik" di judul topik TIDAK dipakai (tidak ada sumber waktu per langkah).

## Sumber
1. Bank Indonesia, siaran pers 17 Agustus 2019: QRIS diluncurkan; berlaku nasional 1 Januari 2020; disusun BI & ASPI dengan standar EMVCo. https://www.bi.go.id/id/publikasi/ruang-media/news-release/Pages/sp_216219.aspx
2. Bank Indonesia, halaman QRIS: para pihak — PJP (Penerbit, Acquirer), Lembaga Switching, Lembaga Standar, pengelola National Merchant Repository; MPM statis/dinamis. https://www.bi.go.id/id/fungsi-utama/sistem-pembayaran/ritel/kanal-layanan/QRIS/default.aspx
3. CNN Indonesia (2019): lembaga switching = penerus data transaksi QRIS antar-PJSP. https://www.cnnindonesia.com/ekonomi/20190821154718-78-423426/bi-rilis-aturan-qris-transaksi-qr-code-dibatasi-rp2-juta
4. S. Raheja, "How a QRIS Payment Actually Moves in Indonesia": QR statis → pelanggan mengetik nominal; alur off-us: aplikasi → penerbit → switch penerbit → switch acquirer → acquirer → notifikasi ke merchant; setelmen lewat bank penyelesaian; minimal 6 rekonsiliasi harian; MDR UMI 0 % s.d. Rp500.000 (berlaku 15 Maret 2025). https://sudhanshuraheja.com/qris-payments-in-indonesia-how-it-works-challenges-and-the-future
6. Bank Indonesia, siaran pers No. 28/159/DKom (17 Agustus 2026): perluasan MDR QRIS 0 % efektif 1 Oktober 2026 — UMI s.d. Rp500.000; UKE/UME/UBE s.d. Rp100.000; QRIS menjangkau 44,86 juta merchant. https://www.bi.go.id/id/publikasi/ruang-media/news-release/Pages/sp_2815926.aspx ; ANTARA https://www.antaranews.com/berita/5697901/bi-perluas-kebijakan-mdr-qris-0-persen-untuk-pelaku-umkm
5. ITERA blog: QRIS adalah standar kanal pembayaran, bukan produk satu perusahaan. https://www.itera.ac.id/blog/?p=2673

## Tabel fakta
| fakta | angka/nama | lokasi | sumber # |
|---|---|---|---|
| Standar QR pembayaran nasional BI + ASPI | wajib 1 Jan 2020 | sistem QRIS, Indonesia | 1 |
| Satu QR bisa dibayar dari aplikasi PJP mana pun | — | sistem QRIS, Indonesia | 2, 5 |
| QR statis: pembeli mengetik nominal | — | sistem QRIS, Indonesia | 4 |
| Alur: penerbit → switching penerbit → switching acquirer → acquirer → penjual | 4 pihak | sistem QRIS, Indonesia | 2, 3, 4 |
| Uang dipindah belakangan lewat bank penyelesaian (setelmen) | — | sistem QRIS, Indonesia | 4 |
| Rekonsiliasi harian berkali-kali | ≥6 | sistem QRIS, Indonesia | 4 |
| MDR 0 % untuk transaksi s.d. Rp100.000 di semua kategori merchant (UMI s.d. Rp500.000) | sejak 1 Okt 2026 | sistem QRIS, Indonesia | 6 |
| QRIS menjangkau 44,86 juta merchant | 44,86 juta | sistem QRIS, Indonesia | 6 |

**Kenyataan berlawanan dugaan (R23):** saat "berhasil", yang lewat baru pesan transaksi; uangnya dipindah belakangan lewat setelmen (sumber 4).

## Fakta visual
| benda | warna/material/ukuran |
|---|---|
| stiker/standee QRIS | papan akrilik kecil, kotak QR hitam-putih (tanpa logo merek) |
| warung | gerobak/warung kopi, meja kayu, toples |
| HP | ponsel layar ±6,5″ |
| pusat data | gedung/rak server dengan lampu indikator |
