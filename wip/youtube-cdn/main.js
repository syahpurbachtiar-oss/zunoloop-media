
/* ================= SET 1: RUANG KELUARGA ================= */
const home=new THREE.Scene();home.background=new THREE.Color(0x2a3550);home.add(new THREE.HemisphereLight(0xfff2e0,0x6a5a4a,1.25));{const l=new THREE.DirectionalLight(0xffe8cc,1.3);l.position.set(m(2),m(4),m(4));l.castShadow=true;home.add(l)}
mk(box(9,3,8),Ms({color:0xe8dcc8,roughness:.9,side:THREE.BackSide}),home,[0,1.5,0]).castShadow=false;
mk(new THREE.PlaneGeometry(m(8.8),m(7.8)).rotateX(-PI/2),Ms({...PO,color:0xffffff,roughness:.8,map:ctex(256,256,(c,w,h)=>{c.fillStyle='#b08a62';c.fillRect(0,0,w,h);c.strokeStyle='rgba(80,50,30,.25)';for(let i=0;i<8;i++){c.beginPath();c.moveTo(0,i*32);c.lineTo(w,i*32);c.stroke()}},[4,4])}),home,[0,.02,0]);
// jendela senja
mk(new THREE.PlaneGeometry(m(2.4),m(1.4)),new THREE.MeshBasicMaterial({map:sky('#3a4a7a','#e89a6a'),toneMapped:false}),home,[2.2,1.7,-3.98]);mk(box(2.6,.08,.1),Ms({color:0xf4f4f0}),home,[2.2,.97,-3.95]);mk(box(2.6,.08,.1),Ms({color:0xf4f4f0}),home,[2.2,2.43,-3.95]);mk(box(.08,1.5,.1),Ms({color:0xf4f4f0}),home,[2.2,1.7,-3.95]);
// lemari TV + TV
const CAB=mk(box(2.4,.5,.5),Ms({color:0x6a4a32,roughness:.6}),home,[-1.6,.25,-3.7]);COL.solid(CAB,null,'lemari-tv');
const tvCv=document.createElement('canvas');tvCv.width=640;tvCv.height=360;const tvTex=new THREE.CanvasTexture(tvCv);tvTex.colorSpace=THREE.SRGBColorSpace;let tvK='';
function drawTV(p,spin,txt){p=Math.round(p*100)/100;spin=Math.round(spin*8)/8;const k=Math.round(p*100)+'|'+(spin?Math.round(spin*8):0)+'|'+txt;if(k===tvK)return;tvK=k;const x=tvCv.getContext('2d');const g=x.createLinearGradient(0,0,640,360);g.addColorStop(0,'#2f6bd6');g.addColorStop(1,'#7a3ad6');x.fillStyle=g;x.fillRect(0,0,640,360);
 x.fillStyle='rgba(255,255,255,.18)';for(let i=0;i<6;i++){x.beginPath();x.arc(80+i*100,180+40*Math.sin(i+p*6),40,0,2*PI);x.fill()}
 x.fillStyle='rgba(0,0,0,.5)';x.fillRect(0,320,640,40);x.fillStyle='#ff3a3a';x.fillRect(20,336,600*p,8);x.fillStyle='#ffffff';x.beginPath();x.arc(20+600*p,340,9,0,2*PI);x.fill();
 if(spin){x.strokeStyle='#ffffff';x.lineWidth=8;x.beginPath();x.arc(320,170,36,spin*2*PI,spin*2*PI+4.5);x.stroke()}
 if(txt){x.fillStyle='rgba(0,0,0,.55)';x.fillRect(150,130,340,80);x.fillStyle='#ffd23a';x.font='bold 40px Inter,Arial';x.textAlign='center';x.fillText(txt,320,184)}
 tvTex.needsUpdate=true}drawTV(.1,0,'');
