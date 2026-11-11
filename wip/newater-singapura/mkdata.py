import json
L=[
# (teks, tts-or-None, chip, problem, stageKey, key)
("Air bekas toilet di Singapura… diolah sampai layak diminum!",None,"","","","layak diminum"),
("Kalau cuma kamu saring pakai kain, sampahnya nyangkut… tapi airnya masih keruh dan penuh kuman.",None,"","","","pakai kain"),
("Masalahnya, air bekas dari jutaan rumah harus dikumpulin dulu.",None,"TEROWONGAN 48 KM","AIR SEKOTA",'48 KM',"jutaan rumah"),
("Jadi Singapura bikin terowongan pembuangan 48 kilometer, sedalam sekitar 25 lantai.","Jadi Singapura bikin terowongan pembuangan empat puluh delapan kilometer, sedalam sekitar dua puluh lima lantai.","TEROWONGAN 48 KM","AIR SEKOTA",'48 KM',"48 kilometer"),
("Tapi mompa air sebanyak itu mahal. Makanya airnya ngalir sendiri pakai gravitasi, sampai ke Changi.",None,"GRAVITASI","POMPA MAHAL","*","gravitasi"),
("Di instalasi Changi, saringan kasar buang sampah besar, terus kotorannya diendapkan di bak raksasa.",None,"SARING + ENDAPKAN","SAMPAH & LUMPUR","ENDAPKAN","diendapkan"),
("Tapi kotoran yang larut masih ada. Jadi airnya masuk bioreaktor membran: diolah secara biologis, lalu disaring membran yang terendam di dalamnya.",None,"BIOREAKTOR MEMBRAN","KOTORAN LARUT","MEMBRAN","bioreaktor membran"),
("Airnya udah cukup bersih buat dibuang ke laut… tapi Singapura nggak mau buang setetes pun.",None,"","AIR TERBUANG","","setetes pun"),
("Jadi airnya dikirim ke pabrik NEWater, yang ada di atap instalasi itu.",None,"PABRIK NEWATER","","NEWATER","pabrik NEWater"),
("Pertama, mikrofiltrasi: saringan super halus yang nahan partikel mikroskopis dan bakteri.",None,"MIKROFILTRASI","BAKTERI","*","bakteri"),
("Masalahnya, virus jauh lebih kecil. Makanya ada reverse osmosis: membran yang porinya cuma muat buat molekul air.",None,"REVERSE OSMOSIS","VIRUS LOLOS","*","molekul air"),
("Kayak ayakan supermini: air lewat, virus dan kotoran lain ketinggalan.",None,"REVERSE OSMOSIS","VIRUS LOLOS","*","ayakan supermini"),
("Tapi gimana kalau masih ada kuman yang lolos? Jadi terakhir, airnya disinari ultraviolet yang bisa bunuh bakteri dan virus.",None,"SINAR UV","KUMAN TERSISA","UV","ultraviolet"),
("Hasilnya, NEWater: kualitasnya ngelewatin standar air minum WHO.",None,"HASIL","","*","WHO"),
("Kebanyakan NEWater dialirkan lewat pipa khusus ke pabrik chip dan pendingin gedung.",None,"KE INDUSTRI","","INDUSTRI","pabrik chip"),
("Tapi pas kemarau, sebagian dicampur ke waduk, diolah lagi di instalasi air minum, baru sampai ke keranmu.",None,"KE WADUK","KEMARAU","WADUK","keranmu"),
("Sekarang NEWater bisa nutup hampir 40 persen kebutuhan air Singapura… targetnya 55 persen di 2060.","Sekarang NEWater bisa nutup hampir empat puluh persen kebutuhan air Singapura… targetnya lima puluh lima persen di dua ribu enam puluh.","HAMPIR 40%","","40%","40 persen"),
("Selamat, kamu udah bikin NEWater… dari air bekas, jadi air yang bisa diminum lagi.",None,"","","","Selamat,"),
("Follow, besok kita bongkar yang lain… mau apa?",None,"","","","Follow,"),
]
d={"slug":"newater-singapura","hook":"AIR TOILET JADI AIR MINUM?","lines":[l[0] for l in L],"tts":[l[1] or l[0] for l in L],
 "chips":[l[2] for l in L],"problems":[l[3] for l in L],"stageKeys":[l[4] for l in L],"keys":[l[5] for l in L]}
d['tts']=[t.replace('NEWater','New Water') for t in d['tts']]
json.dump(d,open('/tmp/zl/newater-singapura/data.json','w'),ensure_ascii=False,indent=1)
print(len(L),'kalimat',sum(len(x.split()) for x in d['lines']),'kata')
for c in d['chips']:assert len(c)<=18,c
for p in d['problems']:assert len(p)<=22,p
