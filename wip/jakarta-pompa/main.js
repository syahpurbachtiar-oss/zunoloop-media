
/* ================= bahan bersama ================= */
const grassTex=rep=>ctex(256,256,(c,w,h)=>{c.fillStyle='#86a062';c.fillRect(0,0,w,h);const cs=['#7a9458','#91ab6c','#748e55'];for(let i=0;i<9000;i++){c.fillStyle=cs[i%3];c.fillRect(Math.floor(hash(i*1.7)*w),Math.floor(hash(i*2.3+.5)*h),3,3)}},rep);
const CONC=Ms({color:0xa9aba6,roughness:.85,map:ctex(256,256,(c,w,h)=>{c.fillStyle='#b4b6b1';c.fillRect(0,0,w,h);const cs=['#a7a9a4','#bfc1bc','#9d9f9a'];for(let i=0;i<6000;i++){c.fillStyle=cs[i%3];c.fillRect(Math.floor(hash(i*3.1)*w),Math.floor(hash(i*1.9+.3)*h),2,2)}},[4,4])});
const C_SEA=0x14528f,C_WAD=0x5f6a46,C_FLOOD=0x7a6a48;
/*butiran: hujan = garis tipis (LineSegments), bukan bola*/
function rainLines(sc,n){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(new Float32Array(n*6),3));const l=new THREE.LineSegments(g,new THREE.LineBasicMaterial({color:0xd6e2ec,transparent:true,opacity:.55}));l.frustumCulled=false;sc.add(l);
 return {l,set(t,c,sx,sy,sz,len,sp){const a=g.attributes.position.array;for(let i=0;i<n;i++){const x=c.x+(hash(i*1.31)-.5)*sx,z=c.z+(hash(i*2.77+.4)-.5)*sz,ph=(hash(i*.91+.2)+t*sp/sy)%1,y=c.y+sy*(1-ph);a.set([x,y,z,x+len*.08,y-len,z],i*6)}g.attributes.position.needsUpdate=true}}}

/* ================= SET 1: KOTA (Pluit, skala nyata) ================= */
const kota=outdoor('#9cbad6','#dfe6ea',70,520);AS.sun(kota,[-60,90,-40],90,2.3);
const GR_MAT=Ms({color:0xffffff,roughness:1,map:grassTex([60,60])});
mk(new THREE.PlaneGeometry(m(455.2),m(400)).rotateX(-PI/2),GR_MAT,kota,[-222.4,0,0]).castShadow=false;
mk(new THREE.PlaneGeometry(m(2.4),m(400)).rotateX(-PI/2),Ms({color:0xffffff,roughness:1,map:grassTex([1,60])}),kota,[8.2,0,0]).castShadow=false;
AS.road(kota,0,-120,0,120,8,true);AS.paving(kota,4.6,0,1.2,240);
// saluran beton terbuka (dinding x 5.2–5.5 & 6.7–7.0, dasar y −1.2)
for(const x of[5.35,6.85])COL.solid(mk(box(.3,1.42,400),CONC,kota,[x,-.59,0]),null,'dinding-saluran');
mk(box(1.2,.2,400),CONC,kota,[6.1,-1.2,0]);
const SAL=mk(new THREE.PlaneGeometry(m(1.18),m(400)).rotateX(-PI/2),LQ.mat({color:0x6e6b4c,opacity:.95,speed:.9,rep:[1,90]}),kota,[6.1,-.75,0]);SAL.castShadow=false;
// tanggul laut: dinding beton + topi; laut biru tua lebih tinggi dari jalan
const TGL=mk(box(1.2,3.0,400),CONC,kota,[10,1.5,0]);COL.solid(TGL,null,'tanggul');mk(box(1.5,.25,400),Ms({color:0x9a9c97,roughness:.8}),kota,[10,3.125,0]);
const SEA_K=AS.sea(kota,160.6,0,300,400,2.0);
// deretan ruko/rumah menghadap jalan
const HR=new THREE.Group();kota.add(HR);HR.position.set(m(-11),0,0);HR.rotation.y=-PI/2;AS.houseRow(HR,{x0:-70,z:0,n:16,w:8.6,d:10});
for(let i=0;i<10;i++)AS.tree(kota,-5.4,-60+i*13,.8);
const RAIN_K=rainLines(kota,700);
const aK=()=>{A.root.position.set(m(2.6),m(.05),m(0));A.root.rotation.y=-2.75};
const camA=()=>[Cm(.6,4.6,-4.8),Cm(4.0,.2,4.6),44];

