
/* ================= warna minyak per tahap ================= */
const C_CRUDE=0x1a120c,C_CPO=0xc8401a,C_BLEACH=0xe09a2a,C_RBD=0xf2cc5a,C_OLEIN=0xf6d870,C_STEARIN=0xf4f0e2;

/* ================= SET 1: DAPUR ================= */
const kit=new THREE.Scene();kit.background=new THREE.Color(0x2a3550);kit.add(new THREE.HemisphereLight(0xfff2e0,0x6a5a4a,1.3));{const l=new THREE.DirectionalLight(0xffe8cc,1.3);l.position.set(m(2),m(4),m(4));l.castShadow=true;kit.add(l)}
mk(box(8,3,7),Ms({color:0xe9e2d2,roughness:.9,side:THREE.BackSide}),kit,[0,1.5,0]).castShadow=false;
mk(new THREE.PlaneGeometry(m(7.8),m(6.8)).rotateX(-PI/2),Ms({...PO,color:0xffffff,roughness:.8,map:ctex(256,256,(c,w,h)=>{c.fillStyle='#d8d2c4';c.fillRect(0,0,w,h);c.strokeStyle='rgba(90,80,60,.25)';c.lineWidth=2;for(let i=0;i<=256;i+=64){c.beginPath();c.moveTo(i,0);c.lineTo(i,h);c.stroke();c.beginPath();c.moveTo(0,i);c.lineTo(w,i);c.stroke()}},[4,4])}),kit,[0,.02,0]);
for(let i=0;i<8;i++)mk(box(.38,.18,.01),Ms({color:i%2?0xf4f4f0:0xdfe9ef}),kit,[-1.6+i*.4,1.45,-3.47]);
const COUNTER=mk(box(3.4,.9,.62),Ms({color:0x6a4a32,roughness:.6}),kit,[-.4,.45,-3.15]);mk(box(3.44,.05,.66),Ms({color:0xe8e4dc,roughness:.4}),kit,[-.4,.925,-3.15]);COL.solid(COUNTER,null,'meja-dapur');
AS.stove(kit,{x:-1.3,y:.95,z:-3.15});
const PAN=new THREE.Group();kit.add(PAN);PAN.position.set(m(-1.3),m(1.11),m(-3.15));mk(cyl(.17,.12,.07,28,true),Ms({color:0x2a2c30,roughness:.4,metalness:.5,side:THREE.DoubleSide}),PAN,[0,.035,0]);mk(cyl(.12,.12,.01,28),Ms({color:0x2a2c30}),PAN,[0,.005,0]);mk(cyl(.155,.155,.004,28),Ms({color:C_OLEIN,roughness:.05,transparent:true,opacity:.85}),PAN,[0,.03,0]);mk(box(.25,.02,.03),Ms({color:0x1a1a1a}),PAN,[.29,.06,0]);
// botol minyak goreng 1 L (PET bening, minyak keemasan)
function bottle1L(parent,x,y,z){const g=new THREE.Group();g.position.set(m(x),m(y),m(z));parent.add(g);
 const pet=Ms({color:0xf2f0e8,roughness:.05,transparent:true,opacity:.35,depthWrite:false});
 mk(cyl(.045,.045,.2,24),pet,g,[0,.1,0]);mk(new THREE.SphereGeometry(m(.045),24,12,0,2*PI,0,PI/2),pet,g,[0,.2,0],null,[1,1.2,1]);mk(cyl(.016,.016,.04,16),pet,g,[0,.27,0]);mk(cyl(.019,.019,.022,16),Ms({color:0xd8342a}),g,[0,.295,0]);
 const oil=mk(cyl(.042,.042,.19,24),Ms({color:C_OLEIN,roughness:.08,transparent:true,opacity:.9,emissive:0x6a4a00,emissiveIntensity:.15}),g,[0,.1,0]);g.userData.oil=oil;return g}
const BOT=bottle1L(kit,.3,.95,-3.1);
// drum minyak bumi (hitam kental)
const DRUM=new THREE.Group();kit.add(DRUM);DRUM.position.set(m(1.25),0,m(-2.85));mk(cyl(.29,.29,.88,32,true),Ms({color:0x22262b,roughness:.4,metalness:.6,side:THREE.DoubleSide}),DRUM,[0,.44,0]);for(const y of[.2,.68])mk(new THREE.TorusGeometry(m(.295),m(.015),6,32).rotateX(PI/2),DSTEEL,DRUM,[0,y,0]);mk(cyl(.29,.29,.02,32),DSTEEL,DRUM,[0,.01,0]);
mk(cyl(.275,.275,.02,32),Ms({color:C_CRUDE,roughness:.15,metalness:.2}),DRUM,[0,.82,0]);COL.solid(DRUM.children[0],{t:'shell',r0:m(.29),r1:m(.29),y0:m(-.44),y1:m(.44),w:m(.02)},'drum');
const aK=()=>{A.root.position.set(m(-.2),0,m(-1.8));A.root.rotation.y=.3};
const camA=()=>[Cm(.4,1.55,2.4),Cm(.4,1.0,-2.5),50];

