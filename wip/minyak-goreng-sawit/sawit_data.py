import json
R=[
("Minyak goreng dari minyak bumi? Ternyata bukan!","Minyak goreng dari minyak bumi? Ternyata bukan!","","","*","bukan"),
("Ada yang minta di komentar: bongkar minyak bumi sampai jadi minyak goreng.","Ada yang minta di komentar: bongkar minyak bumi sampai jadi minyak goreng.","PERMINTAAN KOMENTAR","","*","komentar"),
("Jawabannya: nggak bisa. Minyak bumi itu hidrokarbon, bahan bakar, beracun kalau dimakan.","Jawabannya: nggak bisa. Minyak bumi itu hidrokarbon, bahan bakar, beracun kalau dimakan.","HIDROKARBON = BBM","","*","nggak bisa"),
("Minyak goreng itu lemak tumbuhan, di Indonesia hampir semuanya dari buah sawit.","Minyak goreng itu lemak tumbuhan, di Indonesia hampir semuanya dari buah sawit.","LEMAK DARI SAWIT","","*","sawit"),
("Tandan sawit direbus pakai uap bertekanan sekitar satu setengah jam.","Tandan sawit direbus pakai uap bertekanan sekitar satu setengah jam.","DIREBUS UAP","","*","uap"),
("Lalu daging buahnya diperas jadi minyak sawit mentah, namanya CPO.","Lalu daging buahnya diperas jadi minyak sawit mentah, namanya C P O.","CPO","","*","CPO"),
("Dari satu tandan, cuma sekitar 20 persen yang jadi minyak.","Dari satu tandan, cuma sekitar dua puluh persen yang jadi minyak.","±20% JADI MINYAK","","*","20 persen"),
("CPO dikirim ke kilang minyak goreng, misalnya di Gresik, Jawa Timur.","C P O dikirim ke kilang minyak goreng, misalnya di Gresik, Jawa Timur.","KILANG GRESIK","","*","Gresik"),
("Uniknya, CPO aslinya merah jingga, baunya juga masih tajam.","Uniknya, C P O aslinya merah jingga, baunya juga masih tajam.","ASLINYA MERAH","","*","merah jingga"),
("Pertama, getahnya diikat pakai sedikit asam fosfat.","Pertama, getahnya diikat pakai sedikit asam fosfat.","BUANG GETAH","","*","asam fosfat"),
("Lalu dicampur tanah pemucat, semacam lempung, biar warnanya pudar.","Lalu dicampur tanah pemucat, semacam lempung, biar warnanya pudar.","TANAH PEMUCAT","","*","lempung"),
("Tanahnya disaring, minyaknya jadi kuning.","Tanahnya disaring, minyaknya jadi kuning.","DISARING","","*","kuning"),
("Berikutnya dipanaskan sekitar 250 derajat di ruang hampa, sambil ditiup uap.","Berikutnya dipanaskan sekitar dua ratus lima puluh derajat di ruang hampa, sambil ditiup uap.","±250°C VAKUM","","*","250 derajat"),
("Baunya ikut menguap, minyaknya jadi nggak berbau.","Baunya ikut menguap, minyaknya jadi nggak berbau.","BAU HILANG","","*","menguap"),
("Terakhir, minyak didinginkan pelan-pelan sampai sebagian membeku.","Terakhir, minyak didinginkan pelan-pelan sampai sebagian membeku.","DIDINGINKAN","","*","membeku"),
("Bagian padat, stearin, jadi bahan margarin. Bagian cair, olein, itulah minyak goreng.","Bagian padat, stearin, jadi bahan margarin. Bagian cair, olein, itulah minyak goreng.","OLEIN = MINYAK GORENG","","*","olein"),
("Oleinnya disaring, lalu dikemas ke botol.","Oleinnya disaring, lalu dikemas ke botol.","DIKEMAS","","*","botol"),
("Selamat, kamu udah tahu minyak goreng asalnya dari sawit, bukan minyak bumi!","Selamat, kamu udah tahu minyak goreng asalnya dari sawit, bukan minyak bumi!","","","*","Selamat"),
("Follow, besok kita bongkar yang lain…","Follow, besok kita bongkar yang lain…","","","*","Follow"),
]
D={"slug":"minyak-goreng-sawit","hook":"DARI MINYAK BUMI?!","lines":[r[0] for r in R],"tts":[r[1] for r in R],"chips":[r[2] for r in R],"problems":[r[3] for r in R],"stageKeys":[r[4] for r in R],"keys":[r[5] for r in R]}
st=[];t=.25;du=[]
for l in D["lines"]:
    x=round(.31*len(l.split())+.35,3);st.append(round(t,3));du.append(x);t+=x+.06
D["starts"]=st;D["durs"]=du;D["total"]=round(t+1.2,3)
json.dump(D,open("/home/claude/zl/sawit/data.json","w"),ensure_ascii=False,indent=1)
print(len(R),D["total"])