/* ================= SET 2: DIORAMA PENAMPANG (maket di meja) ================= */
const dio=new THREE.Scene();dio.background=new THREE.Color(0x1c2128);dio.add(new THREE.HemisphereLight(0xffffff,0x303840,1.35));{const l=new THREE.DirectionalLight(0xffffff,1.7);l.position.set(m(3),m(10),m(9));l.castShadow=true;l.shadow.mapSize.set(2048,2048);Object.assign(l.shadow.camera,{left:-m(7),right:m(7),top:m(7),bottom:-m(7)});dio.add(l)}
mk(box(8,.4,4),Ms({color:0x3a2e26,roughness:.7}),dio,[-.2,-1.75,0]);
const SOIL=Ms({color:0x8a6a48,roughness:1,map:ctex(128,128,(c,w,h)=>{c.fillStyle='#8a6a48';c.fillRect(0,0,w,h);const cs=['#7d5f40','#977656','#6f5438'];for(let i=0;i<1800;i++){c.fillStyle=cs[i%3];c.fillRect(Math.floor(hash(i*2.1)*w),Math.floor(hash(i*1.3+.7)*h),2,2)}},[2,2])});
// laut kiri: dasar tanah + air (body) permukaan y 1.6
mk(box(1.5,.7,3),SOIL,dio,[-2.45,-1.2,0]);
const SEA_D=LQ.body(m(1.48),m(2.45),m(2.98),{color:C_SEA,opacity:.82});SEA_D.mesh.position.set(m(-2.46),m(-.85),0);dio.add(SEA_D.mesh);
// tanggul
const TGD=mk(box(.45,4.0,3),Ms({color:0xa9aba6,roughness:.8,emissive:0xffd23a,emissiveIntensity:0}),dio,[-1.475,.45,0]);COL.solid(TGD,null,'tanggul-maket');
// waduk: dasar + air
mk(box(1.05,.6,3),SOIL,dio,[-.725,-1.25,0]);
const WAD_D=LQ.body(m(1.03),m(1.0),m(2.98),{color:C_WAD,opacity:.85});WAD_D.mesh.position.set(m(-.725),m(-.95),0);dio.add(WAD_D.mesh);
// daratan (turun saat shot penurunan tanah): blok tanah + lapisan air tanah + rumah
const LAND=new THREE.Group();dio.add(LAND);
const LAND_B=mk(box(3.0,1.6,3),SOIL,LAND,[1.3,-.8,0]);
mk(box(3.02,.25,3.02),Ms({color:0x5f8fb0,roughness:.6}),LAND,[1.3,-1.25,0]);
mk(box(3.0,.04,3),Ms({color:0x7d8a5a,roughness:1}),LAND,[1.3,.02,0]);
mk(box(3.0,.03,.7),Ms({color:0x4a4c50,roughness:.9}),LAND,[1.3,.055,.6]);
const HM=[];[[.3,-.6,'#e9c46a'],[.95,-.7,'#e76f51'],[1.6,-.6,'#a8dadc'],[2.25,-.7,'#f4a261']].forEach(([x,z,col])=>{const g=new THREE.Group();g.position.set(m(x),m(.04),m(z));LAND.add(g);mk(box(.5,.45,.55),Ms({color:col,roughness:.8}),g,[0,.225,0]);mk(new THREE.ConeGeometry(m(.45),m(.26),4),Ms({color:0x8a3b2e}),g,[0,.58,0],[0,PI/4,0]);HM.push(g)});
COL.solid(HM[0].children[0],null,'rumah-maket');
// sumur air tanah di bidang potong depan (pipa ke lapisan biru) + pompa kecil
const WELLX=2.2;mk(cyl(.04,.04,1.45,10),DSTEEL,LAND,[WELLX,-.6,1.5]);mk(box(.22,.18,.16),Ms({color:0x2f6db5}),LAND,[WELLX,.13,1.42]);
const WELL_S=LQ.stream([Cm(WELLX,-1.3,1.55),Cm(WELLX,-.6,1.55),Cm(WELLX,.04,1.55)],m(.025),LQ.mat({color:0x6fb0e0,opacity:.95,speed:2.2,rep:[1,4]}));LAND.add(WELL_S.mesh);
// genangan di daratan (naik saat hujan / pompa mati)
const FLD=LQ.body(m(2.95),m(.5),m(2.95),{color:C_FLOOD,opacity:.8});FLD.mesh.position.set(m(1.3),m(.045),0);LAND.add(FLD.mesh);
// rumah pompa di atas waduk + pipa melewati tanggul ke laut
const PH=new THREE.Group();dio.add(PH);PH.position.set(m(-.725),0,m(-.6));
for(const x of[-.3,.3])for(const z of[-.3,.3])mk(cyl(.035,.035,1.6,8),CONC,PH,[x,-.2,z]);
mk(box(.8,.12,.8),CONC,PH,[0,.66,0]);mk(box(.75,.6,.75),Ms({color:0xe7e2d6,roughness:.8}),PH,[0,1.02,0]);mk(box(.85,.08,.85),Ms({color:0x2f6db5}),PH,[0,1.36,0]);
COL.solid(PH.children[5],null,'rumah-pompa-maket');
AS.pipe(PH,[[0,-.75,0],[0,.6,0]],.06,DSTEEL,false);
AS.pipe(dio,[[-.725,1.4,-.6],[-.725,2.75,-.6],[-2.6,2.75,-.6],[-2.6,1.85,-.6]],.06,DSTEEL,true);
const OUT_D=LQ.pour(Cm(-2.6,1.8,-.6),Cm(-2.6,1.62,-.6),m(.05));dio.add(OUT_D.mesh);
// saluran: aliran dari rumah ke waduk (di atas tanah)
const SAL_D=LQ.stream([Cm(2.7,.12,1.1),Cm(1.2,.12,1.1),Cm(-.1,.12,1.1),Cm(-.35,.0,1.1),Cm(-.5,-.62,1.1)],m(.05),LQ.mat({color:0x7a7656,opacity:.92,speed:1.4,rep:[1,6]}));LAND.add(SAL_D.mesh);
const RAIN_D=rainLines(dio,220);