/* ================= SET 2: MOLEKUL ================= */
const mol=new THREE.Scene();mol.background=new THREE.Color(0x101a2e);mol.add(new THREE.HemisphereLight(0xffffff,0x303848,1.4));{const l=new THREE.DirectionalLight(0xffffff,1.4);l.position.set(m(2),m(4),m(5));mol.add(l)}
const AT={C:Ms({color:0x2a2c30,roughness:.4}),H:Ms({color:0xf4f4f0,roughness:.4}),O:Ms({color:0xd8342a,roughness:.4})};const BOND=Ms({color:0x9aa2aa});
function atom(g,t,p){mk(new THREE.SphereGeometry(m(t==='H'?.07:.12),16,12),AT[t],g,p)}
function bond(g,a,b){const A_=Cm(...a),B_=Cm(...b),d=B_.clone().sub(A_),L=d.length();const o=mk(cyl(.025,.025,1,8),BOND,g);o.position.copy(A_).add(B_).multiplyScalar(.5);o.scale.set(1,L/U,1);o.quaternion.setFromUnitVectors(V(0,1,0),d.normalize())}
function chain(g,x0,y0,n,dir=1,step=.21){let prev=null;for(let i=0;i<n;i++){const p=[x0+dir*i*step,y0+(i%2?.1:-.1),0];atom(g,'C',p);for(const s of[-1,1]){const hp=[p[0],p[1]+(i%2?.18:-.18),s*.16];atom(g,'H',hp);bond(g,p,hp)}if(prev)bond(g,prev,p);prev=p}return prev}
const HC=new THREE.Group();mol.add(HC);HC.position.set(m(0),m(1.6),0);{const e=chain(HC,-.84,0,9,1);atom(HC,'H',[e[0]+.18,e[1],0]);bond(HC,e,[e[0]+.18,e[1],0]);atom(HC,'H',[-1.02,-.1,0]);bond(HC,[-.84,-.1,0],[-1.02,-.1,0])}
const TG=new THREE.Group();mol.add(TG);TG.position.set(m(0),m(-.2),0);
{for(let k=0;k<3;k++){const y=.75-k*.75;atom(TG,'C',[-.9,y,0]);if(k)bond(TG,[-.9,y+.75,0],[-.9,y,0]);atom(TG,'O',[-.68,y,0]);bond(TG,[-.9,y,0],[-.68,y,0]);atom(TG,'C',[-.46,y,0]);bond(TG,[-.68,y,0],[-.46,y,0]);atom(TG,'O',[-.46,y+.2,0]);bond(TG,[-.46,y,0],[-.46,y+.2,0]);const e=chain(TG,-.25,y,7,1,.2);bond(TG,[-.46,y,0],[-.25,y-.1,0])}}
COL.solid(HC.children[0],null,'molekul');
/*butiran: atom penanda kecil*/const MSP=dots(mol,1,new THREE.SphereGeometry(m(.01),4,4),Ms({color:0x101a2e}));MSP.set(()=>Cm(0,-50,0));

/* ================= SET 3: KEBUN SAWIT ================= */
const farm=outdoor('#8ec2ea','#e3eef4',120,900);AS.sun(farm,[-120,160,90],80,2.2);AS.ground(farm,2000,'grass');
function oilPalm(parent,x,z,h=7,seed=1){const g=new THREE.Group();g.position.set(m(x),0,m(z));g.rotation.y=seed;parent.add(g);
 mk(cyl(.32,.4,h,10),Ms({color:0x6a5a44,roughness:.95}),g,[0,h/2,0]);for(let k=0;k<10;k++){const a=k*1.7+seed,y=1+k*(h-1.5)/10;mk(box(.16,.5,.08),Ms({color:0x5a4a34}),g,[Math.cos(a)*.36,y,Math.sin(a)*.36],[.5*Math.sin(a),-a,.5*Math.cos(a)])}
 const top=new THREE.Group();top.position.set(0,m(h),0);g.add(top);for(let i=0;i<14;i++){const a=i*PI*2/14,f=new THREE.Group();f.rotation.set(0,a,0);top.add(f);mk(box(3.6,.04,.6),Ms({color:[0x2f6a2a,0x3a7a32,0x2a5e26][i%3],roughness:.85,side:THREE.DoubleSide}),f,[1.7,-.2+(i%2)*.3,0],[0,0,-.25-(i%3)*.12])}
 const BN=[];for(let i=0;i<3;i++){const a=i*2.1+.4;const b=new THREE.Group();b.position.set(m(Math.cos(a)*.5),m(-.5),m(Math.sin(a)*.5));top.add(b);bunchMesh(b,.6);BN.push(b)}g.userData.bunches=BN;return g}
const FRM=MET({color:0x8a2a12,roughness:.45,metalness:.1}),FRO=MET({color:0xd85a1a,roughness:.4,metalness:.1});
function bunchMesh(g,s=1){const core=mk(new THREE.SphereGeometry(m(.22*s),12,10),Ms({color:0x5a3a1a}),g,[0,0,0],null,[1,1.3,1]);
 for(let i=0;i<26;i++){const u_=hash(i+3),th=i*2.399,ph=Math.acos(1-2*(i+.5)/26);const r=.22*s;mk(new THREE.SphereGeometry(m(.06*s),8,6),i%3?FRM:FRO,g,[r*Math.sin(ph)*Math.cos(th),r*1.3*Math.cos(ph),r*Math.sin(ph)*Math.sin(th)],null,[1,1.25,1])}return core}
for(let i=0;i<7;i++)for(let j=0;j<4;j++){const x=-36+i*9+(j%2)*4.5,z=-8-j*8;oilPalm(farm,x,z,6+hash(i*4+j)*2.5,i*3+j)}
const PALM=oilPalm(farm,3,2,6.5,2);
// tandan di tanah + gerobak
const HARV=new THREE.Group();farm.add(HARV);HARV.position.set(m(-1.5),0,m(4));for(let i=0;i<5;i++){const b=new THREE.Group();b.position.set(m((i%3)*.7-.7),m(.3+Math.floor(i/3)*.4),m(Math.floor(i/3)*.3));HARV.add(b);bunchMesh(b,1.2)}
COL.solid(HARV.children[0].children[0],null,'tandan');

