# Riset — wa-luar-negeri (Dibongkar #3)

Topik: Chat WhatsApp ke luar negeri — HP → BTS → serat optik → kabel bawah laut → server.
Riset 10 Nov 2026 (run otomatis). Semua kalimat naskah hanya memakai fakta di tabel bawah.

## Sumber
| # | Judul | Penerbit | Tanggal | URL |
|---|---|---|---|---|
| 1 | Submarine Cable FAQs | TeleGeography | "as of 2026" | https://www2.telegeography.com/submarine-cable-faqs-frequently-asked-questions |
| 2 | Do Submarine Cables Account For Over 99% of Intercontinental Data Traffic? (Alan Mauldin) | TeleGeography | 4 Mei 2023 | https://resources.telegeography.com/2023-mythbusting-part-3 |
| 3 | Privacy Policy – UK (berlaku 2 Juli 2026) | WhatsApp LLC | 2026 | https://www.whatsapp.com/legal/privacy-policy-uk |
| 4 | Mobile networks explained (Channa Seneviratne) | Telstra Exchange | 28 Mei 2026 | https://www.telstra.com.au/exchange/-mobile-networks-explained--why-your-mobile-signal-and-coverage- |
| 5 | Mobile Backhaul: An Overview | GSMA | 19 Jun 2019 | https://www.gsma.com/solutions-and-impact/technologies/networks/gsma_resources/mobile-backhaul-an-overview/ |
| 6 | ED 476 "Light Speed, Under the Sea" | EarthDate (UT Austin Bureau of Economic Geology) | 2026 | https://www.earthdate.org/files/000/005/162/ED476_26Q2_Light%20Speed%2C%20Under%20the%20Sea.pdf |
| 7 | Fiber optic cables for information exchange | NYU ITP (universitas) | – | https://itp.nyu.edu/networks/explanations/fiber-optics-cables-for-information-exchange/ |
| 8 | How does fiber optics work? (Chris Woodford) | Explain that Stuff | upd. 27 Agu 2026 | https://explainthatstuff.com/fiberoptics.html |
| 9 | Under The Sea: Optical Repeaters For Submarine Cables (Dan Maloney) | Hackaday | 8 Agu 2023 | https://hackaday.com/2023/08/08/under-the-sea-optical-repeaters-for-submarine-cables/ |
| 10 | How Submarine Fiber-Optic Cables Work (Kieran Clark) | SubTel Forum | 14 Jul 2026 | https://subtelforum.com/how-submarine-cables-work/ |
| 11 | Submarine Cable Protection and the Environment #9 (Dr Mike Clare) | ICPC | Okt 2024 | https://iscpc.org/publications/submarine-cable-protection-and-the-environment/ICPC_Public_EU_October_2024.pdf |
| 12 | Singapura–Indonesia Memanas soal Internet, Ini Peta Kabel Laut Kedua Negara (Leoni Susanto) | Katadata | 28 Okt 2026 | https://katadata.co.id/digital/teknologi/6ae1b7a46c5b0/singapura-indonesia-memanas-soal-internet-ini-peta-kabel-laut-kedua-negara |
| 13 | Limitations in Current U.S. Security Frameworks for the Subsea Cable Industry | Jackson School, Univ. of Washington | 9 Apr 2025 | https://jsis.washington.edu/news/limitations-in-current-u-s-security-frameworks-for-the-subsea-cable-industry/ |
| 14 | Statistics on Subsea Cable Fault and Repair (Winston Qiu) | Submarine Networks | 28 Jun 2025 | https://www.submarinenetworks.com/en/nv/insights/statistics-on-subsea-cable-fault-and-repair |

## Tabel fakta
| Fakta | Angka / nama | Sumber # |
|---|---|---|
| Kabel bawah laut membawa >99% lalu lintas data antarbenua (TeleGeography: "We can confirm that this is true"); estimasi lain 95–99% / >95% lalu lintas internasional | >99% antarbenua | 2, 13, 6 |
| HP terhubung ke menara dengan sinyal terkuat memakai gelombang radio | radio → menara (BTS) | 4 |
| Backhaul = koneksi yang membawa data antara menara dan jaringan; bisa serat optik atau radio gelombang mikro | serat optik / microwave | 4, 5 |
| Pesan & panggilan pribadi WhatsApp dienkripsi end-to-end; "not even WhatsApp" bisa membaca | E2E | 3 |
| Pesan yang belum bisa terkirim disimpan terenkripsi di server hingga 30 hari | 30 hari | 3 |
| Setelah terkirim, pesan dihapus dari server | dihapus | 3 |
| Di serat optik, sinyal listrik diubah jadi cahaya oleh laser, berupa pulsa cahaya | laser, pulsa cahaya | 6, 8 |
| Serat kaca setipis rambut manusia | ≈ diameter rambut | 1, 7 |
| Inti (core) dibungkus cladding: kaca berbeda yang memantulkan cahaya kembali ke inti (pantulan internal total) | cladding | 6, 7, 8 |
| Cahaya di serat ≈ 2/3 kecepatan cahaya ≈ 199.861.639 m/s | ±200.000 km/detik | 7, 8 |
| Dekat pantai kabel diberi lapisan pelindung (armor, kawat baja) dan dikubur di bawah dasar laut | armor + dikubur 0,5–1 m | 1, 10, 11 |
| Di laut dalam, kabel umumnya selebar selang taman | selang taman | 1 |
| Jarak jauh butuh repeater (single-mode hingga 50–80 km); TAT-8: repeater tiap ±50 km | tiap puluhan km | 7, 9 |
| Repeater = penguat optik dalam rumah tahan tekanan; menguatkan cahaya tanpa diubah jadi sinyal listrik | tahan tekanan | 10, 9 |
| EDFA: loop serat berdoping erbium 10–20 m, dipompa laser 980/1.480 nm | erbium + laser pompa | 9 |
| Repeater ditenagai konduktor tembaga di dalam kabel, dari stasiun pendaratan; 10–15 kV, 1–2 A | belasan ribu volt | 9, 6, 10 |
| Sekitar 200 gangguan/kerusakan kabel per tahun (ICPC 150–200) | ±200/tahun | 1, 14, 11 |
| Kapal nelayan & jangkar kapal = ±2/3 gangguan (Submarine Networks: 86% termasuk dugaan); bencana alam ±10% | mayoritas | 1, 6, 11, 14 |
| Kapal khusus datang, mengangkat kabel ke permukaan untuk perbaikan | kapal perbaikan | 6 |
| Indonesia–Singapura: ≥24 kabel laut (data TeleGeography), 17 sudah beroperasi | 17 beroperasi | 12 |
| >600 kabel aktif & rencana, >1,5 juta km | 600+, 1,5 juta km | 1 |

## Catatan akurasi
- Hook asli "Chat WA-mu ke luar negeri… menyelam ke dasar laut dulu" dipoles jadi "ke kakak di **Belanda**… **hampir pasti** nyelam ke dasar laut": klaim >99% berlaku untuk lalu lintas **antarbenua**, jadi tujuan dibuat antarbenua dan diberi "hampir pasti".
- Lokasi server WhatsApp tidak dipublikasikan rinci → naskah tidak menyebut negara server.
- Arti centang WA tidak dipakai (halaman FAQ resmi tidak bisa diakses saat riset).
- Backhaul disederhanakan jadi "kabel serat optik" (sumber: bisa juga gelombang mikro).