/* ================= SET 3: WADUK PLUIT + SARINGAN + RUMAH POMPA (skala nyata) ================= */
const wad=outdoor('#9cbad6','#dfe6ea',90,600);AS.sun(wad,[-80,110,60],120,2.3);
const WAD_W=mk(new THREE.PlaneGeometry(m(300),m(120)).rotateX(-PI/2),LQ.mat({color:C_WAD,opacity:1,ripple:true,rep:[150,60],speed:.05}),wad,[-150,-1.0,0]);WAD_W.castShadow=false;
for(const z of[-60.15,60.15])mk(box(300,1.9,.3),CONC,wad,[-150,-.85,z]);
const GW=Ms({color:0xffffff,roughness:1,map:grassTex([40,30])});for(const z of[-180.15,180.15])mk(new THREE.PlaneGeometry(m(357.4),m(239.7)).rotateX(-PI/2),GW,wad,[-141.3,0,z]).castShadow=false;
for(const z of[-32.325,32.325])mk(new THREE.PlaneGeometry(m(37.4),m(55.95)).rotateX(-PI/2),GW,wad,[18.7,0,z]).castShadow=false;
mk(new THREE.PlaneGeometry(m(3.4),m(8.7)).rotateX(-PI/2),GW,wad,[35.7,0,0]).castShadow=false;
for(const z of[-32.3,32.3])mk(box(.3,1.9,56),CONC,wad,[-.15,-.85,z]);
// eceng gondok di tepi
for(let i=0;i<14;i++){const x=-6-hash(i*1.7)*70,z=(i%2?1:-1)*(48+hash(i*2.9)*9);mk(cyl(1.6+hash(i)*2,1.8+hash(i)*2,.18,10),Ms({color:0x4f7a36,roughness:.9}),wad,[x,-.92,z])}
// rumah-rumah di seberang waduk
const HW=new THREE.Group();wad.add(HW);HW.position.set(m(-120),0,m(72));AS.houseRow(HW,{x0:-60,z:0,n:12,w:8.6,d:10});
const HW2=new THREE.Group();wad.add(HW2);HW2.position.set(m(-120),0,m(-72));AS.houseRow(HW2,{x0:-60,z:0,n:12,w:8.6,d:10});
// kanal masuk (x 0..20, lebar 8) dengan dinding beton & air
for(const z of[-4.15,4.15])COL.solid(mk(box(20,3.6,.3),CONC,wad,[10,-1.5,z]),null,'dinding-kanal');
mk(box(20,.3,8),CONC,wad,[10,-3.3,0]);
mk(new THREE.PlaneGeometry(m(8),m(20)).rotateX(-PI/2).rotateY(PI/2),LQ.mat({color:C_WAD,opacity:1,speed:.35,rep:[1,3]}),wad,[10,-1.0,0]);
for(const z of[-6.3,6.3])mk(new THREE.PlaneGeometry(m(20),m(3.9)).rotateX(-PI/2),Ms({...PO,color:0xffffff,roughness:.9,map:ctex(64,64,(c,w,h)=>{c.fillStyle='#c9c6be';c.fillRect(0,0,w,h)})}),wad,[10,.03,z]).castShadow=false;
// saringan sampah: jeruji baja miring + gantri garu + bak sampah
const RACK=new THREE.Group();wad.add(RACK);RACK.position.set(m(7),m(-3.15),0);RACK.rotation.z=-.33;
for(let i=0;i<34;i++)mk(box(.06,4.6,.12),DSTEEL,RACK,[0,2.3,-3.9+i*.236]);mk(box(.2,.2,8),DSTEEL,RACK,[0,4.6,0]);mk(box(.2,.2,8),DSTEEL,RACK,[0,.1,0]);
const DECK=mk(box(4,.35,8.9),CONC,wad,[10.6,.175,0]);COL.solid(DECK,null,'lantai-saringan');
for(const z of[-4.2,4.2]){mk(box(.25,4.2,.25),Ms({color:0xe6b422,roughness:.5}),wad,[9.4,2.4,z]);}
mk(box(.3,.3,8.7),Ms({color:0xe6b422,roughness:.5}),wad,[9.4,4.5,0]);
const RAKE=new THREE.Group();wad.add(RAKE);{mk(box(.22,.3,7.8),Ms({color:0xe6b422,roughness:.5}),RAKE,[0,0,0]);for(let i=0;i<20;i++)mk(box(.32,.06,.06),DSTEEL,RAKE,[-.22,-.1,-3.7+i*.39])}
const BIN=new THREE.Group();wad.add(BIN);BIN.position.set(m(11.4),m(.35),m(0));{const bm=Ms({color:0x2f8a52,roughness:.6});mk(box(2.0,.1,2.4),bm,BIN,[0,.05,0]);for(const z of[-1.15,1.15])mk(box(2.0,1.2,.1),bm,BIN,[0,.6,z]);for(const x of[-.95,.95])mk(box(.1,1.2,2.4),bm,BIN,[x,.6,0])}
COL.solid(BIN,{t:'rshell',x0:m(1.0),z0:m(1.2),x1:m(1.0),z1:m(1.2),y0:0,y1:m(1.2),w:m(.1)},'bak-sampah');
COL.intake(BIN,{min:[-m(.9),m(.1),-m(1.1)],max:[m(.9),m(1.2),m(1.1)]},'bak-sampah');
// talang penampung di puncak saringan (sampah dari garu jatuh ke sini)
const TROUGH=new THREE.Group();wad.add(TROUGH);TROUGH.position.set(m(9.0),m(.9),0);{const tm=Ms({color:0x5c636b,roughness:.5});mk(box(1.0,.06,7.8),tm,TROUGH,[0,.03,0]);for(const x of[-.47,.47])mk(box(.06,.5,7.8),tm,TROUGH,[x,.25,0]);for(const z of[-3.87,3.87])mk(box(1.0,.5,.06),tm,TROUGH,[0,.25,z]);for(const z of[-3.5,0,3.5])mk(box(.1,.6,.1),tm,TROUGH,[0,-.3,z])}
COL.solid(TROUGH,{t:'rshell',x0:m(.5),z0:m(3.9),x1:m(.5),z1:m(3.9),y0:0,y1:m(.5),w:m(.06)},'talang');
COL.intake(TROUGH,{min:[-m(.44),m(.06),-m(3.84)],max:[m(.44),m(.5),m(3.84)]},'talang');
// sampah terapung (botol, kantong) — benda lepas
const TRASH=[];[[0xd8e6ef,.5,.12,.12],[0xe23a3a,.35,.25,.3],[0x2f8ad6,.45,.1,.1],[0xf2f2f2,.3,.28,.3],[0x3a9a4a,.4,.12,.12],[0xf2c230,.32,.2,.25]].forEach(([c,w,h,d],i)=>{const o=mk(box(w,h,d),Ms({color:c,roughness:.5}),wad);COL.item(o,[-m(w/2),0,0],[m(w/2),0,0],m(Math.min(h,d)/2),'sampah');TRASH.push(o)});
// rumah pompa (eksterior) + tanggul + laut + pipa keluar
const PHW=mk(box(14,9,18),Ms({color:0xe4ded0,roughness:.85}),wad,[27,4.5,0]);COL.solid(PHW,null,'rumah-pompa');mk(box(14.6,.5,18.6),Ms({color:0x2f6db5,roughness:.6}),wad,[27,9.24,0]);
for(let i=0;i<4;i++)mk(box(.06,1.4,2.2),Ms({color:0x41556b}),wad,[19.95,5.4,-6+i*4]);
const TGW=mk(box(1.2,3.6,300),CONC,wad,[38,1.8,0]);COL.solid(TGW,null,'tanggul');mk(box(1.5,.25,300),Ms({color:0x9a9c97,roughness:.8}),wad,[38,3.725,0]);
const SEA_W=AS.sea(wad,188.6,0,300,300,2.0);
const PZ=[-5,0,5],OUTS=[];
PZ.forEach(z=>{AS.pipe(wad,[[34,3.2,z],[36.4,3.2,z],[36.4,4.7,z],[40.2,4.7,z],[40.2,2.9,z]],.6,DSTEEL,true);mk(box(.5,2.6,.5),CONC,wad,[34.8,1.3,z]);
 const o=LQ.pour(Cm(40.2,2.3,z),Cm(40.4,2.0,z),m(.5),LQ.mat({color:0x7f8a66,opacity:.92,speed:3,rep:[1,3]}));wad.add(o.mesh);OUTS.push(o)});