/* ================= SET 4: PABRIK SAWIT (penampang) ================= */
const mill=hall(30,18,9,0xdfe3e6,true);
const SH_M=MET({color:0xb8bec4,roughness:.35,metalness:.7});
// sterilizer horizontal, setengah dibuka
const STER=new THREE.Group();mill.add(STER);STER.position.set(m(-6),m(1.6),0);
mk(new THREE.CylinderGeometry(m(1.4),m(1.4),m(8),40,1,true,PI,PI).rotateZ(PI/2),Ms({color:0xb8bec4,roughness:.35,metalness:.7,side:THREE.DoubleSide}),STER,[0,0,0]);
mk(xcyl(1.45,1.45,.12,40),SH_M,STER,[-4.05,0,0]);for(const x of[-3,-1,1,3])mk(new THREE.TorusGeometry(m(1.42),m(.05),6,40,PI).rotateY(PI/2).rotateX(PI),DSTEEL,STER,[x,0,0]);
for(const x of[-3,3])mk(box(.3,1.6,2.4),DSTEEL,STER,[x,-1.55,0]);
mk(box(8,.06,.06),DSTEEL,STER,[0,-1.0,-.45]);mk(box(8,.06,.06),DSTEEL,STER,[0,-1.0,.45]);
COL.solid(STER.children[0],{t:'box',min:[m(-4),m(-1.45),m(-1.45)],max:[m(4),m(-1.2),m(-1.2)]},'rebusan');
COL.intake(STER,{min:[m(-4),m(-1.4),m(-1.4)],max:[m(4.6),m(1.4),m(1.4)]},'rebusan');
const CART=new THREE.Group();mill.add(CART);mk(box(2.2,.9,1.3),Ms({color:0x5a636d,roughness:.5,metalness:.5,transparent:true,opacity:.55,depthWrite:false}),CART,[0,.45,0]);for(const x of[-.8,.8])for(const z of[-.45,.45])mk(cyl(.12,.12,.08,14),DSTEEL,CART,[x,-.05,z],[PI/2,0,0]);
const CB=[];for(let i=0;i<6;i++){const b=new THREE.Group();b.position.set(m(-.6+(i%3)*.6),m(.35+Math.floor(i/3)*.38),m((i%2)*.2-.1));CART.add(b);bunchMesh(b,.9);CB.push(b)}
COL.item(CART.children[0],[m(-1),m(.45),0],[m(1),m(.45),0],m(.4),'lori');
const STEAM=puffs(mill,10,1.2,0xf4f4f4,.55);
// screw press: corong terbuka + laras dibuka + ulir
const PRESS=new THREE.Group();mill.add(PRESS);PRESS.position.set(m(5),m(1.4),0);
mk(new THREE.CylinderGeometry(m(.55),m(.55),m(3.2),32,1,true,PI,PI).rotateZ(PI/2),Ms({color:0xb8bec4,roughness:.35,metalness:.7,side:THREE.DoubleSide}),PRESS,[0,0,0]);
const SCREW=new THREE.Group();PRESS.add(SCREW);mk(xcyl(.12,.12,3.2,16),STEEL,SCREW);{const pts=[];for(let i=0;i<=160;i++){const s=i/160,a=s*PI*2*9;pts.push(Cm(-1.55+s*3.1,Math.cos(a)*.3,Math.sin(a)*.3))}mk(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),400,m(.03),8),Ms({color:0x8a929a,metalness:.7,roughness:.3}),SCREW)}
const HOP=new THREE.Group();PRESS.add(HOP);HOP.position.set(m(-1.1),m(.55),0);mk(new THREE.CylinderGeometry(m(.85),m(.35),m(1.1),4,1,true).rotateY(PI/4),Ms({color:0x9aa2aa,metalness:.6,roughness:.4,side:THREE.DoubleSide}),HOP,[0,.55,0]);
COL.solid(HOP.children[0],{t:'rshell',x0:m(.25),z0:m(.25),x1:m(.6),z1:m(.6),y0:m(-.55),y1:m(.55),w:m(.03)},'corong-press');
COL.intake(HOP,{min:[m(-.6),m(-.6),m(-.6)],max:[m(.6),m(1.2),m(.6)]},'corong-press');
mk(box(.6,1.4,.6),Ms({color:0x2f6b4a}),PRESS,[2.0,-.2,0]);for(const x of[-1.2,1.2])mk(box(.25,1.4,.9),DSTEEL,PRESS,[x,-.95,0]);
/*butiran: potongan buah sawit padat jatuh ke corong*/const FRUIT=dots(mill,30,new THREE.SphereGeometry(m(.06),8,6),FRM);
const PRESS_OIL=LQ.stream([Cm(5.2,.95,0),Cm(5.25,.6,0),Cm(5.3,.25,0)],m(.07),LQ.mat({color:C_CPO,opacity:.92,speed:2}));mill.add(PRESS_OIL.mesh);
const TROUGH=new THREE.Group();mill.add(TROUGH);TROUGH.position.set(m(5.3),m(.02),0);mk(box(1.2,.24,.7),DSTEEL,TROUGH,[0,.12,0]);const TRO=mk(box(1.1,.02,.6),Ms({color:C_CPO,roughness:.1}),TROUGH,[0,.2,0]);
COL.solid(TROUGH.children[0],null,'bak-cpo');
// rendemen: 5 tandan vs 1 jerigen CPO
const YIELD=new THREE.Group();mill.add(YIELD);YIELD.position.set(m(-1),0,m(4));for(let i=0;i<5;i++){const b=new THREE.Group();b.position.set(m(-1.4+i*.55),m(.3),0);YIELD.add(b);bunchMesh(b,1.1)}
const JAR=new THREE.Group();YIELD.add(JAR);JAR.position.set(m(1.9),0,0);mk(cyl(.22,.22,.5,24),Ms({color:0xf2f0e8,transparent:true,opacity:.35,depthWrite:false}),JAR,[0,.25,0]);mk(cyl(.2,.2,.45,24),Ms({color:C_CPO,roughness:.1,transparent:true,opacity:.92}),JAR,[0,.23,0]);
mk(box(4.6,.06,.9),Ms({color:0x8a929a}),YIELD,[0,.03,0]);