const TV=new THREE.Group();home.add(TV);TV.position.set(m(-1.6),m(1.35),m(-3.85));mk(box(1.9,1.1,.06,.02),Ms({color:0x15171a}),TV,[0,0,0]);mk(new THREE.PlaneGeometry(m(1.82),m(1.02)),new THREE.MeshBasicMaterial({map:tvTex,toneMapped:false}),TV,[0,0,.032]);
const REM=mk(box(.05,.025,.17,.01),Ms({color:0x2a2e33}),home,[-.9,.51,-3.6]);COL.item(REM,[0,0,m(-.07)],[0,0,m(.07)],m(.012),'remote');
// sofa + meja + lampu
const SOFA=new THREE.Group();home.add(SOFA);SOFA.position.set(m(-.4),0,m(1.9));SOFA.rotation.y=PI;mk(box(2.6,.45,.9,.08),Ms({color:0x4a6a8a,roughness:.9}),SOFA,[0,.3,0]);mk(box(2.6,.6,.2,.06),Ms({color:0x4a6a8a,roughness:.9}),SOFA,[0,.75,.36]);for(const sx of[-1,1])mk(box(.2,.55,.9,.06),Ms({color:0x3e5a76}),SOFA,[sx*1.3,.5,0]);
mk(box(1.1,.4,.6),Ms({color:0x8a6a4a}),home,[-.4,.2,.2]);mk(cyl(.03,.03,1.4,8),DSTEEL,home,[3.6,.7,-3.2]);mk(cyl(.25,.18,.3,16),Ms({color:0xfff2d0,emissive:0xffd890,emissiveIntensity:.8}),home,[3.6,1.5,-3.2]);
const aK=()=>{A.root.position.set(m(.3),m(.02),m(-2.6));A.root.rotation.y=.35};
const camA=()=>[Cm(1.9,1.55,1.6),Cm(-.4,1.3,-3.0),46];

/* ================= SET 2: RUANG SERVER PROVIDER (simpul GGC) ================= */
const srv=hall(20,14,3.6,0xdfe3e6,false);srv.background=new THREE.Color(0xcfd5da);
mk(box(19.6,.3,13.6),Ms({color:0xbfc4c8,roughness:.6,map:ctex(128,128,(c,w,h)=>{c.fillStyle='#c4c8cc';c.fillRect(0,0,w,h);c.strokeStyle='rgba(0,0,0,.18)';c.lineWidth=2;c.strokeRect(1,1,w-2,h-2)},[33,23])}),srv,[0,.15,0]);
const RACKS=[];const ledCols=[0x30d060,0x30a0ff,0xffb000];
function rack(x,z,ggc){const g=new THREE.Group();g.position.set(m(x),m(.3),m(z));srv.add(g);mk(box(.62,2.0,1.0),Ms({color:0x1c1f24,roughness:.5}),g,[0,1.0,0]);
 const leds=[];for(let s=0;s<14;s++){const y=.2+s*.12;mk(box(.56,.1,.04),Ms({color:ggc?0x2a2e36:0x31353c}),g,[0,y,.5]);const l=mk(box(.03,.02,.01),Ms({color:ledCols[s%3],emissive:ledCols[s%3],emissiveIntensity:.2}),g,[.2,y,.525]);leds.push(l);
  if(ggc){const b=mk(box(.3,.03,.01),Ms({color:0x30a0ff,emissive:0x30a0ff,emissiveIntensity:.0}),g,[-.08,y,.525]);leds.push(b)}}
 RACKS.push({g,leds,ggc});return g}
