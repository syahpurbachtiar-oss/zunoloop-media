import json
R=[
("Jalan ini lebih rendah dari laut… tiap hujan, airnya harus dipompa!","Jalan ini lebih rendah dari laut… tiap hujan, airnya harus dipompa!","","","*","lebih rendah"),
("Ini Pluit, Jakarta Utara. Tanahnya ada yang dua setengah meter di bawah permukaan laut.","Ini Pluit, Jakarta Utara. Tanahnya ada yang dua setengah meter di bawah permukaan laut.","PLUIT, JAKARTA UTARA","","*","di bawah"),
("Tanahnya terus turun, terutama karena air tanah disedot terus-menerus.","Tanahnya terus turun, terutama karena air tanah disedot terus-menerus.","TANAH TERUS TURUN","","*","air tanah"),
("Jadi air hujan nggak bisa mengalir sendiri ke laut. Lautnya justru lebih tinggi.","Jadi air hujan nggak bisa mengalir sendiri ke laut. Lautnya justru lebih tinggi.","LAUT LEBIH TINGGI","","*","lebih tinggi"),
("Makanya kawasan ini dibikin polder: dikelilingi tanggul supaya air laut nggak masuk.","Makanya kawasan ini dibikin polder: dikelilingi tanggul supaya air laut nggak masuk.","POLDER + TANGGUL","","*","tanggul"),
("Saat hujan, air dari jalan dan atap mengalir lewat saluran…","Saat hujan, air dari jalan dan atap mengalir lewat saluran…","SALURAN","","*","saluran"),
("…lalu ditampung dulu di Waduk Pluit, luasnya delapan puluh hektare.","…lalu ditampung dulu di Waduk Pluit, luasnya delapan puluh hektare.","WADUK 80 HEKTARE","","*","Waduk Pluit"),
("Di ujung waduk ada rumah pompa. Sampahnya disaring dulu biar pompa nggak macet.","Di ujung waduk ada rumah pompa. Sampahnya disaring dulu biar pompa nggak macet.","SARINGAN SAMPAH","","*","disaring"),
("Lalu pompa raksasa mengangkat airnya, melewati tanggul, langsung ke Teluk Jakarta.","Lalu pompa raksasa mengangkat airnya, melewati tanggul, langsung ke Teluk Jakarta.","DIANGKAT KE LAUT","","*","mengangkat"),
("Tiga pompa besarnya bisa memindahkan tiga puluh sembilan ribu liter air tiap detik.","Tiga pompa besarnya bisa memindahkan tiga puluh sembilan ribu liter air tiap detik.","39.000 LITER/DETIK","","*","tiap detik"),
("Kolam renang olimpiade bisa dikuras dalam sekitar satu menit!","Kolam renang olimpiade bisa dikuras dalam sekitar satu menit!","±1 MENIT/KOLAM","","*","satu menit"),
("Kalau pompanya berhenti saat hujan deras, air nggak punya jalan keluar.","Kalau pompanya berhenti saat hujan deras, air nggak punya jalan keluar.","POMPA = KUNCI","","*","berhenti"),
("Selamat, kamu udah tahu kenapa Jakarta harus dipompa tiap hujan!","Selamat, kamu udah tahu kenapa Jakarta harus dipompa tiap hujan!","","","*","Selamat"),
("Follow, besok kita bongkar yang lain…","Follow, besok kita bongkar yang lain…","","","*","Follow"),
]
D={"slug":"jakarta-pompa","hook":"LEBIH RENDAH DARI LAUT?!","lines":[r[0] for r in R],"tts":[r[1] for r in R],"chips":[r[2] for r in R],"problems":[r[3] for r in R],"stageKeys":[r[4] for r in R],"keys":[r[5] for r in R]}
st=[];t=.25;du=[]
for l in D["lines"]:
    x=round(.31*len(l.split())+.35,3);st.append(round(t,3));du.append(x);t+=x+.06
D["starts"]=st;D["durs"]=du;D["total"]=round(t+1.2,3)
json.dump(D,open("/home/claude/zl/pompa/data.json","w"),ensure_ascii=False,indent=1)
print(len(R),D["total"])
