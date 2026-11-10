# Riset — gps-einstein (GPS, jam atom, koreksi relativitas)

Dikumpulkan 11 Nov 2026.

## Sumber
1. GPS.gov (U.S. Government) — "Space Segment". https://www.gps.gov/systems/gps/space
2. GPS.gov — "Control Segment". https://www.gps.gov/systems/gps/control
3. GPS.gov — "GPS Accuracy" (arsip UNT, 18 Des 2020). https://webarchive.library.unt.edu/web/20201218023132/https://www.gps.gov/systems/gps/performance/accuracy
4. NOAA National Ocean Service — "What is GPS?". https://oceanservice.noaa.gov/facts/gps.html
5. Neil Ashby — "Relativity and the Global Positioning System", Physics Today (AIP), 2002. https://muj.optol.cz/~richterek/data/media/ref_str/ashby_pt_200205.pdf
6. Pratap Misra — "Inside the box: GPS and relativity", GPS World, 9 Okt 2023. https://www.gpsworld.com/inside-the-box-gps-and-relativity/

## Tabel fakta
| fakta | angka/nama | sumber # |
|---|---|---|
| Penerima GPS terus "mendengarkan" sinyal satelit; sinyal dipakai seperti meteran raksasa untuk mengukur jarak | — | 4 |
| Butuh jarak ke ≥4 satelit untuk tahu posisi | 4 | 4, 1 |
| Desain konstelasi memastikan ≥4 satelit terlihat dari hampir semua titik di Bumi | ≥4 | 1, 4 |
| Jumlah satelit operasional | 31 (per Apr 2017); "lebih dari 30" | 1, 4 |
| Ketinggian orbit | ±20.200 km (MEO) | 1 |
| Tiap satelit mengelilingi Bumi | 2× sehari | 1, 4 |
| Jumlah bidang orbit | 6, berjarak sama | 1 |
| Tiap satelit membawa jam atom yang sangat stabil | ≥1 jam atom | 5, 1 |
| Gelombang radio menempuh 1 cm dalam 0,03 ns → 1 µs ≈ 300 m (kecepatan cahaya) | 300 m per µs | 5 (turunan) |
| Efek relativitas khusus (satelit bergerak cepat): jam satelit melambat | ±7 µs/hari | 6 |
| Efek relativitas umum (gravitasi lebih lemah): jam satelit lebih cepat | ±45 µs/hari | 6 |
| Selisih bersih | ±38 µs/hari lebih cepat | 6, 5 (4,4645×10⁻¹⁰ ≈ 38,6 µs/hari) |
| Bila tidak dikoreksi: kesalahan navigasi dalam satu hari | > 11 km | 5 (Ashby); 6: kesalahan jarak bisa ±11 km |
| Koreksi: "factory offset" — frekuensi jam diset 10,22999999543 MHz (bukan 10,23 MHz) sebelum diluncurkan | 10,22999999543 MHz | 6, 5 |
| Stasiun kendali utama | Schriever, Colorado (cadangan: Vandenberg, California) | 2 |
| Stasiun pemantau melacak satelit; stasiun kendali menghitung posisi & mengunggah pesan navigasi ke satelit | 16 stasiun pemantau | 2 |
| Akurasi HP ber-GPS di langit terbuka | ±4,9 m (dinaskahkan "sekitar 5 meter") | 3 |
| Akurasi memburuk dekat gedung, jembatan, pohon; sinyal terpantul gedung/tembok ("multipath") | — | 3 |

## Catatan akurasi naskah
- Hook "meleset 11 km sehari" mengikuti Ashby (Physics Today): "navigational errors of more than 11 km" dalam satu hari. Misra (GPS World) mencatat bahwa secara teknis bias ini bisa ikut terserap sebagai bias jam penerima, tetapi kesalahan jarak (range) ke satelit tetap bisa mencapai ±11 km. Naskah memakai frasa "bisa meleset", bukan "pasti".
- "Sepersejuta detik → 300 meter" diturunkan dari kecepatan cahaya (sumber 5: 1 cm per 0,03 ns).
- "Sekitar 5 meter" = pembulatan dari 4,9 m (sumber 3).