for(let r=0;r<2;r++)for(let i=0;i<7;i++)rack(-4.5+i*.7,-2+r*3.2,r===0&&i===3);
const GGC=RACKS.find(r=>r.ggc);COL.solid(GGC.g.children[0],null,'rak-ggc');
// kabel serat kuning di atas rak
for(let r=0;r<2;r++)mk(box(5,.06,.12),Ms({color:0xf2c230}),srv,[-2.4,2.5,-2+r*3.2]);mk(box(.12,.06,3.2),Ms({color:0xf2c230}),srv,[-2.4,2.5,-.4]);
const monCv=document.createElement('canvas');monCv.width=512;monCv.height=320;const monTex=new THREE.CanvasTexture(monCv);monTex.colorSpace=THREE.SRGBColorSpace;let monK='';
function drawMon(p){p=Math.round(p*50)/50;const k=p;if(k===monK)return;monK=k;const x=monCv.getContext('2d');x.fillStyle='#10161c';x.fillRect(0,0,512,320);x.fillStyle='#cfe3f2';x.font='bold 30px Inter,Arial';x.textAlign='center';x.fillText('LALU LINTAS CACHE',256,44);
 const a0=-PI/2,a1=a0+2*PI*.8*p;x.fillStyle='#ff3a3a';x.beginPath();x.moveTo(180,185);x.arc(180,185,110,a0,a1);x.fill();x.fillStyle='#5a6a7a';x.beginPath();x.moveTo(180,185);x.arc(180,185,110,a1,a0+2*PI*Math.max(p,.001));x.fill();
 x.textAlign='left';x.font='bold 30px Inter,Arial';x.fillStyle='#ff6a6a';x.fillText('Video',320,160);x.fillStyle='#9aa8b4';x.fillText('Lainnya',320,215);monTex.needsUpdate=true}drawMon(1);
const MON=new THREE.Group();srv.add(MON);MON.position.set(m(1.2),m(.3),m(-1.6));mk(box(1.2,.75,.6),Ms({color:0xcfd4d8}),MON,[0,.375,0]);mk(box(.9,.6,.05),Ms({color:0x15171a}),MON,[0,1.12,-.1],[-.1,0,0]);mk(new THREE.PlaneGeometry(m(.84),m(.52)),new THREE.MeshBasicMaterial({map:monTex,toneMapped:false}),MON,[0,1.12,-.07],[-.1,0,0]);

/* ================= SET 3: DIORAMA JARINGAN (meja maket) ================= */
const dio=new THREE.Scene();dio.background=new THREE.Color(0x1c2128);dio.add(new THREE.HemisphereLight(0xffffff,0x303840,1.35));{const l=new THREE.DirectionalLight(0xffffff,1.6);l.position.set(m(4),m(12),m(8));l.castShadow=true;dio.add(l)}
mk(box(22,.5,13),Ms({color:0x2a3038}),dio,[0,.25,0]);mk(new THREE.PlaneGeometry(m(21.6),m(12.6)).rotateX(-PI/2),Ms({...PO,color:0x7a9a6a,roughness:1}),dio,[0,.51,0]);
const HOUSE_P=[[-8,3.6],[-7,4.6],[-8.6,5.2],[-6.2,3.2],[-7.4,2.6],[-5.6,4.8]];const HP=[];
HOUSE_P.forEach(([x,z],i)=>{const g=new THREE.Group();g.position.set(m(x),m(.5),m(z));dio.add(g);mk(box(.6,.45,.6),Ms({color:['#e9c46a','#f4a261','#a8dadc','#e5989b','#f1faee','#90be6d'][i]}),g,[0,.225,0]);mk(new THREE.ConeGeometry(m(.5),m(.3),4),Ms({color:0x8a3b2e}),g,[0,.6,0],[0,PI/4,0]);HP.push(g)});
COL.solid(HP[0].children[0],null,'rumah-maket');
const ISP=new THREE.Group();dio.add(ISP);ISP.position.set(m(-1.5),m(.5),m(1.2));mk(box(1.6,1.4,1.2),Ms({color:0xe8ecef}),ISP,[0,.7,0]);for(let i=0;i<3;i++)mk(box(1.62,.05,1.22),Ms({color:0x8a96a0}),ISP,[0,.35+i*.4,0]);mk(cyl(.04,.08,1.4,6),DSTEEL,ISP,[.5,2.1,-.3]);
const GGCB=mk(box(.4,.6,.3),Ms({color:0x2f6bd6,emissive:0x2f6bd6,emissiveIntensity:.4}),ISP,[-.3,.45,.62]);
const DC=new THREE.Group();dio.add(DC);DC.position.set(m(8),m(.5),m(-4));mk(box(3.6,.9,2.4),Ms({color:0xd8dce0}),DC,[0,.45,0]);for(let i=0;i<4;i++)mk(cyl(.25,.3,.5,16),Ms({color:0xb8bec4}),DC,[-1.2+i*.8,1.15,-.6]);
// kabel: rumah→ISP (pendek), ISP→DC (panjang, lewat "pintu keluar")
const CAB_M=Ms({color:0xf2a51a,roughness:.5});
const SHORT=HOUSE_P.map(([x,z])=>new THREE.CatmullRomCurve3([Cm(x,.62,z),Cm((x-1.5)/2,.62,(z+1.2)/2+.3),Cm(-1.5,.62,1.8)]));SHORT.forEach(c=>mk(new THREE.TubeGeometry(c,24,m(.04),6),CAB_M,dio));
const LONG=new THREE.CatmullRomCurve3([Cm(-.6,.62,1.0),Cm(2.5,.62,.4),Cm(4.8,.62,-1.2),Cm(6.4,.62,-3.0),Cm(7.6,.62,-3.4)]);const LONGT=mk(new THREE.TubeGeometry(LONG,60,m(.12),8),Ms({color:0xff7a3a,roughness:.5}),dio);
const GATE=mk(box(.5,.8,.8),Ms({color:0x5a636d}),dio,[2.5,.9,.4]);
/*butiran: paket data padat (kubus kecil)*/const PK=dots(dio,60,new THREE.BoxGeometry(m(.12),m(.12),m(.12)),new THREE.MeshBasicMaterial({color:0xffffff,toneMapped:false}));