const FOAM=[];PZ.forEach((z,i)=>{const p=puffs(wad,5,2.4,0xf4f6f6,.5);p.forEach((s,j)=>{s.position.copy(Cm(40.6+j*.5,2.25,z+(j-2)*.5));FOAM.push(s)})});

/* ================= SET 4: RUANG POMPA (interior) ================= */
const rp=hall(26,16,10,0xd9dcd6);
const PUMPS=[];const MOT=MET({color:0x5d7a6a,roughness:.4,metalness:.5}),BLUE=MET({color:0x2f6db5,roughness:.35,metalness:.4});
[-4,0,4].forEach((x,i)=>{const g=new THREE.Group();g.position.set(m(x),0,0);rp.add(g);
 // kepala buang pompa (biru) di lantai + siku keluar ke dinding belakang
 mk(cyl(1.05,1.05,.3,32),BLUE,g,[0,.15,0]);mk(cyl(.8,.8,1.1,32),BLUE,g,[0,.85,0]);mk(cyl(1.0,1.0,.16,32),BLUE,g,[0,1.48,0]);
 AS.pipe(g,[[0,.85,-.6],[0,.85,-7.9]],.55,BLUE,true);
 // dudukan motor (4 kaki) + kopling berputar + motor listrik
 for(const a of[0,1,2,3]){const an=a*PI/2+PI/4;mk(box(.16,1.5,.16),DSTEEL,g,[Math.cos(an)*.72,2.3,Math.sin(an)*.72])}
 const st=mk(cyl(1.05,1.05,.16,32),DSTEEL,g,[0,3.1,0]);
 const cp=new THREE.Group();cp.position.set(0,m(2.3),0);g.add(cp);mk(cyl(.14,.14,1.4,16),STEEL,cp,[0,0,0]);const disk=mk(cyl(.42,.42,.14,24),DSTEEL,cp,[0,.1,0]);for(let b=0;b<6;b++)mk(box(.1,.16,.1),Ms({color:0xe6b422}),cp,[Math.cos(b*PI/3)*.3,.1,Math.sin(b*PI/3)*.3]);
 const mot=mk(cyl(.9,.9,2.0,32),MOT,g,[0,4.18,0]);for(let r=0;r<6;r++)mk(cyl(.95,.95,.06,32),MOT,g,[0,3.4+r*.32,0]);mk(cyl(.6,.9,.4,32),MOT,g,[0,5.38,0]);mk(box(.5,.4,.4),MOT,g,[.95,4.6,0]);
 COL.solid(mot,null,'motor');PUMPS.push({g,cp,disk})});