/* ================= SET 5: KILANG GRESIK (luar) ================= */
const ref=outdoor('#8ec2ea','#e3eef4',300,2400);AS.sun(ref,[-200,260,160],160,2.2);AS.ground(ref,3000,'grass');AS.sea(ref,0,-700,4000,1000,-.2);
mk(new THREE.PlaneGeometry(m(220),m(160)).rotateX(-PI/2),Ms({...PO,color:0xb9b9b2,roughness:.95}),ref,[0,.03,0]).castShadow=false;
for(let i=0;i<5;i++)AS.storageTank(ref,{x:-60+i*22,z:-40,r:8,h:14});for(let i=0;i<3;i++)AS.storageTank(ref,{x:-40+i*20,z:-70,r:7,h:12,color:0xe9ebe4});
const COLM=new THREE.Group();ref.add(COLM);COLM.position.set(m(40),0,m(-20));mk(cyl(2.2,2.2,30,24),SH_M,COLM,[0,15,0]);mk(cyl(2.6,2.6,.6,24),DSTEEL,COLM,[0,30.3,0]);for(let y=5;y<30;y+=5)mk(new THREE.TorusGeometry(m(2.25),m(.12),6,24).rotateX(PI/2),DSTEEL,COLM,[0,y,0]);
for(let k=0;k<4;k++)mk(box(80,.5,.5),Ms({color:0xc8ccd0,metalness:.4}),ref,[0,6+k*.9,-12]);for(let x=-38;x<=38;x+=8)mk(box(.4,9,.4),DSTEEL,ref,[x,4.5,-12]);
const TRK=AS.tankTruck(ref,{x:0,z:20,ry:PI/2,tank:0xeef1f3,stripe:0xd8a020});
COL.item(TRK.children[0],[0,0,m(-4)],[0,0,m(4)],m(1),'truk-cpo');
const REFHOUSE=mk(box(30,12,16),Ms({color:0xe4e7ea,roughness:.7}),ref,[-10,6,8]);COL.solid(REFHOUSE,null,'gedung-kilang');

/* ================= SET 6: JALUR PEMURNIAN (penampang) ================= */
const line=hall(44,16,10,0xdfe3e6,false);
const GLS_=Ms({color:0xe8f0f4,roughness:.05,transparent:true,opacity:.22,depthWrite:false,side:THREE.DoubleSide});
function tank(x,r,h,color,{z=0,y0=.3}={}){const g=new THREE.Group();line.add(g);g.position.set(m(x),m(y0),m(z));
 mk(cyl(r,r,h,40,true),GLS_,g,[0,h/2,0]);mk(cyl(r+.04,r+.04,.12,40),SH_M,g,[0,.06,0]);mk(new THREE.TorusGeometry(m(r+.02),m(.04),6,40).rotateX(PI/2),SH_M,g,[0,h,0]);
 for(let k=0;k<4;k++){const a=k*PI/2+PI/4;mk(cyl(.05,.05,y0+.05,8),DSTEEL,g,[Math.cos(a)*r*.8,-y0/2,Math.sin(a)*r*.8])}
 const liq=LQ.body(m(2*r*.96),m(h*.8),0,{color,shape:'cyl',opacity:.85});liq.mesh.position.set(0,m(.12),0);g.add(liq.mesh);g.userData.liq=liq;
 COL.solid(g.children[1],null,'dasar-tangki');return g}