/* ================= SAMPUL ================= */
const cov=new THREE.Scene();cov.add(new THREE.HemisphereLight(0xffffff,0x8a94a0,1.6));{const l=new THREE.DirectionalLight(0xffffff,2.3);l.position.set(m(3),m(6),m(5));cov.add(l)}
{const g=new THREE.Group();cov.add(g);mk(box(.62,2.0,1.0),Ms({color:0x1c1f24,roughness:.5}),g,[0,1.0,0]);for(let s=0;s<14;s++){const y=.2+s*.12;mk(box(.56,.1,.04),Ms({color:0x2a2e36}),g,[0,y,.5]);mk(box(.3,.03,.01),Ms({color:0x30a0ff,emissive:0x30a0ff,emissiveIntensity:1}),g,[-.08,y,.525]);mk(box(.03,.02,.01),Ms({color:0x30d060,emissive:0x30d060,emissiveIntensity:1}),g,[.2,y,.525])}
 const h=new THREE.Group();cov.add(h);h.position.set(m(1.6),0,m(.6));mk(box(1.0,.8,1.0),Ms({color:0xe9c46a}),h,[0,.4,0]);mk(new THREE.ConeGeometry(m(.85),m(.5),4),Ms({color:0x8a3b2e}),h,[0,1.05,0],[0,PI/4,0]);
 mk(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([Cm(.3,1.4,.5),Cm(.9,1.6,.7),Cm(1.6,.9,.9)]),20,m(.04),6),Ms({color:0xf2a51a}),cov);g.rotation.y=-.35}
function coverPose(){cam.position.copy(Cm(1.6,2.2,7.6));cam.fov=34;cam.near=m(.05);cam.far=m(40);cam.updateProjectionMatrix();cam.lookAt(Cm(.7,1.0,.4))}

