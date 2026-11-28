# youtube-cdn — Server cache Google di dalam jaringan provider (simpul Google Global Cache)

Dikumpulkan 27 Nov 2026 (mode beruntun). Satu fasilitas: **simpul Google Global Cache (GGC) — rak server Google di dalam gedung/jaringan provider internet (ISP)**. Lokasi simpul spesifik tidak dipublikasikan, jadi ditampilkan sebagai satu simpul generik di gedung provider; tanpa logo Google/YouTube/operator. Tokoh nyata tidak disebut.

## Sumber
1. Google Support "Introduction to GGC": GGC memungkinkan ISP menyajikan sebagian konten Google dari dalam jaringannya sendiri; mengurangi kemacetan & lalu lintas di jalur peering/transit; transparan bagi pengguna. https://support.google.com/interconnect/answer/9058809
2. Google Peering "Infrastructure": edge node = lapisan infrastruktur Google paling dekat ke pengguna; server dari Google dipasang di jaringan ISP; konten statis populer (YouTube, Google Play) disimpan sementara; sistem lalu lintas Google mengarahkan permintaan ke edge node dengan pengalaman terbaik. https://peering.google.com/static/js/site/modules/pages/infrastructure.html
3. Google (via MyBroadband): bila konten belum tersimpan di simpul, simpul mengambilnya dari Google lalu menyimpannya untuk permintaan berikutnya. https://mybroadband.co.za/forum/threads/google-global-cache-ggc.241596/
4. Google Support "Cache-fill": server GGC menyimpan konten secara dinamis sesuai permintaan pengguna lokal & kapasitas; tidak diisi duluan (no pre-fill). https://support.google.com/interconnect/answer/7658593
5. Google Support (traffic): mayoritas lalu lintas GGC adalah konten YouTube yang bisa di-cache; konten yang kurang populer disajikan dari lokasi inti Google. https://support.google.com/interconnect/answer/7658599
6. Panduan GGC (Scribd): ISP hanya menyediakan ruang rak, keyboard & monitor, dan sambungan jaringan; Google memasok perangkat. https://www.scribd.com/document/232899385/GoogleGlobalCache-R720

## Tabel fakta
| fakta | angka/nama | lokasi | sumber # |
|---|---|---|---|
| Server Google dipasang di dalam jaringan ISP | GGC | simpul GGC di gedung provider | 1, 2 |
| Provider menyediakan rak, daya, sambungan | — | simpul GGC di gedung provider | 6 |
| Permintaan diarahkan ke simpul terbaik/terdekat | — | simpul GGC di gedung provider | 2 |
| Sudah tersimpan → dikirim langsung dari simpul | — | simpul GGC di gedung provider | 1, 3 |
| Belum tersimpan → ambil dari Google, simpan untuk berikutnya | — | simpul GGC di gedung provider | 3 |
| Tidak diisi duluan; menyimpan sesuai permintaan lokal | — | simpul GGC di gedung provider | 4 |
| Konten kurang populer → dari pusat data Google | — | simpul GGC di gedung provider | 5 |
| Mayoritas lalu lintasnya video YouTube | — | simpul GGC di gedung provider | 5 |
| Mengurangi kemacetan & lalu lintas keluar provider | — | simpul GGC di gedung provider | 1 |

**Kenyataan berlawanan dugaan (R23):** server ini tidak diisi video duluan — isinya terbentuk sendiri dari apa yang sedang ramai ditonton di sekitarmu (sumber 4).

## Fakta visual
| benda | warna/material/ukuran |
|---|---|
| simpul GGC | beberapa server rak 1U–2U hitam di rak 19" (tinggi ±2 m) dengan lampu indikator, di ruang server ber-AC dengan lantai panggung |
| gedung provider | gedung kantor/sentral telekomunikasi dengan menara antena |
| pusat data Google | gedung gudang besar dengan menara pendingin, jauh |
| kabel | kabel serat optik (kuning/oranye) |
| rumah | ruang keluarga dengan TV |