const T_CPO=tank(-18,.9,2.2,C_CPO),T_DEG=tank(-13,.9,2.2,C_CPO),T_BLE=tank(-8,.9,2.2,C_CPO);
AS.pipe(line,[[-14.6,3.3,0],[-13.15,3.3,0],[-13.15,3.0,0]],.04);const ACID=LQ.stream([Cm(-13.15,2.98,0),Cm(-13.12,2.6,0),Cm(-13.1,2.12,0)],m(.02),LQ.mat({color:0xdff0ff,opacity:.8,speed:2.5}));line.add(ACID.mesh);
// filter daun (lempung tertahan)
const FILT=new THREE.Group();line.add(FILT);FILT.position.set(m(-3.5),m(.3),0);mk(new THREE.CylinderGeometry(m(.8),m(.8),m(2.4),32,1,true,PI,PI),Ms({color:0xb8bec4,metalness:.6,roughness:.4,side:THREE.DoubleSide}),FILT,[0,1.2,0]);
for(let k=0;k<7;k++){mk(box(.03,1.8,1.2),Ms({color:0xd8dce0}),FILT,[-.5+k*.16,1.25,-.2]);mk(box(.05,1.7,1.1),Ms({color:0xb8a888,roughness:1}),FILT,[-.5+k*.16+.035,1.25,-.2])}
mk(cyl(.84,.84,.1,32),SH_M,FILT,[0,.05,0]);COL.solid(FILT.children[FILT.children.length-1],null,'filter');
// deodorizer: kolom tinggi dibuka
const DEO=new THREE.Group();line.add(DEO);DEO.position.set(m(2),m(.3),0);mk(new THREE.CylinderGeometry(m(1.0),m(1.0),m(7),36,1,true,PI,PI),Ms({color:0xb8bec4,metalness:.6,roughness:.4,side:THREE.DoubleSide}),DEO,[0,3.5,0]);
const TRAYS=[];for(let k=0;k<5;k++){mk(cyl(.95,.95,.06,32,false),DSTEEL,DEO,[0,.9+k*1.3,0]);const l=mk(cyl(.93,.93,.22,32),Ms({color:C_RBD,roughness:.08,transparent:true,opacity:.85}),DEO,[0,1.04+k*1.3,0]);TRAYS.push(l)}
mk(cyl(1.04,1.04,.12,36),SH_M,DEO,[0,7.0,0]);mk(cyl(.2,.2,1.2,12),SH_M,DEO,[0,7.6,0]);COL.solid(DEO.children[1],null,'nampan-deo');
/*butiran: gelembung uap padat di nampan*/const BUB=dots(line,60,new THREE.SphereGeometry(m(.05),8,6),Ms({color:0xffffff,transparent:true,opacity:.75}));
const VAP=puffs(line,8,.9,0xf2ece0,.5);
const dCv=document.createElement('canvas');dCv.width=384;dCv.height=192;const dTex=new THREE.CanvasTexture(dCv);dTex.colorSpace=THREE.SRGBColorSpace;let dK='';
function drawD(tmp,vac){tmp=Math.round(tmp);const k=tmp+'|'+vac;if(k===dK)return;dK=k;const x=dCv.getContext('2d');x.fillStyle='#14181c';x.fillRect(0,0,384,192);x.textAlign='center';x.font='bold 84px Inter,Arial';x.fillStyle=tmp>=200?'#ff8a3a':tmp<30?'#6ac8ff':'#ffffff';x.fillText(tmp+'°C',192,100);x.font='bold 34px Inter,Arial';x.fillStyle='#9ad0ff';x.fillText(vac?'VAKUM':'',192,160);dTex.needsUpdate=true}drawD(250,1);
const DPAN=new THREE.Group();line.add(DPAN);DPAN.position.set(m(3.6),m(2.4),m(1.1));mk(box(.8,.42,.06),Ms({color:0x2a2e34}),DPAN,[0,0,0]);mk(new THREE.PlaneGeometry(m(.74),m(.37)),new THREE.MeshBasicMaterial({map:dTex,toneMapped:false}),DPAN,[0,0,.035]);mk(box(.05,2.4,.05),DSTEEL,DPAN,[0,-1.2,-.02]);
// kristalisator: tangki + koil pendingin biru + kristal
const T_CRY=tank(7,.95,2.4,C_RBD);{const pts=[];for(let i=0;i<=200;i++){const s=i/200,a=s*PI*2*6;pts.push(Cm(Math.cos(a)*.7,.4+s*1.6,Math.sin(a)*.7))}const coil=mk(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),400,m(.035),8),Ms({color:0x3a8ae0,metalness:.5,roughness:.3}),T_CRY)}
/*butiran: kristal stearin padat*/const CRY=dots(line,90,new THREE.OctahedronGeometry(m(.05)),Ms({color:0xffffff,roughness:.5}));
const cCv=document.createElement('canvas');cCv.width=384;cCv.height=192;const cTex=new THREE.CanvasTexture(cCv);cTex.colorSpace=THREE.SRGBColorSpace;
const CPAN=new THREE.Group();line.add(CPAN);CPAN.position.set(m(8.6),m(2.2),m(1.1));mk(box(.8,.42,.06),Ms({color:0x2a2e34}),CPAN,[0,0,0]);
// filter press: pelat + kue stearin + aliran olein
const FP=new THREE.Group();line.add(FP);FP.position.set(m(12),m(.3),0);mk(box(3.2,.2,.3),DSTEEL,FP,[0,1.9,-.55]);mk(box(3.2,.2,.3),DSTEEL,FP,[0,1.9,.55]);for(const x of[-1.7,1.7])mk(box(.3,2.2,1.4),DSTEEL,FP,[x,1.1,0]);
const CAKES=[];for(let k=0;k<9;k++){const x=-1.3+k*.32;mk(box(.06,1.1,1.1),Ms({color:0x9aa2aa}),FP,[x,1.2,0]);const c=mk(box(.2,1.0,1.0),Ms({color:C_STEARIN,roughness:.7}),FP,[x+.15,1.2,0]);CAKES.push(c)}
COL.solid(FP.children[2],null,'rangka-press');
const OL_STREAM=LQ.stream([Cm(12,.95,.6),Cm(12,.6,.85),Cm(12,.32,1.0)],m(.05),LQ.mat({color:C_OLEIN,opacity:.9,speed:2}));line.add(OL_STREAM.mesh);
const STB=new THREE.Group();line.add(STB);STB.position.set(m(12),m(.02),m(1.3));mk(box(1.2,.3,.6),DSTEEL,STB,[0,.15,0]);mk(box(1.1,.02,.5),Ms({color:C_OLEIN,roughness:.05}),STB,[0,.27,0]);
const STE=new THREE.Group();line.add(STE);STE.position.set(m(12),0,m(-1.4));for(let k=0;k<5;k++)mk(box(.5,.25,.5,.03),Ms({color:C_STEARIN,roughness:.7}),STE,[-1+k*.5,.125,0]);
// pengemasan: sabuk + botol + nosel
const BELT=new THREE.Group();line.add(BELT);BELT.position.set(m(17),0,0);mk(box(5,.08,.5),Ms({color:0x2a2c30}),BELT,[0,.9,0]);for(const x of[-2.2,2.2])mk(box(.15,.9,.5),DSTEEL,BELT,[x,.45,0]);COL.solid(BELT.children[0],null,'sabuk');
const NOZ=new THREE.Group();line.add(NOZ);NOZ.position.set(m(17),m(1.7),0);mk(box(.4,.3,.4),SH_M,NOZ,[0,0,0]);mk(cyl(.02,.02,.25,8),STEEL,NOZ,[0,-.28,0]);
const BOTS=[];for(let i=0;i<8;i++){const b=bottle1L(line,0,.94,0);b.scale.setScalar(1.4);BOTS.push(b)}
const FILL=LQ.stream([Cm(17,1.27,0),Cm(17,1.2,0)],m(.012),LQ.mat({color:C_OLEIN,opacity:.9,speed:3}));line.add(FILL.mesh);
// pipa atas menghubungkan tangki
AS.pipe(line,[[-18,2.9,-.6],[-18,3.6,-.6],[12,3.6,-.6],[12,2.1,-.6]],.08);