// jalan pipa ke dinding belakang, panel kendali, kran jembatan
mk(box(25,.4,.6),Ms({color:0xe6b422,roughness:.5}),rp,[0,8.6,-3]);mk(box(.6,.5,1.2),Ms({color:0xe6b422}),rp,[3,8.2,-3]);
const PANEL_=new THREE.Group();rp.add(PANEL_);PANEL_.position.set(m(-11.5),0,m(-5));PANEL_.rotation.y=PI/2;for(let i=0;i<4;i++){mk(box(1.1,2.2,.6),Ms({color:0xe9ecee,roughness:.4}),PANEL_,[i*1.15-1.7,1.1,0]);for(let j=0;j<3;j++)mk(box(.12,.12,.04),Ms({color:[0x30d060,0xffb000,0xd23a2a][j],emissive:[0x30d060,0xffb000,0xd23a2a][j],emissiveIntensity:.8}),PANEL_,[i*1.15-1.95+j*.2,1.75,.31])}

/* ================= SET 5: KOLAM RENANG OLIMPIADE (pembanding) ================= */
const pool=outdoor('#9cbad6','#e6ecef',80,500);AS.sun(pool,[-60,90,50],70,2.3);
const TILE=ctex(128,128,(c,w,h)=>{c.fillStyle='#7fc4e6';c.fillRect(0,0,w,h);c.strokeStyle='rgba(255,255,255,.5)';c.lineWidth=2;for(let i=0;i<=8;i++){c.beginPath();c.moveTo(i*16,0);c.lineTo(i*16,h);c.stroke();c.beginPath();c.moveTo(0,i*16);c.lineTo(w,i*16);c.stroke()}},[25,12]);
const PT=Ms({color:0xffffff,roughness:.6,map:TILE});
mk(box(50,.2,25),PT,pool,[0,-2.1,0]);for(const z of[-12.6,12.6])mk(box(50.4,2.2,.2),PT,pool,[0,-1.0,z]);for(const x of[-25.1,25.1])mk(box(.2,2.2,25.4),PT,pool,[x,-1.0,0]);
for(let i=0;i<8;i++)mk(box(46,.01,.3),Ms({color:0x1f3f8a}),pool,[0,-1.995,-10.94+i*3.125]);
for(const [cx,cz,w,d] of[[0,-19,70,12.6],[0,19,70,12.6],[-30.1,0,9.8,25.4],[30.1,0,9.8,25.4]])AS.paving(pool,cx,cz,w,d,'#e8e2d6');
const POOLW=LQ.body(m(49.9),m(2.0),m(24.9),{color:0x3fa2e0,opacity:.7});POOLW.mesh.position.set(0,m(-2.0),0);pool.add(POOLW.mesh);
const tmCv=document.createElement('canvas');tmCv.width=512;tmCv.height=256;const tmTex=new THREE.CanvasTexture(tmCv);tmTex.colorSpace=THREE.SRGBColorSpace;let tmK='';
function drawTimer(s){s=Math.floor(s);if(s===tmK)return;tmK=s;const x=tmCv.getContext('2d');x.fillStyle='#10161c';x.fillRect(0,0,512,256);x.fillStyle='#ffd23a';x.font='bold 150px Inter,Arial';x.textAlign='center';x.fillText(`${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`,256,190);tmTex.needsUpdate=true}drawTimer(0);
const TMB=new THREE.Group();pool.add(TMB);TMB.position.set(m(-30),0,m(-8));TMB.rotation.y=PI/2;mk(box(.25,4,.25),DSTEEL,TMB,[0,2,0]);mk(box(4.4,2.4,.2),Ms({color:0x15171a}),TMB,[0,4.8,0]);mk(new THREE.PlaneGeometry(m(4.2),m(2.1)),new THREE.MeshBasicMaterial({map:tmTex,toneMapped:false}),TMB,[0,4.8,.11]);
COL.solid(TMB.children[1],null,'papan-waktu');