/* ================= SET aktif ================= */
const SETS={home,srv,dio};
const GR={home:()=>0,srv:()=>m(.3),dio:()=>m(.5)};
function useSet(name,withA){const s=SETS[name];if(withA&&A.root.parent!==s)s.add(A.root);if(!withA&&A.root.parent)A.root.parent.remove(A.root);return s}
const headW=()=>{A.root.updateMatrixWorld(true);return A.head.localToWorld(V(0,m(.32),0))};
const faceCU=()=>{const h=headW(),ry=A.root.rotation.y,f=V(Math.sin(ry),0,Math.cos(ry)),r=V(Math.cos(ry),0,-Math.sin(ry));return[h.clone().addScaledVector(f,m(3.0)).addScaledVector(r,m(.3)).add(V(0,-m(.2),0)),V(h.x,h.y-m(.3),h.z),39]};
const gwL=(g,x,y,z)=>{g.updateMatrixWorld(true);return g.localToWorld(Cm(x,y,z))};
const SHL=[];const S=(i,f,o)=>SHL.push(Object.assign({i,f},o));
const DCAM=(x,y,z,tx,tz)=>[Cm(x,y,z),Cm(tx,.6,tz),46];
// K1 hook (pembuka = penutup)
S(0,0,{set:'home',a:1,tv:'play',cam:(u)=>{aK();A.gaze=gwL(TV,0,0,0);A.act('point',u+1,'happy');return camA()}});
S(0,.5,{set:'home',tv:'play',cam:(u)=>[Cm(-1.1,1.4,-1.6),Cm(-1.6,1.35,-3.85),40]});
// K2 Google Global Cache di gedung provider
S(1,0,{set:'srv',ggc:1,cam:(u)=>[Cm(-1.55-u*.025,1.6,1.6),Cm(-2.4,1.2,-2),44],fx:(u)=>{FX.label('Server cache',gwL(GGC.g,0,2.05,0),u-.4,150,-110)}});
// K3 provider sediakan rak, listrik, sambungan
S(2,0,{set:'srv',cam:(u)=>[Cm(3.8,2.3,5.0),Cm(-2.4,1.0,-.4),46],fx:(u)=>{FX.label('Rak provider',Cm(-4.5,2.4,-2),u-.5,-150,-110)}});
// K4 diarahkan ke server paling pas
S(3,0,{set:'dio',pk:'req',cam:(u)=>DCAM(-4.5,11,13.5,-4.5,2.6),fx:(u)=>{FX.label('Gedung provider',gwL(ISP,0,1.6,0),u-.5,150,-110)}});
// K5 sudah ada → langsung
S(4,0,{set:'dio',pk:'hit',cam:(u)=>DCAM(-4.5,11,13.5,-4.5,2.6)});
// K6 jalan pendek, tak antre di jalur keluar
S(5,0,{set:'dio',pk:'hit',cmp:1,cam:(u)=>DCAM(-2.5,9,10,1.2,0),fx:(u)=>{FX.label('Jalur keluar',Cm(2.5,1.3,.4),u-.6,150,-110)}});
// K7 belum ada → ambil dari pusat data
S(6,0,{set:'dio',pk:'miss',cam:(u)=>DCAM(-7,13,10,3,-1.5),fx:(u)=>{FX.label('Pusat data Google',gwL(DC,0,1.4,0),u-.5,-150,-110)}});
// K8 simpan sementara
S(7,0,{set:'srv',store:1,cam:(u)=>[Cm(-1.75,1.3,.55),Cm(-2.4,1.1,-2),40]});
// K9 ikut yang ramai di sekitarmu
S(8,0,{set:'dio',pk:'pop',cam:(u)=>DCAM(-4.5,11,13.5,-4.5,2.6)});
// K10 jarang ditonton → dari pusat
S(9,0,{set:'dio',pk:'rare',cam:(u)=>DCAM(-7,13,10,3,-1.5)});
// K11 mayoritas video
S(10,0,{set:'srv',mon:1,cam:(u)=>[Cm(1.2,1.6,.1),Cm(1.2,1.38,-1.75),40]});
// K12 jalur keluar lebih lega
S(11,0,{set:'dio',pk:'hit',calm:1,cam:(u)=>DCAM(-2.5,9,10,1.2,0)});
// K13 SELAMAT
S(12,0,{set:'home',a:1,tv:'play',cam:(u)=>{aK();A.gaze=null;A.act('celebrate',u,'happy');const c=faceCU(),h=headW();c[0].sub(h).multiplyScalar(1.25).add(h);c[1].y-=m(.08);return c},fx:(u)=>{FX.confetti(u);FX.boom('SELAMAT!',{x:540,y:620},nsh(u-.2),'#2f6bff',2.76,140)}});
S(12,.5,{set:'home',a:1,tv:'play',cam:(u)=>{aK();A.gaze=null;A.act('celebrate',u+1.4,'happy');return [Cm(1.9,1.3,1.6),Cm(-.4,.85,-3.0),46]},fx:(u)=>{FX.confetti(u+1.4)}});
// K14 CTA
S(13,0,{set:'home',a:1,tv:'play',cam:(u)=>{aK();A.gaze=gwL(TV,0,0,0);A.act('point',u+1,u<.8?'happy':'normal');return camA()}});