/* ================= SAMPUL ================= */
const cov=new THREE.Scene();cov.add(new THREE.HemisphereLight(0xffffff,0x8a94a0,1.6));{const l=new THREE.DirectionalLight(0xffffff,2.3);l.position.set(m(2),m(4),m(5));cov.add(l)}
{const g=new THREE.Group();cov.add(g);const b=new THREE.Group();b.position.set(m(-.35),m(.33),0);g.add(b);bunchMesh(b,1.35);const bt=bottle1L(g,.25,0,.1);bt.scale.setScalar(2.2);
 const d=new THREE.Group();d.position.set(m(.95),0,m(-.35));g.add(d);mk(cyl(.24,.24,.7,32),Ms({color:0x22262b,roughness:.4,metalness:.6}),d,[0,.35,0]);for(const y of[.16,.54])mk(new THREE.TorusGeometry(m(.245),m(.013),6,32).rotateX(PI/2),DSTEEL,d,[0,y,0]);
 mk(box(.7,.06,.06),Ms({color:0xd8342a,emissive:0xa01a10,emissiveIntensity:.4}),d,[0,.4,.26],[0,0,PI/4]);mk(box(.7,.06,.06),Ms({color:0xd8342a,emissive:0xa01a10,emissiveIntensity:.4}),d,[0,.4,.26],[0,0,-PI/4])}
function coverPose(){cam.position.copy(Cm(.3,1.3,3.6));cam.fov=34;cam.near=m(.05);cam.far=m(30);cam.updateProjectionMatrix();cam.lookAt(Cm(.25,.42,0))}