/* ================= SAMPUL ================= */
const cov=new THREE.Scene();cov.add(new THREE.HemisphereLight(0xffffff,0x8a94a0,1.6));{const l=new THREE.DirectionalLight(0xffffff,2.3);l.position.set(m(3),m(6),m(5));cov.add(l)}
{const g=new THREE.Group();cov.add(g);
 const sw=new THREE.Mesh(new THREE.BoxGeometry(m(1.6),m(1.5),m(1.4)),Ms({color:C_SEA,roughness:.2}));sw.position.set(m(-1.5),m(.75),0);g.add(sw);
 mk(box(.35,1.9,1.4),Ms({color:0xa9aba6,roughness:.8}),g,[-.55,.95,0]);
 mk(box(2.4,.35,1.4),Ms({color:0x8a6a48,roughness:1}),g,[.85,.175,0]);
 const h1=new THREE.Group();g.add(h1);h1.position.set(m(.6),m(.35),m(.1));mk(box(.6,.5,.6),Ms({color:0xe9c46a}),h1,[0,.25,0]);mk(new THREE.ConeGeometry(m(.52),m(.3),4),Ms({color:0x8a3b2e}),h1,[0,.65,0],[0,PI/4,0]);
 const h2=new THREE.Group();g.add(h2);h2.position.set(m(1.5),m(.35),m(-.2));mk(box(.55,.45,.55),Ms({color:0xe76f51}),h2,[0,.225,0]);mk(new THREE.ConeGeometry(m(.48),m(.28),4),Ms({color:0x8a3b2e}),h2,[0,.59,0],[0,PI/4,0]);
 AS.pipe(g,[[.1,.35,.45],[.1,2.25,.45],[-1.2,2.25,.45],[-1.2,1.65,.45]],.09,Ms({color:0x2f6db5,roughness:.4}),true);
 g.rotation.y=.25}
function coverPose(){cam.position.copy(Cm(-.2,3.9,17.5));cam.fov=34;cam.near=m(.05);cam.far=m(40);cam.updateProjectionMatrix();cam.lookAt(Cm(-.15,1.0,0))}

/* ================= SET aktif ================= */
const SETS={kota,dio,wad,rp,pool};
const GR={kota:()=>m(.05),dio:()=>m(-1.55),wad:(x,z)=>{const X=x/U,Z=z/U;if(X<0&&Math.abs(Z)<60)return m(-3);if(X>=0&&X<20&&Math.abs(Z)<4.3)return m(-3.15);return 0},rp:()=>0,pool:()=>m(-2.0)};
function useSet(name,withA){const s=SETS[name];if(withA&&A.root.parent!==s)s.add(A.root);if(!withA&&A.root.parent)A.root.parent.remove(A.root);return s}
const headW=()=>{A.root.updateMatrixWorld(true);return A.head.localToWorld(V(0,m(.32),0))};
const faceCU=()=>{const h=headW(),ry=A.root.rotation.y,f=V(Math.sin(ry),0,Math.cos(ry)),r=V(Math.cos(ry),0,-Math.sin(ry));return[h.clone().addScaledVector(f,m(3.6)).addScaledVector(r,m(.3)).add(V(0,-m(.25),0)),V(h.x,h.y-m(.38),h.z),39]};
const gwL=(g,x,y,z)=>{g.updateMatrixWorld(true);return g.localToWorld(Cm(x,y,z))};
const SHL=[];const S=(i,f,o)=>SHL.push(Object.assign({i,f},o));
// K1 hook (pembuka = penutup)
S(0,0,{set:'kota',a:1,cam:(u)=>{aK();A.gaze=Cm(20,2.2,4);A.act('point',u+1,'happy');return camA()}});
S(0,.55,{set:'kota',cam:(u,T)=>{const p=e3(cl(u/T,0,1));return[Cm(lerp(.6,-5,p),lerp(4.4,14,p),lerp(-4.8,-3,p)),Cm(lerp(4,10,p),lerp(.2,1.0,p),lerp(4.6,5,p)),44]},fx:(u)=>{FX.label('Laut',Cm(18,2.0,7),u-.3,-150,-110);FX.label('Jalan',Cm(.5,.05,4),u-.6,150,-110)}});
// K2 di bawah permukaan laut (penampang)
S(1,0,{set:'dio',cam:(u)=>[Cm(-.2+u*.03,1.2,15),Cm(-.2,.4,0),40],fx:(u)=>{FX.label('Permukaan laut',Cm(-2.45,1.62,0),u-.4,150,-110);FX.label('Tanah Pluit',gwL(LAND,2.4,.04,0),u-1.2,-150,-110)}});
// K3 tanah turun karena air tanah disedot
S(2,0,{set:'dio',sink:1,well:1,cam:(u)=>[Cm(2.4,1.0,6.6),Cm(1.4,-.5,.5),40],fx:(u)=>{FX.label('Air tanah',gwL(LAND,WELLX-.4,-1.25,1.51),u-.4,-150,-110)}});
// K4 air tak bisa mengalir sendiri; laut lebih tinggi
S(3,0,{set:'dio',rain:1,pool_:1,cam:(u)=>[Cm(-.4,1.6,14.5),Cm(-.3,.4,0),40],fx:(u)=>{FX.label('Laut lebih tinggi',Cm(-2.45,1.62,0),u-.4,150,-110)}});
// K5 polder = dikelilingi tanggul
S(4,0,{set:'dio',dike:1,cam:(u)=>[Cm(-4.4,3.2,9.6),Cm(-1.2,.5,0),40],fx:(u)=>{FX.label('Tanggul',Cm(-1.475,2.45,0),u-.4,150,-110)}});
// K6 hujan → saluran
S(5,0,{set:'kota',rain:1,sal:1,cam:(u)=>[Cm(3.6,2.6,-7+u*.3),Cm(6.1,-.4,4),44],fx:(u)=>{FX.label('Saluran',Cm(6.1,-.6,6),u-.4,150,-110)}});
// K7 Waduk Pluit
S(6,0,{set:'wad',cam:(u)=>[Cm(-90+u*.8,16,-26),Cm(0,0,2),42],fx:(u)=>{FX.label('Waduk Pluit',Cm(-35,-1,-6),u-.4,150,-110);FX.label('Rumah pompa',Cm(27,9.5,0),u-1.2,-150,-110)}});
// K8 saringan sampah
S(7,0,{set:'wad',rake:1,cam:(u)=>[Cm(2.0,3.2,-9.5),Cm(8.4,.2,0),44],fx:(u)=>{FX.label('Saringan sampah',Cm(7.6,.3,-3.2),u-.4,150,-110)}});
// K9 pompa mengangkat air melewati tanggul ke Teluk Jakarta
S(8,0,{set:'rp',run:1,cam:(u)=>[Cm(2.4,3.6,6.4),Cm(0,2.4,0),42],fx:(u)=>{FX.label('Pompa',Cm(0,.9,.82),u-.4,-150,-110);FX.label('Motor listrik',Cm(0,4.6,.92),u-.8,150,-110)}});
S(8,.5,{set:'wad',out:1,cam:(u)=>[Cm(50-u*.4,9,-22),Cm(38,3.0,0),42],fx:(u)=>{FX.label('Teluk Jakarta',Cm(46,2,-8),u-.4,150,-110)}});
// K10 tiga pompa, 39.000 liter/detik
S(9,0,{set:'rp',run:1,cam:(u)=>[Cm(11-u*.15,5.5,6.0),Cm(-3,2.2,0),46]});
// K11 kolam renang olimpiade terkuras ±1 menit
S(10,0,{set:'pool',drain:1,cam:(u)=>[Cm(36,24,40),Cm(-4,-1,-2),44]});
// K12 pompa berhenti → air tak punya jalan keluar
S(11,0,{set:'dio',stop:1,rain:1,cam:(u)=>[Cm(0,1.6,15),Cm(-.2,.4,0),40],fx:(u)=>{FX.label('Pompa berhenti',gwL(PH,0,1.55,0),u-.4,150,-110)}});
// K13 SELAMAT
S(12,0,{set:'kota',a:1,cam:(u)=>{aK();A.gaze=null;A.act('celebrate',u,'happy');return faceCU()},fx:(u)=>{FX.confetti(u);FX.boom('SELAMAT!',{x:540,y:560},nsh(u-.2),'#2f6bff',2.76,140)}});
S(12,.5,{set:'kota',a:1,cam:(u)=>{aK();A.gaze=null;A.act('celebrate',u+1.4,'happy');return[Cm(1.4,3.6,-6.0),Cm(4.6,1.2,2.4),44]},fx:(u)=>{FX.confetti(u+1.4)}});
// K14 CTA (komposisi = pembuka)
S(13,0,{set:'kota',a:1,loop:1,cam:(u)=>{aK();A.gaze=Cm(20,2.2,4);A.act('point',u+1,'happy');return camA()}});