/* ================= render(t) ================= */
SHL.forEach(s=>{s.t0=s.f?ST[s.i]+s.f*DUR[s.i]:(s.i===0?0:ST[s.i])});SHL.forEach((s,k)=>{s.t1=k<SHL.length-1?SHL[k+1].t0:TOTAL});
const lineAt=t=>{for(let i=N-1;i>=0;i--)if(t>=ST[i]-.03)return i;return 0};
const nsh=v=>v<0?v:v+.36;
function render(t){t=cl(t,0,TOTAL-1e-3);
 let k=SHL.findIndex(s=>t>=s.t0&&t<s.t1);if(k<0)k=SHL.length-1;const sh_=SHL[k],u=t-sh_.t0,T=sh_.t1-sh_.t0;
 const sc=useSet(sh_.set,!!sh_.a);A.gaze=null;
 drawTV(((t*.03)%1)*.8+.1,0,'');
 // LED rak berkedip; GGC: bar penyimpanan terisi saat 'store'
 RACKS.forEach((r,ri)=>r.leds.forEach((l,li)=>{if(r.ggc&&li%2===1){const fill=sh_.store?cl(u/(T*.8),0,1):(sh_.ggc?.7:.5);l.material.emissiveIntensity=(li/2)/14<fill?1.4:.05}else l.material.emissiveIntensity=(Math.sin(t*7+ri*3+li*1.7)>.2)?1.3:.15}));
 if(sh_.mon)drawMon(cl(u/(T*.6),0,1));else drawMon(1);
 // paket data di diorama
 const P=[];const hp=i=>SHORT[i%SHORT.length];
 if(sh_.pk==='req'){for(let i=0;i<6;i++){const ph=cl(u*.9-i*.08,0,1);P.push({p:hp(0).getPointAt(ph),c:0xffd23a})}}
 if(sh_.pk==='hit'){for(let i=0;i<(sh_.calm?24:14);i++){const ph=((u*.8+i*.137)%1);P.push({p:hp(i).getPointAt(1-ph),c:0x5ad0ff})}}
 if(sh_.pk==='miss'){for(let i=0;i<10;i++){const ph=((u*.45+i*.1)%1);P.push({p:LONG.getPointAt(1-ph),c:0xff9a5a})}}
 if(sh_.pk==='pop'){for(let i=0;i<30;i++){const ph=((u*.9+i*.071)%1);P.push({p:hp(i).getPointAt(1-ph),c:0x5ad0ff})}}
 if(sh_.pk==='rare'){for(let i=0;i<8;i++){const ph=((u*.35+i*.125)%1);P.push({p:ph<.7?LONG.getPointAt(1-ph/.7):hp(2).getPointAt(1-(ph-.7)/.3),c:0xff9a5a})}}
 if(sh_.cmp){for(let i=0;i<10;i++){const ph=((u*.25+i*.1)%1);P.push({p:LONG.getPointAt(ph),c:0x8a96a0})}}
 if(sh_.calm){for(let i=0;i<3;i++){const ph=((u*.3+i*.33)%1);P.push({p:LONG.getPointAt(ph),c:0xff9a5a})}}
 PK.im.visible=sh_.set==='dio';const tmp=new THREE.Color();PK.set(q=>{const it=P[q];if(!it){const v=V(0,-100*U,0);v.s=1e-4;return v}const v=it.p.clone();v.c=tmp.setHex(it.c).clone();return v});
 GGCB.material.emissiveIntensity=sh_.pk==='pop'?.4+.8*cl(u/1.5,0,1):sh_.pk==='hit'?.9:.4;LONGT.material.emissiveIntensity=0;
 let [pos,tg,fov]=sh_.cam(u,T);cam.position.copy(pos);cam.fov=fov||40;cam.near=m(.02);cam.far=m(400);cam.updateProjectionMatrix();cam.lookAt(tg);autoNear(cam,tg,U);
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