/* ================= SET aktif ================= */
const SETS={kit,mol,farm,mill,ref,line};
const GR={kit:()=>0,mol:()=>-1e9,farm:()=>0,mill:()=>0,ref:()=>0,line:()=>0};
function useSet(name,withA){const s=SETS[name];if(withA&&A.root.parent!==s)s.add(A.root);if(!withA&&A.root.parent)A.root.parent.remove(A.root);return s}
const headW=()=>{A.root.updateMatrixWorld(true);return A.head.localToWorld(V(0,m(.32),0))};
const faceCU=()=>{const h=headW(),ry=A.root.rotation.y,f=V(Math.sin(ry),0,Math.cos(ry)),r=V(Math.cos(ry),0,-Math.sin(ry));return[h.clone().addScaledVector(f,m(3.2)).addScaledVector(r,m(.3)).add(V(0,-m(.2),0)),V(h.x,h.y-m(.3),h.z),39]};
const gwL=(g,x,y,z)=>{g.updateMatrixWorld(true);return g.localToWorld(Cm(x,y,z))};
const SHL=[];const S=(i,f,o)=>SHL.push(Object.assign({i,f},o));
// K1 hook (pembuka = penutup)
S(0,0,{set:'kit',a:1,cam:(u)=>{aK();A.gaze=gwL(DRUM,0,.9,0);A.act('point',u+1,'happy');return camA()}});
S(0,.5,{set:'kit',cam:(u)=>[Cm(.95,1.55,-.9),Cm(.95,.9,-3.0),48],fx:(u)=>{FX.label('Minyak bumi',gwL(DRUM,0,.9,0),u-.2,150,-110);FX.label('Minyak goreng',gwL(BOT,0,.3,0),u-.5,-150,-110)}});
// K2 permintaan komentar
S(1,0,{set:'kit',a:1,cam:(u)=>{aK();A.gaze=null;A.act('present',u+1,'happy');return[Cm(.15,1.55,.4),Cm(-.2,1.3,-1.8),42]}});
// K3 hidrokarbon = BBM
S(2,0,{set:'mol',mol:'hc',cam:(u)=>[Cm(0,1.6,5.4),Cm(0,1.5,0),40],fx:(u)=>{FX.label('Minyak bumi: hidrokarbon',Cm(0,2.0,0),u-.4,0,-150)}});
// K4 lemak tumbuhan dari sawit
S(3,0,{set:'mol',mol:'tg',cam:(u)=>[Cm(.1,-.2,6.4),Cm(.1,-.2,0),40],fx:(u)=>{FX.label('Minyak goreng: lemak',Cm(0,.5,0),u-.4,0,-150)}});
S(3,.55,{set:'farm',cam:(u)=>[Cm(8-u*.4,5.5,10),Cm(3,6,2),44],fx:(u)=>{FX.label('Buah sawit',gwL(PALM.userData.bunches[0],0,0,0),u-.3,-150,-110)}});
// K5 direbus uap
S(4,0,{set:'mill',ster:1,cam:(u)=>[Cm(-2.5,3.2,6.5),Cm(-6,1.4,0),44],fx:(u)=>{FX.label('Rebusan',Cm(-6,3.1,0),u-.4,150,-110)}});
// K6 diperas jadi CPO
S(5,0,{set:'mill',press:1,cam:(u)=>[Cm(8.4,3.2,7.2),Cm(4.8,1.4,0),44],fx:(u)=>{FX.label('Mesin peras',Cm(5,2,0),u-.4,150,-110)}});
// K7 20 %
S(6,0,{set:'mill',cam:(u)=>[Cm(-.6,3.2,13.6),Cm(-.6,.6,4),40],fx:(u)=>{FX.label('5 tandan',gwL(YIELD,-.3,.7,0),u-.3,-150,-110);FX.label('±1 bagian minyak',gwL(JAR,0,.55,0),u-.6,150,-110)}});
// K8 dikirim ke kilang Gresik
S(7,0,{set:'ref',truck:1,cam:(u)=>[Cm(45,26,80),Cm(-5,5,-10),44],fx:(u)=>{FX.label('Kilang minyak goreng',Cm(-10,13,8),u-.5,-150,-110)}});
// K9 CPO merah jingga, bau tajam
S(8,0,{set:'line',smell:1,cam:(u)=>[Cm(-15.2,2.8,5.4),Cm(-18,1.3,0),40],fx:(u)=>{FX.label('CPO',gwL(T_CPO,0,2.2,0),u-.4,150,-110)}});
// K10 degumming
S(9,0,{set:'line',degum:1,cam:(u)=>[Cm(-10.4,3.0,5.4),Cm(-13,1.5,0),40]});
// K11 tanah pemucat
S(10,0,{set:'line',bleach:1,cam:(u)=>[Cm(-5.4,3.0,5.4),Cm(-8,1.5,0),40]});
// K12 disaring, jadi kuning
S(11,0,{set:'line',filt:1,cam:(u)=>[Cm(-1.4,2.6,5.0),Cm(-3.5,1.3,0),40],fx:(u)=>{FX.label('Lempung tertahan',Cm(-3.6,2.0,-.2),u-.4,-150,-110)}});
// K13 250 °C vakum
S(12,0,{set:'line',deo:1,cam:(u,T)=>{const k=e3(cl(u/T,0,1));return[Cm(5.4,lerp(1.8,5.2,k),6.2),Cm(2,lerp(1.8,4.6,k),0),44]}});
// K14 bau menguap
S(13,0,{set:'line',deo:1,vap:1,cam:(u)=>[Cm(4.4,8.6,5.6),Cm(2,7.6,0),44]});
// K15 didinginkan
S(14,0,{set:'line',cry:1,cam:(u)=>[Cm(9.6,3.0,5.6),Cm(7,1.5,0),40]});
// K16 stearin vs olein
S(15,0,{set:'line',fp:1,cam:(u)=>[Cm(14.6,3.0,6.4),Cm(12,1.0,0),44],fx:(u)=>{FX.label('Stearin',gwL(STE,0,.3,0),u-.4,-150,-110);FX.label('Olein',gwL(STB,0,.3,0),u-.8,150,-110)}});
// K17 dikemas
S(16,0,{set:'line',bot:1,cam:(u)=>[Cm(18.4,1.8,2.6),Cm(17,1.1,0),40]});
// K18 SELAMAT
S(17,0,{set:'kit',a:1,cam:(u)=>{aK();A.gaze=null;A.act('celebrate',u,'happy');return faceCU()},fx:(u)=>{FX.confetti(u);FX.boom('SELAMAT!',{x:540,y:620},nsh(u-.2),'#2f6bff',2.76,140)}});
S(17,.5,{set:'kit',a:1,cam:(u)=>{aK();A.gaze=null;A.act('celebrate',u+1.4,'happy');return camA()},fx:(u)=>{FX.confetti(u+1.4)}});
// K19 CTA (komposisi = pembuka)
S(18,0,{set:'kit',a:1,cam:(u)=>{aK();A.gaze=gwL(DRUM,0,.9,0);A.act('point',u+1,u<.8?'happy':'normal');return camA()}});

