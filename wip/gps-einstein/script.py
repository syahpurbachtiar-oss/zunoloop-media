import json
L=[
("Tanpa rumus Einstein, Google Maps-mu bisa meleset 11 kilometer sehari!","Tanpa rumus Einstein, Google Maps-mu bisa meleset sebelas kilometer sehari!","PERTANYAAN","Meleset 11 km?","11 km","Einstein 11 kilometer"),
("Coba kamu bikin sendiri: gimana caranya HP tahu dia ada di mana?","Coba kamu bikin sendiri: gimana caranya HP tahu dia ada di mana?","","Bikin GPS sendiri","GPS","HP"),
("Kalau cuma pakai patokan, kayak masjid atau warung, kamu udah setengah jalan…","Kalau cuma pakai patokan, kayak masjid atau warung, kamu udah setengah jalan…","VERSI 1","Patokan","*","patokan"),
("tapi di tengah laut, patokannya nggak ada.","tapi di tengah laut, patokannya nggak ada.","MASALAH: DI LAUT","Nggak ada patokan","patokan","laut"),
("Jadi kamu pasang patokan di langit: satelit yang terus teriak, \"aku di sini, jam segini!\"","Jadi kamu pasang patokan di langit: satelit yang terus teriak, aku di sini, jam segini!","SOLUSI","Satelit GPS","Satelit","satelit"),
("HP-mu ngukur jaraknya dari waktu: sinyalnya ngebut secepat cahaya, makin telat sampai, makin jauh.","HP-mu ngukur jaraknya dari waktu: sinyalnya ngebut secepat cahaya, makin telat sampai, makin jauh.","CARA UKUR","Jarak dari waktu","waktu","secepat cahaya"),
("Masalahnya, satu jarak cuma bilang kamu ada di mana aja di sebuah bola raksasa.","Masalahnya, satu jarak cuma bilang kamu ada di mana aja di sebuah bola raksasa.","MASALAH: 1 JARAK","Bola raksasa","*","bola raksasa"),
("Jadi kamu tambah satelit kedua dan ketiga, sampai bolanya cuma ketemu di satu titik: posisimu.","Jadi kamu tambah satelit kedua dan ketiga, sampai bolanya cuma ketemu di satu titik: posisimu.","SOLUSI","Tambah 2 satelit","2 satelit","satu titik"),
("Tapi jam di HP-mu murahan. Meleset sepersejuta detik aja, jaraknya meleset 300 meter.","Tapi jam di HP-mu murahan. Meleset sepersejuta detik aja, jaraknya meleset tiga ratus meter.","MASALAH: JAM HP","1 mikrodetik = 300 m","300 m","300 meter"),
("Makanya HP-mu dengerin satelit keempat, buat ngebetulin jamnya sendiri.","Makanya HP-mu dengerin satelit keempat, buat ngebetulin jamnya sendiri.","SOLUSI","Satelit keempat","keempat","keempat"),
("Nah, satelitnya sendiri harus super tepat, jadi tiap satelit bawa jam atom.","Nah, satelitnya sendiri harus super tepat, jadi tiap satelit bawa jam atom.","DI DALAM SATELIT","Jam atom","*","jam atom"),
("Biar di atas kepalamu selalu ada minimal empat, lebih dari 30 satelit muter di enam jalur orbit,","Biar di atas kepalamu selalu ada minimal empat, lebih dari tiga puluh satelit muter di enam jalur orbit,","SUPAYA SELALU ADA 4","30+ satelit, 6 orbit","6 orbit","30 satelit"),
("setinggi 20.200 kilometer, ngelilingin Bumi dua kali sehari.","setinggi dua puluh ribu dua ratus kilometer, ngelilingin Bumi dua kali sehari.","ORBIT","20.200 km","20.200 km","20.200 kilometer"),
("Dan di sinilah Einstein masuk.","Dan di sinilah Einstein masuk.","","Masuk: Einstein","Einstein","Einstein"),
("Satelitnya ngebut, jadi jamnya melambat 7 mikrodetik sehari.","Satelitnya ngebut, jadi jamnya melambat tujuh mikrodetik sehari.","RELATIVITAS KHUSUS","−7 µs per hari","*","melambat"),
("Tapi gravitasi di atas sana lebih lemah, jamnya malah kecepetan 45 mikrodetik.","Tapi gravitasi di atas sana lebih lemah, jamnya malah kecepetan empat puluh lima mikrodetik.","RELATIVITAS UMUM","+45 µs per hari","*","kecepetan"),
("Totalnya kecepetan 38 mikrodetik tiap hari… cukup bikin GPS-mu meleset lebih dari 11 kilometer.","Totalnya kecepetan tiga puluh delapan mikrodetik tiap hari… cukup bikin GPS-mu meleset lebih dari sebelas kilometer.","MASALAH: +38 µs/HARI","Meleset > 11 km","11 km","11 kilometer"),
("Makanya sebelum diluncurkan, detak jam atomnya sengaja diperlambat sedikit di pabrik.","Makanya sebelum diluncurkan, detak jam atomnya sengaja diperlambat sedikit di pabrik.","SOLUSI","Diperlambat di pabrik","pabrik","diperlambat"),
("Terus dari Bumi, stasiun kendali mantau tiap satelit dan ngirim data orbit terbarunya.","Terus dari Bumi, stasiun kendali mantau tiap satelit dan ngirim data orbit terbarunya.","SOLUSI","Stasiun kendali","*","stasiun kendali"),
("Tapi di antara gedung tinggi, sinyalnya mantul dulu ke tembok… makanya titik birumu suka loncat.","Tapi di antara gedung tinggi, sinyalnya mantul dulu ke tembok… makanya titik birumu suka loncat.","MASALAH: GEDUNG","Sinyal mantul","mantul","mantul"),
("Di tempat terbuka, HP biasa bisa tepat sampai sekitar 5 meter.","Di tempat terbuka, HP biasa bisa tepat sampai sekitar lima meter.","LANGIT TERBUKA","Tepat ±5 meter","5 meter","5 meter"),
("Selamat, kamu udah bikin GPS… dan diam-diam, kamu pakai teori Einstein tiap buka Maps!","Selamat, kamu udah bikin GPS… dan diam-diam, kamu pakai teori Einstein tiap buka Maps!","SELESAI","Kamu bikin GPS!","GPS","Selamat GPS"),
("Follow, besok kita bongkar yang lain… mau apa?","Follow, besok kita bongkar yang lain… mau apa?","","Mau bongkar apa?","bongkar","Follow bongkar"),
]
D={"slug":"gps-einstein","hook":"MELESET 11 KM SEHARI?","lines":[l[0] for l in L],"tts":[l[1] for l in L],
 "problems":[l[2] for l in L],"chips":[l[3] for l in L],"stageKeys":[l[4] for l in L],"keys":[l[5] for l in L]}
json.dump(D,open('data.json','w'),ensure_ascii=False,indent=1)
print(len(L), sum(len(l[0].split()) for l in L), "kata")
