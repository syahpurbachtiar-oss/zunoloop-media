# Riset: qris-2-detik — Cara kerja QRIS dari scan sampai dana masuk

Diriset 11 Nov 2026 (run otomatis). Hook asli topics.md ("lunas dalam 2 detik… uangmu lewat 4 pihak") DIPOLES:
- "2 detik" tidak ditemukan di sumber terpercaya mana pun → diganti "hitungan detik" (BRI: "processed in real-time"; OttoDigital/BINUS: "hitungan detik").
- "uangmu lewat 4 pihak" kurang tepat: yang lewat cepat adalah PESAN/instruksi (penerbit → switching → (switching lain) → acquirer); dana antarbank baru diselesaikan saat settlement (H+0 atau H+1). Hook baru: "Pas QRIS bunyi 'ting', uangnya belum sampai ke penjual!" — benar untuk alur umum karena dana ke rekening penjual menunggu settlement (sebagian PJP H+0, BRI H+1 pagi).

## Sumber
| # | Judul | Penerbit | URL | Tanggal |
|---|---|---|---|---|
| 1 | Quick Response Code Indonesian Standard (QRIS) | Bank Indonesia | https://www.bi.go.id/id/fungsi-utama/sistem-pembayaran/ritel/kanal-layanan/QRIS/default.aspx | diakses 11 Nov 2026 |
| 2 | Bahan Sosialisasi QRIS (slide) | Bank Indonesia | https://www.bi.go.id/id/edukasi/Documents/Bahan-Sosialisasi-QRIS.pdf | data per 12 Mar 2020 |
| 3 | MDR QRIS Bagi Merchant: Kategorisasi dan Simulasi | Bank Indonesia (Dep. Komunikasi) | https://www.bi.go.id/id/publikasi/ruang-media/cerita-bi/pages/mdr-qris.aspx | 13 Okt 2026 |
| 4 | EMV QR Code Specification for Payment Systems — Merchant-Presented Mode v1.0 | EMVCo | https://mvallim.github.io/emv-qrcode/docs/EMVCo-Merchant-Presented-QR-Specification-v1-1.pdf | Jul 2017 |
| 5 | Volume transaksi QRIS tembus 12,55 miliar pada semester I 2026 | ANTARA | https://bali.antaranews.com/berita/411036/volume-transaksi-qris-tembus-1255-miliar-pada-semester-i-2026 | 6 Agu 2026 |
| 6 | QRIS dipakai 65,77 juta pengguna dan diterima 44,86 juta gerai | ANTARA (Rizka Khaerunnisa) | https://bali.antaranews.com/berita/411917/qris-dipakai-6577-juta-pengguna-dan-diterima-4486-juta-gerai | 21 Agu 2026 |
| 7 | QRIS (developer portal) | Bank Rakyat Indonesia | https://developers.bri.co.id/en/product/qris | diakses 11 Nov 2026 |
| 8 | Ada pedagang masih ogah pakai QRIS, BI upayakan percepatan settlement | Bisnis.com | https://finansial.bisnis.com/read/20240320/90/1751162/ada-pedagang-masih-ogah-pakai-qris-bi-upayakan-percepatan-settlement | 20 Mar 2024 |
| 9 | UnionPay's new four-party model … (konten bersponsor; hanya untuk nama 4 switching "RAJA") | The Jakarta Post | https://www.thejakartapost.com/business/2025/12/02/unionpays-new-four-party-model-makes-cross-border-qr-payments-seamless-in-indonesia | 2 Des 2025 |
| 10 | Cara kerja QRIS | OttoDigital (PJP) | https://ottodigital.id/artikel/cara-kerja-qris-2/ | 19 Jun 2026 |
| 11 | Bagaimana cara kerja QRIS? | BINUS SoCS (F.R. Tambunan) | https://socs.binus.ac.id/2025/09/23/29921/ | 23 Sep 2025 |
| 12 | How a QRIS Payment Actually Moves in Indonesia (pendukung, bukan primer) | Sudhanshu (blog) | https://sudhanshuraheja.com/qris-payments-in-indonesia-how-it-works-challenges-and-the-future | 24 Feb 2025 |

## Tabel fakta
| fakta | angka/nama | sumber # |
|---|---|---|
| QRIS dikembangkan oleh | Bank Indonesia + ASPI | 2 |
| QRIS disusun dengan standar internasional | EMVCo | 2, 4 |
| Implementasi nasional QRIS dimulai | 1 Januari 2020 | 2 |
| QRIS statis berisi Merchant ID, tetap, dicetak di stiker; konsumen input nominal | — | 2 |
| QRIS dinamis dibuat real time tiap transaksi; nominal dari merchant (EDC/HP) | — | 2, 7 |
| Identitas outlet di QRIS: nama merchant + National Merchant ID (NMID) | — | 2 |
| QR EMV memuat nama merchant (ID 59), kota (ID 60), mata uang (ID 53), negara (58), nominal (54, opsional) | — | 4 |
| Kode diakhiri CRC: checksum atas semua data, untuk cek keutuhan data yang di-scan | ID 63 | 4 |
| Merchant cukup punya akun di 1 PJP; QR bisa di-scan semua aplikasi pembayaran QR | — | 1, 2 |
| Konsumen otorisasi (PIN/sidik jari/wajah) | — | 10, 11 |
| MPM = push payment: transaksi dipicu transfer dari akun nasabah di penerbit | — | 2 |
| Para pihak pemrosesan: PJP (penerbit/acquirer), lembaga switching, lembaga standar, pengelola NMR | — | 1 |
| Switching berada di antara penerbit dan acquirer | — | 11, 12 |
| Jumlah lembaga switching QRIS | 4 (Artajasa, Rintis, Jalin, Alto) | 5, 9 |
| Alur off-us contoh: penerbit → switching penerbit → switching acquirer → acquirer → merchant | — | 12 |
| Merchant & konsumen menerima notifikasi | — | 2 |
| Diproses real-time / hitungan detik | — | 7, 10 |
| Settlement BRI ke merchant | H+1 pukul 06.30–10.00 WIB, cut-off 23.30 | 7 |
| Hampir 55% PJP bisa settlement H+0; beberapa bank 2x sehari | (Mar 2024) | 8 |
| Rekonsiliasi harian antar pihak | — | 12 |
| MDR ditanggung merchant, tidak boleh dibebankan ke konsumen | — | 3 |
| MDR usaha mikro: transaksi ≤ Rp500.000 = 0%; di atasnya 0,3% (berlaku 1 Okt 2026) | — | 3 |
| Batas nominal per transaksi QRIS | Rp10.000.000 | 1, 7 |
| Volume transaksi QRIS semester I 2026 | 12,55 miliar (tumbuh 100,12% yoy) | 5 |
| Pengguna QRIS (Juni 2026) | 65,77 juta; merchant 44,86 juta | 5, 6 |
| Ekosistem: 96 bank, 60 lembaga nonbank, 4 lembaga switching | — | 5 |