/* ================= render(t) ================= */
SHL.forEach(s=>{s.t0=s.f?ST[s.i]+s.f*DUR[s.i]:(s.i===0?0:ST[s.i])});SHL.forEach((s,k)=>{s.t1=k<SHL.length-1?SHL[k+1].t0:TOTAL});
const lineAt=t=>{for(let i=N-1;i>=0;i--)if(t>=ST[i]-.03)return i;return 0};
const nsh=v=>v<0?v:v+.36;
const cA=new THREE.Color(),cB=new THREE.Color();const mixC=(a,b,k)=>cA.setHex(a).lerp(cB.setHex(b),cl(k,0,1)).getHex();
function render(t){t=cl(t,0,TOTAL-1e-3);
 let k=SHL.findIndex(s=>t>=s.t0&&t<s.t1);if(k<0)k=SHL.length-1;const sh_=SHL[k],u=t-sh_.t0,T=sh_.t1-sh_.t0;
 const sc=useSet(sh_.set,!!sh_.a);A.gaze=null;
 // molekul
 HC.visible=sh_.mol!=='tg';TG.visible=sh_.mol!=='hc';HC.rotation.y=.4*Math.sin(t*.6);TG.rotation.y=.4*Math.sin(t*.6);
 // pabrik: lori masuk rebusan, uap
 const cx=sh_.ster?lerp(-12,-7,e3(cl(u/(T*.7),0,1))):-7;CART.position.set(m(cx),m(.38),0);
 STEAM.forEach((s,i)=>{const ph=(t*.5+i/10)%1;s.visible=!!sh_.ster;s.position.set(m(-9.5+i*.8),m(1.6+ph*2.2),m(-.6+ph*.4));s.scale.setScalar(m(.8+ph*1.6));s.material.opacity=.55*(1-ph)});
 SCREW.rotation.x=t*2.2;PRESS_OIL.set(sh_.press?cl((u-.5)/.6,0,1):1);
 FRUIT.set(q=>{const ph=((sh_.press?u:0)*.7+q/30)%1;const p=Cm(3.9+(hash(q)-.5)*.6,3.4-ph*1.6,(hash(q+.3)-.5)*.6);p.s=sh_.press?1:1e-4;return p});
 // truk masuk kilang
 TRK.position.set(m(sh_.truck?lerp(-70,0,e3(cl(u/(T*.85),0,1))):0),0,m(20));
 // warna tangki
 T_CPO.userData.liq.mesh.children.forEach(c=>{c.material.color.setHex(C_CPO)});
 const degK=sh_.degum?cl(u/T,0,1):0;
 const bleK=sh_.bleach?e3(cl((u-.6)/(T-.8),0,1)):0;T_BLE.userData.liq.mesh.children.forEach(c=>c.material.color.setHex(mixC(C_CPO,C_BLEACH,bleK)));
 // butiran: tetes asam (degum) / lempung (bleach) / bau (CPO)
 VAP.forEach((s,i)=>{const ph=(t*.45+i/8)%1;const on=sh_.vap||sh_.smell;s.visible=!!on;
  if(sh_.smell){s.position.set(m(-18+(hash(i)-.5)*1.2),m(2.6+ph*1.6),m((hash(i+.5)-.5)*1.0));s.material.color.setHex(0xb07a4a)}
  else{s.position.set(m(2+(hash(i)-.5)*.4),m(8.2+ph*2.4),m((hash(i+.5)-.5)*.4));s.material.color.setHex(0xf2ece0)}
  s.scale.setScalar(m(.6+ph*1.4));s.material.opacity=.5*(1-ph)});
 BUB.set(q=>{const lv=q%5,ph=(t*1.3+q*.17)%1;const a=q*2.4;const p=Cm(2+Math.cos(a)*.6*hash(q),1.0+lv*1.3+ph*.16,Math.sin(a)*.6*hash(q+.2));p.s=sh_.deo?1:1e-4;
  if(sh_.degum&&q<40){const a2=q*2.4,r2=.7*Math.sqrt(hash(q));const sink=cl((u-.8-hash(q+.1)*1.2)/2.5,0,1);const p2=Cm(-13+Math.cos(a2)*r2,1.9-sink*1.6,Math.sin(a2)*r2);p2.s=cl((u-.5-hash(q+.1)*1.2)/.5,0,1)*.8;p2.c=new THREE.Color(0x7a5a32);return p2}
  if(sh_.bleach&&q<60){const ph2=((u*.5)+q/60)%1;const p2=Cm(-8+(hash(q)-.5)*1.0,3.0-ph2*1.6,(hash(q+.4)-.5)*1.0);p2.s=1;p2.c=new THREE.Color(0xc8b898);return p2}
  p.c=new THREE.Color(0xffffff);return p});
 // deodorizer layar
 drawD(sh_.cry?lerp(60,20,cl(u/(T*.8),0,1)):250,!sh_.cry);
 DPAN.position.set(m(sh_.cry?8.2:3.6),m(2.4),m(1.2));
 CRY.set(q=>{const a=q*2.4,r=.75*Math.sqrt(hash(q));const p=Cm(7+Math.cos(a)*r,.6+hash(q+.7)*1.5,Math.sin(a)*r);p.s=sh_.cry?cl((u-.4-hash(q+.9)*1.5)/.6,0,1):(sh_.fp?1:1e-4);return p});
 T_CRY.userData.liq.mesh.children.forEach(c=>c.material.color.setHex(mixC(C_RBD,0xf8ecc0,sh_.cry?cl(u/T,0,1):0)));
 OL_STREAM.set(sh_.fp?cl((u-.3)/.6,0,1):1);
 // pengemasan
 BOTS.forEach((b,i)=>{const x=((sh_.bot?u:0)*.5+i*.6)%4.8-2.4;b.position.set(m(17+x),m(.94),0);const f=cl((x+.15)/.3,0,1);b.userData.oil.scale.y=Math.max(.02,x<-.15?.02:f);b.userData.oil.position.y=m(.1*(x<-.15?.02:f))});
 FILL.set(1);ACID.set(sh_.degum?cl((u-.2)/.5,0,1):0);
 let [pos,tg,fov]=sh_.cam(u,T);cam.position.copy(pos);cam.fov=fov||40;cam.near=m(.02);cam.far=m(3000);cam.updateProjectionMatrix();cam.lookAt(tg);autoNear(cam,tg,U);
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