/* ================= render(t) ================= */
SHL.forEach(s=>{s.t0=s.f?ST[s.i]+s.f*DUR[s.i]:(s.i===0?0:ST[s.i])});SHL.forEach((s,k)=>{s.t1=k<SHL.length-1?SHL[k+1].t0:TOTAL});
const lineAt=t=>{for(let i=N-1;i>=0;i--)if(t>=ST[i]-.03)return i;return 0};
const nsh=v=>v<0?v:v+.36;
const HIDE=V(0,-500,0);
function render(t){t=cl(t,0,TOTAL-1e-3);
 let k=SHL.findIndex(s=>t>=s.t0&&t<s.t1);if(k<0)k=SHL.length-1;const sh_=SHL[k],T=sh_.t1-sh_.t0;let u=t-sh_.t0;if(sh_.loop)u=.4-(T-u);
 const sc=useSet(sh_.set,!!sh_.a);A.gaze=null;
 // laut & air bergerak pelan
 SEA_K.tex.offset.set(t*.004,t*.002);SEA_W.tex.offset.set(t*.004,t*.002);
 // kota: hujan + air saluran naik
 RAIN_K.l.visible=!!sh_.rain&&sh_.set==='kota';if(RAIN_K.l.visible)RAIN_K.set(t,Cm(5,0,0),m(16),m(9),m(20),m(.55),m(9));
 SAL.position.y=m(sh_.sal?lerp(-.85,-.4,e3(cl(u/(T*.8),0,1))):-.85);
 // diorama
 const sinkK=sh_.sink?e3(cl((u-.6)/(T-1.2),0,1)):(sh_.set==='dio'&&k>3?1:0);LAND.position.y=m(-.45*Math.round(sinkK*100)/100);
 WELL_S.set(sh_.well?cl((u-.2)/.6,0,1):0);
 RAIN_D.l.visible=!!sh_.rain&&sh_.set==='dio';if(RAIN_D.l.visible)RAIN_D.set(t,Cm(.7,-.45*sinkK+.05,0),m(4.2),m(3.0),m(2.6),m(.22),m(3));
 const fl=sh_.pool_?lerp(.02,.18,e3(cl((u-.5)/(T-1),0,1))):sh_.stop?lerp(.02,.42,e3(cl((u-.4)/(T-.6),0,1))):.02;FLD.setLevel(Math.round(fl*200)/200);FLD.mesh.visible=!!(sh_.pool_||sh_.stop);
 SAL_D.set(sh_.set==='dio'&&(sh_.rain||k>=5)?1:0);
 WAD_D.setLevel(Math.round((sh_.stop?lerp(.35,.95,e3(cl(u/(T*.7),0,1))):.35)*200)/200);
 OUT_D.set(sh_.set==='dio'&&!sh_.stop&&k>=5?1:0,t);
 TGD.material.emissiveIntensity=sh_.dike?Math.round((.12+.08*Math.sin(u*5))*100)/100:0;
 // waduk: garu saringan + sampah
 const rk=sh_.rake?cl((u-.3)/(T-.6),0,1):0;
 const rakeS=lerp(.3,4.6,Math.round(rk*400)/400);const rb=gwL(RACK,-.35,rakeS,0);RAKE.position.copy(rb);RAKE.rotation.z=-.33;
 TRASH.forEach((o,i)=>{const zz=-3+i*1.2;const base=Cm(7.2-(i%2)*.35,-.94,zz);o.rotation.set(0,i*.7,0);o.visible=true;
  if(!sh_.rake||rb.y<m(-.9)){o.position.copy(base);return}
  if(rk<.9){const p=gwL(RACK,-.6,rakeS+.18,0);p.z=m(zz);o.position.copy(p);return}
  const q=cl((rk-.9)/.1,0,1),a=gwL(RACK,-.6,lerp(.3,4.6,.9)+.18,0);a.z=m(zz);const hi=Cm(9.0,2.0,zz),b=Cm(9.0,1.08,zz);if(q<.4){const f=q/.4;o.position.set(lerp(a.x,hi.x,f),lerp(a.y,hi.y,eo(f)),a.z)}else o.position.copy(hi.lerp(b,cl((q-.4)/.2,0,1)));o.rotation.set(0,lerp(i*.7,PI/2,cl(q/.35,0,1)),0);o.visible=q<.99});
 // keluaran pipa ke laut
 OUTS.forEach(o=>o.set(sh_.out?1:0,t));FOAM.forEach((s,i)=>{s.visible=!!sh_.out;s.material.opacity=.45+.1*Math.sin(t*6+i)});
 // pompa berputar (diperlambat 0,15× agar tidak strobo)
 PUMPS.forEach((p,i)=>{p.cp.rotation.y=sh_.run?(t*1.1+i)*.9:0});
 // kolam terkuras ±64 detik → ditampilkan dipercepat
 const pk=sh_.drain?cl((u-.3)/(T-.6),0,1):0;POOLW.setLevel(Math.round(lerp(1,.03,pk)*200)/200);drawTimer(sh_.drain?64*pk:0);
 let [pos,tg,fov]=sh_.cam(u,T);cam.position.copy(pos);cam.fov=fov||40;cam.near=m(.02);cam.far=m(900);cam.updateProjectionMatrix();cam.lookAt(tg);autoNear(cam,tg,U);
 sh_.cam(u,T);
 LQ.update(t);
 if(window.__cover){coverPose();R.setClearColor(0,0);R.render(cov,cam);FX.begin();FX.end();return}
 R.render(sc,cam);
 FX.begin();
 checkCast(THREE,C,sc,GR[sh_.set],{U,t,shot:k});
 COL.check(sc,cam,{t,shot:k,ground:GR[sh_.set]});
 if(A.root.parent===sc){const tp=[];for(const x_ of[-8,8])for(const y_ of[2,21])for(const z_ of[-5,5])tp.push(A.torso.localToWorld(V(x_,y_,z_)));FX.avoidPts(tp,6);
 const hc=A.H.head.localToWorld(V(0,0,0)),Rw=A.H.head.localToWorld(V(A.H.R,0,0)).distanceTo(hc),cr=V(1,0,0).applyQuaternion(cam.quaternion),cu=V(0,1,0).applyQuaternion(cam.quaternion);
 FX.avoidPts([hc.clone().addScaledVector(cr,-1.2*Rw),hc.clone().addScaledVector(cr,1.2*Rw),hc.clone().addScaledVector(cu,1.45*Rw),hc.clone().addScaledVector(cu,-1.3*Rw)],18,true);const ep=[];for(const x_ of[-7,-1.5])for(const y_ of[13,19])ep.push(A.torso.localToWorld(V(x_,y_,5)));FX.avoidPts(ep,8,true)}
 const li=lineAt(t),lu=t-ST[li];
 FX.stage(D.problems[li],li===0?D.hook:D.chips[li],li===0?'*':D.stageKeys[li],lu,DUR[li]+.3);
 let kY;if(A.root.parent===sc){const hc=A.H.head.localToWorld(V(0,0,0)),Rw=A.H.head.localToWorld(V(A.H.R,0,0)).distanceTo(hc),cu=V(0,1,0).applyQuaternion(cam.quaternion);
  const top=FX.project(hc.clone().addScaledVector(cu,1.6*Rw)).y,bot=FX.project(hc.clone().addScaledVector(cu,-1.4*Rw)).y;if(top>680||(bot>1150&&top<1550))kY=560}
 FX.karaoke(L[li],D.keys[li],cl(lu/DUR[li],0,1),kY);
 if(sh_.fx)sh_.fx(u,T);
 FX.flash(u,k>0?.18:0);FX.end()}
window.__dbg={A,C,U};window.__COL=COL;window.__C=C;window.__SH=SHL.map(s=>[s.t0,s.t1,s.i,s.set]);window.__render=render;window.__TOTAL=TOTAL;render(0);window.__ready=1;
</script></body></html>
