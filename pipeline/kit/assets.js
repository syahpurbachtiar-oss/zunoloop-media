// ZunoLoop perpustakaan aset 3D — SUDAH LOLOS QC (zfight.py + cek mata, 15 Nov 2026).
// Tujuan: video baru MERANGKAI aset ini, bukan memodelkan ulang dari nol → kesalahan lama tidak terulang.
// Pakai: import {makeAssets} from './kit/assets.js';  const AS = makeAssets(THREE, C.M, RBG);
// Semua ukuran input dalam METER dunia nyata; posisi hasil dalam unit scene (sudah ×U). Benda menghadap +z, alas di y=0.
// Aturan yang ditanam (jangan dilanggar saat menambah aset baru):
//  - tidak ada dua permukaan sebidang: atap menjorok ≥15 cm, lapisan tanah selisih ≥3 cm + polygonOffset
//  - sambungan menyatu: cerobong punya kerah yang tertanam di atap, pipa punya flens di tiap sambungan, kaki mesin punya pelat dasar
//  - warna/material mengikuti kenyataan (parameter `real` di tiap fungsi bila ada beberapa varian)
export function makeAssets(THREE, U, RBG) {
  const m = v => v * U, PI = Math.PI;
  let seed = 101; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const Ms = o => new THREE.MeshStandardMaterial(o);
  const PO = { polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -4 };
  const mk = (g, mat, p, pos, rot, sc) => { const o = new THREE.Mesh(g, mat); o.castShadow = o.receiveShadow = true;
    if (pos) o.position.set(...pos.map(m)); if (rot) o.rotation.set(...rot); if (sc) o.scale.set(...sc); if (p) p.add(o); return o; };
  const box = (w, h, d, r = 0) => r ? new RBG(m(w), m(h), m(d), 3, m(r)) : new THREE.BoxGeometry(m(w), m(h), m(d));
  const cyl = (rt, rb, h, s = 24, open = false) => new THREE.CylinderGeometry(m(rt), m(rb), m(h), s, 1, open);
  const ctex = (w, h, draw, rep = [1, 1]) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...rep); t.anisotropy = 4; return t; };
  const noise = (base, vr, n = 6000, sz = 3, rep = [1, 1]) => ctex(256, 256, (x, w, h) => { x.fillStyle = base; x.fillRect(0, 0, w, h);
    for (let i = 0; i < n; i++) { x.fillStyle = vr[i % vr.length]; x.fillRect(rnd() * w, rnd() * h, 1 + rnd() * sz, 1 + rnd() * sz); } }, rep);
  const MAT = {
    steel: Ms({ color: 0xcfd6dd, roughness: .35, metalness: .6 }), dark: Ms({ color: 0x2a2f36, roughness: .5, metalness: .4 }),
    rubber: Ms({ color: 0x1b1d20, roughness: .85 }), concrete: Ms({ color: 0xffffff, roughness: .95, map: noise('#c9c5bd', ['#b9b5ad', '#d6d2ca', '#a9a59e'], 7000, 3, [4, 4]) }),
    glass: Ms({ color: 0x9fc4d8, roughness: .08, metalness: .3 }), white: Ms({ color: 0xf2f0ea, roughness: .8 }),
  };

  /* ---------- MATAHARI (bias bayangan baku — tanpa ini atap/dinding bergaris 'shadow acne') ---------- */
  function sun(scene, posM = [-140, 170, 110], halfM = 150, intensity = 2.6) {
    const l = new THREE.DirectionalLight(0xfff1dc, intensity); l.position.set(...posM.map(m)); l.castShadow = true; l.shadow.mapSize.set(2048, 2048);
    Object.assign(l.shadow.camera, { left: -m(halfM), right: m(halfM), top: m(halfM), bottom: -m(halfM), near: m(1), far: m(Math.hypot(...posM) * 2.2) });
    l.shadow.bias = -.0004; l.shadow.normalBias = .8; scene.add(l); scene.add(l.target); scene.userData.sun = l; return l;
  }

  /* ---------- TANAH & JALAN (berlapis, tidak sebidang) ---------- */
  // lapisan: rumput y=0, trotoar/plaza y=.03, aspal y=.05, marka y=.07 — semua polygonOffset
  function ground(scene, sizeM = 3000, kind = 'grass') {
    const cols = { grass: ['#86a062', ['#7a9458', '#91ab6c', '#748e55']], sand: ['#e2c99a', ['#d6bc8b', '#ead6ad', '#cdb07f']], dirt: ['#9c8b5a', ['#8c7c4e', '#aa9a68']] }[kind];
    return mk(new THREE.PlaneGeometry(m(sizeM), m(sizeM)).rotateX(-PI / 2), Ms({ color: 0xffffff, roughness: 1, map: noise(cols[0], cols[1], 12000, 3, [sizeM / 12, sizeM / 12]) }), scene);
  }
  function road(scene, x0, z0, x1, z1, widthM = 9, marks = true) {
    const len = Math.hypot(x1 - x0, z1 - z0), g = new THREE.Group(); g.position.set(m((x0 + x1) / 2), 0, m((z0 + z1) / 2)); g.rotation.y = -Math.atan2(z1 - z0, x1 - x0); scene.add(g);
    mk(new THREE.PlaneGeometry(m(len), m(widthM)).rotateX(-PI / 2), Ms({ ...PO, color: 0xffffff, roughness: .95, map: noise('#4a4c50', ['#3e4044', '#55575b', '#5f6165'], 9000, 2, [len / 8, 1]) }), g, [0, .05, 0]).castShadow = false;
    if (marks) for (let s = -len / 2 + 2; s < len / 2 - 2; s += 8) mk(new THREE.PlaneGeometry(m(3), m(.15)).rotateX(-PI / 2), Ms({ ...PO, polygonOffsetUnits: -8, color: 0xf2f2f2 }), g, [s, .07, 0]).castShadow = false;
    return g;
  }
  function paving(scene, cx, cz, wM, dM, color = '#cfcac0') {
    return mk(new THREE.PlaneGeometry(m(wM), m(dM)).rotateX(-PI / 2), Ms({ ...PO, color: 0xffffff, roughness: .9, map: noise(color, ['#c2bdb3', '#dbd6cc'], 8000, 2, [wM / 10, dM / 10]) }), scene, [cx, .03, cz]);
  }
  // laut biru tua (aturan 14 Nov). Kembalikan tekstur agar bisa digeser tiap frame: tex.offset.set(t*.004, t*.002)
  function sea(scene, cx, cz, wM, dM, y = -1.2) {
    const tex = noise('#14528f', ['#1a5f9e', '#0f4687', '#2d6fb0'], 5000, 4, [wM / 12, dM / 12]);
    const o = mk(new THREE.PlaneGeometry(m(wM), m(dM)).rotateX(-PI / 2), Ms({ color: 0xffffff, roughness: .15, metalness: .2, map: tex }), scene, [cx, y, cz]); o.castShadow = o.receiveShadow = false;
    return { mesh: o, tex };
  }

  /* ---------- RUMAH (atap pelana menjorok 15 cm tiap sisi — anti kedip) ---------- */
  const houseTex = col => ctex(256, 256, (c, w, h) => { c.fillStyle = col; c.fillRect(0, 0, w, h);
    for (const y0 of [34, 128]) for (const x0 of [28, 108, 188]) { c.fillStyle = '#fff'; c.fillRect(x0 - 4, y0 - 4, 48, 58); c.fillStyle = '#41556b'; c.fillRect(x0, y0, 40, 50); c.fillStyle = '#fff'; c.fillRect(x0 + 18, y0, 4, 50); }
    c.fillStyle = '#5a3a2a'; c.fillRect(108, 206, 40, 50); });
  function house(parent, { x = 0, z = 0, w = 8.6, d = 10, h = 9, wall = '#e9c46a', roof = 0x7a3b2e, ry = 0 } = {}) {
    const g = new THREE.Group(); g.position.set(m(x), 0, m(z)); g.rotation.y = ry; parent.add(g);
    const wm = Ms({ map: houseTex(wall), roughness: .8, emissive: 0xffb060, emissiveIntensity: 0 }); g.userData.wallMat = wm;
    mk(box(w, h, d), wm, g, [0, h / 2, 0]);
    // atap pelana: prisma segitiga, panjang w+0.3 (menjorok), lebar d+0.4 (teritis)
    const rh = d * .32, shape = new THREE.Shape([new THREE.Vector2(-m(d / 2 + .2), 0), new THREE.Vector2(m(d / 2 + .2), 0), new THREE.Vector2(0, m(rh))]);
    const rg = new THREE.ExtrudeGeometry(shape, { depth: m(w + .3), bevelEnabled: false }); rg.translate(0, 0, -m((w + .3) / 2)); rg.rotateY(PI / 2);
    mk(rg, Ms({ color: roof, roughness: .8 }), g, [0, h + .02, 0]);
    return g;
  }
  function houseRow(parent, { x0 = 0, z = 0, n = 12, w = 8.6, d = 10, gap = .4, ry = 0, palette = ['#e9c46a', '#e76f51', '#f4a261', '#a8dadc', '#e5989b', '#f1faee', '#90be6d'] } = {}) {
    const out = []; for (let i = 0; i < n; i++) out.push(house(parent, { x: x0 + i * (w + gap), z, w, d, h: 8.5 + (i * 7) % 3, wall: palette[i % palette.length], ry })); return out;
  }

  /* ---------- CEROBONG di atap miring (kerah tertanam, tidak "ditempel") ---------- */
  // roofAngle = kemiringan atap (rad, turun ke +z); y0 = tinggi atap di titik cerobong
  function chimney(parent, { x = 0, y0 = 0, z = 0, r = 3, h = 40, roofAngle = 0, color = 0xd7dadc } = {}) {
    const g = new THREE.Group(); g.position.set(m(x), m(y0), m(z)); parent.add(g);
    const sink = Math.tan(Math.abs(roofAngle)) * r * 1.6 + .5; // tertanam lebih dalam dari bidang miring
    mk(cyl(r, r * 1.08, h + sink, 32), Ms({ color, roughness: .4, metalness: .4 }), g, [0, (h - sink) / 2, 0]);
    // kerah/alas beton bertingkat yang menembus bidang atap
    mk(cyl(r * 1.5, r * 1.7, sink + 1.2, 32), MAT.concrete, g, [0, (1.2 - sink) / 2, 0]);
    mk(cyl(r * 1.25, r * 1.5, .8, 32), MAT.concrete, g, [0, 1.2 + .4, 0]);
    mk(cyl(r * 1.06, r * 1.06, 1.2, 32), MAT.dark, g, [0, h + .6, 0]); // cincin puncak
    g.userData.top = new THREE.Vector3(m(x), m(y0 + h + 1.2), m(z));
    return g;
  }

  /* ---------- PIPA (flens di setiap sambungan) ---------- */
  function pipe(parent, ptsM, rM, mat = MAT.steel, flange = true) {
    const pts = ptsM.map(p => new THREE.Vector3(m(p[0]), m(p[1]), m(p[2])));
    const path = new THREE.CurvePath(); for (let i = 0; i < pts.length - 1; i++) path.add(new THREE.LineCurve3(pts[i], pts[i + 1]));
    const o = mk(new THREE.TubeGeometry(path, pts.length * 24, m(rM), 16), mat, parent);
    if (flange) for (const p of pts) { const f = mk(new THREE.SphereGeometry(m(rM * 1.18), 16, 12), mat, parent); f.position.copy(p); }
    return o;
  }

  /* ---------- TRUK SAMPAH (bak jungkit: userData.body.rotation.x = -sudut) ---------- */
  function garbageTruck(parent, { color = 0x2f8a52 } = {}) {
    const g = new THREE.Group(); parent.add(g);
    mk(box(2.5, .5, 9), MAT.dark, g, [0, .9, 0]);
    mk(box(2.5, 2.6, 2.3, .25), Ms({ color: 0xf2f4f5, roughness: .4 }), g, [0, 2.25, 3.4]);
    mk(box(2.3, .9, .06), MAT.glass, g, [0, 2.85, 4.56]);
    const body = new THREE.Group(); body.position.set(0, m(1.15), m(-4.4)); g.add(body); g.userData.body = body;
    mk(box(2.5, 2.8, 6.6, .2), Ms({ color, roughness: .45, metalness: .2 }), body, [0, 1.4, 3.3]);
    mk(box(2.52, .25, 6.62), Ms({ color: 0xf2f4f5, roughness: .4 }), body, [0, 2.3, 3.3]);
    for (const zz of [3.4, -1.9, -3.4]) for (const xx of [-1.15, 1.15]) mk(cyl(.5, .5, .4, 20), MAT.rubber, g, [xx, .5, zz], [0, 0, PI / 2]);
    return g;
  }

  /* ---------- POHON ---------- */
  function tree(parent, x, z, k = 1) {
    const g = new THREE.Group(); g.position.set(m(x), 0, m(z)); parent.add(g);
    mk(cyl(.2 * k, .28 * k, 3 * k, 10), Ms({ color: 0x6b4f3a, roughness: .95 }), g, [0, 1.5 * k, 0]);
    for (let i = 0; i < 3; i++) mk(new THREE.IcosahedronGeometry(m((1.6 + rnd() * .5) * k), 1), Ms({ color: 0x4f7f3a, roughness: .85 }), g, [(rnd() - .5) * 2 * k, (3.6 + rnd()) * k, (rnd() - .5) * 2 * k]);
    return g;
  }

  /* ---------- LINTASAN SKI ---------- */
  // real: 'snow' (putih bersalju) atau 'synthetic' (matras sintetis hijau, mis. CopenHill/Neveplast — WAJIB dijelaskan di naskah/chip)
  const slopeTex = real => ctex(512, 1024, (c, w, h) => { const syn = real === 'synthetic';
    c.fillStyle = syn ? '#3d8b46' : '#f4f7fb'; c.fillRect(0, 0, w, h);
    for (let i = 0; i < 9000; i++) { c.fillStyle = syn ? ['#36803f', '#46974f', '#3a8743'][i % 3] : ['#e8eef6', '#ffffff', '#dfe7f1'][i % 3]; c.fillRect(rnd() * w, rnd() * h, 2, syn ? 4 : 2); }
    c.strokeStyle = syn ? '#6fc069' : '#d5e1ef'; c.lineWidth = 70; c.lineCap = c.lineJoin = 'round'; c.beginPath(); c.moveTo(150, 20); for (let k = 0; k < 6; k++) c.lineTo(k % 2 ? 150 : 360, 80 + k * 175); c.lineTo(256, h - 30); c.stroke(); });
  // bidang miring dari (y0 di z0) ke (y1 di z1), lebar wM; offset .3 m di atas atap + polygonOffset
  function skiSlope(parent, { x = 0, z0 = 0, y0 = 0, z1 = 100, y1 = 0, wM = 60, real = 'synthetic' } = {}) {
    const L = Math.hypot(z1 - z0, y0 - y1), a = Math.atan2(y0 - y1, z1 - z0);
    const g = new THREE.PlaneGeometry(m(wM), m(L)).rotateX(-PI / 2); g.translate(0, 0, m(L / 2));
    const o = mk(g, Ms({ ...PO, map: slopeTex(real), roughness: .95 }), parent); o.rotation.x = a;
    o.position.set(m(x), m(y0), m(z0)).add(new THREE.Vector3(0, Math.cos(a), Math.sin(a)).multiplyScalar(m(.3)));
    o.userData = { angle: a, len: L, yAt: zz => y0 - (zz - z0) / (z1 - z0) * (y0 - y1) + .32 };
    return o;
  }
  // papan ski + tongkat untuk karakter berpose 'ski' (tempel ke c.root)
  function skiGear(c) {
    const red = Ms({ color: 0xe24a3b, roughness: .4 });
    for (const xx of [-.12, .12]) mk(box(.09, .03, 1.6, .01), red, c.root, [xx, .02, .12]);
    // tongkat: ujung atas di genggaman tangan, ujung bawah di salju agak ke belakang-samping — panggil update() tiap frame setelah c.act('ski',…)
    const poles = c.arms.map(() => { const o = mk(cyl(.012, .012, 1, 6), MAT.dark, c.root); o.castShadow = true; return o; });
    const up = new THREE.Vector3(0, 1, 0), hw = new THREE.Vector3();
    return { update() { c.root.updateMatrixWorld(true); c.arms.forEach((a, i) => { a.hand.getWorldPosition(hw); const h = c.root.worldToLocal(hw.clone());
        const f = new THREE.Vector3(h.x + Math.sign(h.x || (i ? -1 : 1)) * m(.08), m(.02), h.z - m(.25)); const d = h.clone().sub(f), L = d.length();
        const o = poles[i]; o.position.copy(f).add(h).multiplyScalar(.5); o.scale.set(1, L / m(1), 1); o.quaternion.setFromUnitVectors(up, d.normalize()); }); } };
  }

  /* ---------- DINDING PANJAT (pegangan kecil rapat + tali; pemanjat menghadap dinding, pose 'climb') ---------- */
  function climbingWall(parent, { x = 0, y = 0, z = 0, w = 28, h = 82, ry = 0 } = {}) {
    const g = new THREE.Group(); g.position.set(m(x), m(y), m(z)); g.rotation.y = ry; parent.add(g);
    mk(box(w, h, .5), Ms({ color: 0x6f8fa8, roughness: .8, map: noise('#6f8fa8', ['#67879f', '#7797b0'], 4000, 3, [w / 4, h / 4]) }), g, [0, h / 2, 0]);
    const n = Math.round(w * h * .45), im = new THREE.InstancedMesh(new THREE.DodecahedronGeometry(m(.13), 0), Ms({ color: 0xffffff, roughness: .6 }), n), o = new THREE.Object3D(), c = new THREE.Color();
    for (let k = 0; k < n; k++) { o.position.set(m(-w / 2 + .5 + rnd() * (w - 1)), m(.5 + rnd() * (h - 1)), m(.3)); o.scale.set(1 + rnd(), .7 + rnd() * .6, .8); o.updateMatrix(); im.setMatrixAt(k, o.matrix);
      c.setHex([0xf2c230, 0xe24a3b, 0x2f6bd6, 0x2fbf6a, 0xf28c28][k % 5]); im.setColorAt(k, c); }
    g.add(im);
    // titik tali (anchor) di puncak; panggil rope(xLocal, yClimber) untuk tali ke pemanjat
    g.userData.rope = (xl, yTop, yClimber) => { const t = mk(cyl(.015, .015, yTop - yClimber, 6), Ms({ color: 0xe24a3b, roughness: .6 }), g, [xl, (yTop + yClimber) / 2, .55]); return t; };
    return g;
  }
  // pasang pemanjat: karakter menghadap dinding (punggung ke luar), kaki & tangan di dinding, harness sederhana
  function placeClimber(wall, c, xl, yl) {
    wall.add(c.root); c.root.position.set(m(xl), m(yl), m(.62)); c.root.rotation.set(-.08, PI, 0);
    mk(new THREE.TorusGeometry(m(.17), m(.025), 6, 20), Ms({ color: 0x222831 }), c.root, [0, .92, 0], [PI / 2, 0, 0]);
    return c;
  }

  /* ---------- TIANG LISTRIK + kabel ---------- */
  function pylons(parent, ptsM, hM = 34) {
    const tops = [];
    for (const [x, z] of ptsM) { const g = new THREE.Group(); g.position.set(m(x), 0, m(z)); parent.add(g);
      mk(cyl(.6, 2.2, hM, 4), MAT.steel, g, [0, hM / 2, 0]); mk(box(14, .6, .6), MAT.steel, g, [0, hM - 4, 0]); mk(box(10, .6, .6), MAT.steel, g, [0, hM - 10, 0]);
      mk(box(4.4, .4, 4.4), MAT.concrete, g, [0, .2, 0]); tops.push([x, hM - 4.4, z]); }
    for (const dx of [-6.5, 6.5]) pipe(parent, tops.map(([x, y, z]) => [x + dx, y, z]), .06, MAT.dark, false);
    return tops;
  }


  /* ---------- PETERNAKAN & BIOGAS (15 Nov 2026) ---------- */
  // Sapi potong Indonesia: tinggi bahu ±1,3 m, panjang badan ±2 m, cokelat/krem. Menghadap +z. Kaki di y=0.
  function cow(parent, { x = 0, z = 0, ry = 0, coat = 0xb07a4a, k = 1 } = {}) {
    const g = new THREE.Group(); g.position.set(m(x), 0, m(z)); g.rotation.y = ry; g.scale.setScalar(k); parent.add(g);
    const hide = Ms({ color: coat, roughness: .85 }), dark = Ms({ color: 0x2a1d14, roughness: .7 }), horn = Ms({ color: 0xe8dcc0, roughness: .5 }), pink = Ms({ color: 0x8a5a4a, roughness: .7 });
    const body = mk(new THREE.CapsuleGeometry(m(.36), m(1.15), 8, 16), hide, g, [0, 1.0, 0], [PI / 2, 0, 0]); body.scale.set(1.05, 1, 1.1);
    mk(new THREE.SphereGeometry(m(.3), 16, 12), hide, g, [0, 1.12, .7]); // punuk/bahu
    const neck = mk(cyl(.18, .24, .5, 12), hide, g, [0, 1.05, .95], [-1.0, 0, 0]);
    const head = new THREE.Group(); head.position.set(0, m(1.0), m(1.25)); g.add(head); g.userData.head = head;
    mk(new RBG(m(.3), m(.32), m(.5), 3, m(.09)), hide, head, [0, 0, .06], [-.45, 0, 0]);
    mk(new RBG(m(.22), m(.2), m(.22), 3, m(.07)), pink, head, [0, -.17, .32], [-.45, 0, 0]);
    for (const sx of [-1, 1]) mk(new THREE.SphereGeometry(m(.022), 8, 6), dark, head, [sx * .05, -.14, .43]);
    for (const sx of [-1, 1]) { mk(new THREE.SphereGeometry(m(.035), 10, 8), dark, head, [sx * .13, .06, .18]);
      mk(new THREE.ConeGeometry(m(.035), m(.14), 8), horn, head, [sx * .12, .19, -.02], [0, 0, -sx * .7]);
      const ear = mk(new THREE.SphereGeometry(m(.09), 10, 8), hide, head, [sx * .2, .1, -.05]); ear.scale.set(1, .45, .7); }
    g.userData.legs = [];
    for (const [lx, lz] of [[-.2, .55], [.2, .55], [-.2, -.55], [.2, -.55]]) { const leg = new THREE.Group(); leg.position.set(m(lx), m(.82), m(lz)); g.add(leg);
      mk(cyl(.075, .06, .74, 10), hide, leg, [0, -.37, 0]); mk(cyl(.07, .075, .08, 10), dark, leg, [0, -.78, 0]); g.userData.legs.push(leg); }
    const tail = mk(cyl(.02, .02, .7, 6), hide, g, [0, .78, -.9], [.25, 0, 0]); mk(new THREE.SphereGeometry(m(.05), 8, 6), dark, tail, [0, -.36, 0]); g.userData.tail = tail;
    g.userData.anim = t => { head.rotation.x = Math.sin(t * .9 + x) * .12 - .1; tail.rotation.z = Math.sin(t * 2.3 + z) * .25; };
    return g;
  }
  // Kandang komunal: lantai beton (+3 cm, polygonOffset), tiang baja, atap seng pelana menjorok, palung pakan, sekat besi.
  function barn(parent, { x = 0, z = 0, w = 30, d = 14, h = 3.6, ry = 0 } = {}) {
    const g = new THREE.Group(); g.position.set(m(x), 0, m(z)); g.rotation.y = ry; parent.add(g);
    mk(box(w, .15, d), Ms({ ...PO, color: 0xffffff, roughness: .95, map: noise('#a8a49b', ['#9c988f', '#b4b0a7'], 6000, 2, [w / 4, d / 4]) }), g, [0, .075, 0]).castShadow = false;
    for (let i = 0; i <= Math.round(w / 5); i++) for (const sz of [-1, 1]) mk(box(.15, h, .15), MAT.steel, g, [-w / 2 + i * w / Math.round(w / 5), h / 2 + .15, sz * (d / 2 - .1)]);
    const zinc = Ms({ color: 0xb8bfc5, roughness: .45, metalness: .55, side: THREE.DoubleSide, map: ctex(64, 64, (c, W_, H_) => { c.fillStyle = '#b8bfc5'; c.fillRect(0, 0, W_, H_); c.fillStyle = 'rgba(0,0,0,.18)'; for (let i = 0; i < W_; i += 8) c.fillRect(i, 0, 3, H_); }, [w / 1.2, 1]) });
    for (const sz of [-1, 1]) { const r = mk(box(w + .6, .05, d / 2 + .7), zinc, g, [0, h + .15 + .9, sz * (d / 4 + .15)]); r.rotation.x = sz * .26; }
    mk(box(w, .5, .6), MAT.concrete, g, [0, .4, d / 2 - .5]); // palung pakan
    for (let i = 0; i < Math.round(w / 2.5); i++) mk(box(.06, 1.1, .06), MAT.steel, g, [-w / 2 + 1.25 + i * 2.5, .7, d / 2 - .9]);
    mk(box(w, .06, .06), MAT.steel, g, [0, 1.2, d / 2 - .9]);
    g.userData.floorY = .15;
    return g;
  }
  // Kubah digester biogas (fixed dome, setengah tertanam) — warna real dari foto/sumber, default biru langit (KPT Maju Sejahtera).
  // cut=true: dibelah dua (setengah depan, sisi +z, dibuang) untuk adegan penampang; isi slurry = body cair, ruang gas di atas.
  function digester(parent, { x = 0, z = 0, r = 1.9, color = 0x8fc9ec, cut = false } = {}) {
    const g = new THREE.Group(); g.position.set(m(x), 0, m(z)); parent.add(g);
    const shell = Ms({ color, roughness: .45, side: THREE.DoubleSide });
    const a0 = cut ? PI / 2 : 0, al = cut ? PI : PI * 2;   // cylinder: theta 0 = +z → PI/2..3PI/2 = belakang (z<0)
    mk(new THREE.SphereGeometry(m(r), 40, 20, cut ? PI : 0, al, 0, PI / 2), shell, g, [0, -.5, 0]);       // kubah, 0,5 m tertanam (sphere: phi=PI/2 = +z → PI..2PI = belakang)
    mk(new THREE.CylinderGeometry(m(r * 1.06), m(r * 1.1), m(.25), 40, 1, false), MAT.concrete, g, [0, .02, 0]).visible = !cut; // kerah beton di tanah
    if (cut) { const ring = mk(new THREE.CylinderGeometry(m(r), m(r), m(2.2), 40, 1, true, a0, al), Ms({ color: 0x9a9a92, roughness: .9, side: THREE.DoubleSide }), g, [0, -1.6, 0]);
      // tanah ikut dipotong (penampang): cincin tanah + dua sisi potong + permukaan tanah, tanpa bidang tanah global di set penampang
      const soil = Ms({ color: 0xffffff, roughness: 1, side: THREE.DoubleSide, map: noise('#6b4f34', ['#5d4430', '#7a5b3c', '#4e3a28'], 6000, 3, [3, 2]) }), R2 = r + 1.6;
      mk(new THREE.CylinderGeometry(m(R2), m(R2), m(2.7), 40, 1, true, a0, al), soil, g, [0, -1.35, 0]);
      mk(new THREE.RingGeometry(m(r * 1.02), m(R2), 40, 1, a0 - PI / 2, al).rotateX(-PI / 2), Ms({ ...PO, color: 0xffffff, roughness: 1, map: noise('#9c8b5a', ['#8c7c4e', '#aa9a68'], 6000, 3, [3, 3]) }), g, [0, .01, 0]);
      for (const a of [a0, a0 + al]) { const q = mk(new THREE.PlaneGeometry(m(R2 - r), m(2.7)), soil, g); q.position.set(Math.sin(a) * m((r + R2) / 2), -m(1.35), Math.cos(a) * m((r + R2) / 2)); q.rotation.y = a + PI / 2; }
      mk(new THREE.CircleGeometry(m(R2), 40, a0 - PI / 2, al).rotateX(-PI / 2), soil, g, [0, -2.7, 0]);
      mk(new THREE.PlaneGeometry(m(2 * R2), m(.6)), soil, g, [0, -3, 0]); // tanah di bawah lantai digester (muka potong)
      g.userData.slurry = mk(new THREE.CylinderGeometry(m(r * .98), m(r * .98), 1, 40, 1, false, a0, al).translate(0, .5, 0), Ms({ color: 0x5a4630, roughness: .6 }), g, [0, -2.7, 0]);
      mk(new THREE.PlaneGeometry(m(r * 1.96), 1).translate(0, .5, 0), Ms({ color: 0x4e3c28, roughness: .7, side: THREE.DoubleSide }), g.userData.slurry, [0, 0, 0]); } // muka potong slurry (ikut scale.y)
    mk(cyl(.32, .32, .3, 20), MAT.concrete, g, [0, r - .5 + .12, 0]); // tutup manhole di puncak
    const valve = new THREE.Group(); valve.position.set(0, m(r - .5 + .27), 0); g.add(valve); mk(cyl(.025, .025, .45, 10), Ms({ color: 0xd9d9d9, roughness: .5 }), valve, [0, .22, 0]); mk(box(.12, .05, .05), Ms({ color: 0xd23a2a }), valve, [0, .3, 0]);
    g.userData.top = new THREE.Vector3(m(x), m(r - .5 + .5), m(z));
    // inlet (bak campur) dan outlet (bak ampas) setengah tertanam di dua sisi
    const inlet = new THREE.Group(); inlet.position.set(m(-r - 1.3), 0, 0); g.add(inlet); g.userData.inlet = inlet;
    mk(box(1.2, .7, 1.2), MAT.concrete, inlet, [0, .2, 0]); mk(box(1.0, .05, 1.0), Ms({ ...PO, color: 0x6e5638, roughness: .7 }), inlet, [0, .53, 0]);
    pipe(g, [[-r - .8, -.1, 0], [-r + .2, -1.2, 0]], .12, Ms({ color: 0x8a8f94, roughness: .6 }), false);
    const outlet = new THREE.Group(); outlet.position.set(m(r + 1.5), 0, 0); g.add(outlet); g.userData.outlet = outlet;
    mk(box(1.6, .6, 1.4), MAT.concrete, outlet, [0, .15, 0]); mk(box(1.4, .05, 1.2), Ms({ ...PO, color: 0x4a3a28, roughness: .8 }), outlet, [0, .43, 0]);
    return g;
  }
  // Gerobak angkong (satu roda) — bak logam ±0,6×0,9 m, roda depan, dua gagang. Menghadap +z (roda di depan).
  function wheelbarrow(parent, { color = 0x2f8a52 } = {}) {
    const g = new THREE.Group(); parent.add(g);
    const tub = Ms({ color, roughness: .5, metalness: .4, side: THREE.DoubleSide });
    const prof = [[0, 0], [.28, 0], [.42, .32], [.4, .34], [0, .06]].map(([r, y]) => new THREE.Vector2(m(r), m(y)));
    const b = mk(new THREE.LatheGeometry(prof, 4), tub, g, [0, .38, 0], [0, PI / 4, 0]); b.scale.set(1, 1, 1.45);
    g.userData.load = mk(new THREE.SphereGeometry(m(.28), 14, 10, 0, PI * 2, 0, PI / 2), Ms({ color: 0x4a3a24, roughness: .9 }), g, [0, .64, 0], null, [1, .5, 1.45]);
    const wh = mk(new THREE.TorusGeometry(m(.17), m(.05), 10, 24), MAT.rubber, g, [0, .2, .62], [0, PI / 2, 0]); g.userData.wheel = wh;
    for (const sx of [-1, 1]) { mk(cyl(.02, .02, 1.5, 8), MAT.steel, g, [sx * .26, .42, -.05], [PI / 2 + .2, 0, 0]); /* ujung belakang (gagang) lebih tinggi */ mk(cyl(.018, .018, .47, 6), MAT.steel, g, [sx * .26, .235, -.25]); }
    g.userData.grip = [new THREE.Vector3(m(-.26), m(.55), m(-.78)), new THREE.Vector3(m(.26), m(.55), m(-.78))];
    return g;
  }
  // Pasang gerobak ke karakter berpose 'push': gerobak jadi anak c.root, gagang tepat di genggaman (update tiap frame setelah c.act).
  function attachBarrow(c, wb) {
    c.root.add(wb); const hw = new THREE.Vector3(), ax = new THREE.Vector3(0, m(.2), m(.62)), d = { y: .35, z: -1.40 }, L = Math.hypot(d.y, d.z), al0 = Math.atan2(d.y, -d.z);
    return { update(roll = 0) { c.root.updateMatrixWorld(true); const hs = c.arms.map(a => c.root.worldToLocal(a.hand.getWorldPosition(hw.clone())));
        const mid = hs[0].clone().add(hs[1]).multiplyScalar(.5), h = mid.y / U;                 // tinggi genggaman (m)
        const b = Math.asin(Math.max(-1, Math.min(1, (h - .2) / L))) - al0;                       // sudut angkat gerobak di as roda
        const axZ = mid.z + m(L * Math.cos(al0 + b));                                              // as roda di depan genggaman
        wb.rotation.set(b, 0, 0); const axR = ax.clone().applyEuler(wb.rotation);
        wb.position.set(mid.x, m(.2) - axR.y, axZ - axR.z); wb.userData.wheel.rotation.x = roll; } };
  }
  // Balon penampung gas plastik (biogas) — volume vol m³, bisa menggembung: userData.setFill(0..1)
  function gasBalloon(parent, { x = 0, y = 0, z = 0, vol = 1 } = {}) {
    const g = new THREE.Group(); g.position.set(m(x), m(y), m(z)); parent.add(g);
    const L = 2.2, r = Math.sqrt(vol / (PI * L)) * 1.05;
    const bag = mk(new THREE.CapsuleGeometry(m(r), m(L - 2 * r), 10, 20), Ms({ color: 0xd9e3ea, roughness: .25, metalness: 0, transparent: true, opacity: .88 }), g, [0, r, 0], [0, 0, PI / 2]);
    mk(cyl(.03, .03, .3, 8), Ms({ color: 0xd9d9d9 }), g, [L / 2 + .1, r, 0], [0, 0, PI / 2]);
    g.userData.setFill = f => { const k = Math.max(.25, f); bag.scale.set(1, k, k); bag.position.y = m(r * k); };
    return g;
  }
  // Kompor biogas satu tungku + api biru (sprite) — userData.setFlame(0..1, t)
  function stove(parent, { x = 0, y = 0, z = 0 } = {}) {
    const g = new THREE.Group(); g.position.set(m(x), m(y), m(z)); parent.add(g);
    mk(box(.38, .08, .38, .02), MAT.dark, g, [0, .04, 0]); mk(cyl(.09, .1, .05, 20), MAT.steel, g, [0, .105, 0]);
    for (let i = 0; i < 4; i++) { const a = i * PI / 2 + PI / 4; mk(box(.02, .06, .14), MAT.dark, g, [Math.cos(a) * .12, .14, Math.sin(a) * .12], [0, -a, 0]); }
    const ft = ctex(64, 128, (c, w, h) => { const gr = c.createRadialGradient(32, 100, 2, 32, 90, 60); gr.addColorStop(0, 'rgba(225,245,255,1)'); gr.addColorStop(.3, 'rgba(90,160,255,.95)'); gr.addColorStop(.7, 'rgba(40,90,255,.45)'); gr.addColorStop(1, 'rgba(30,60,255,0)');
      c.fillStyle = gr; c.beginPath(); c.moveTo(32, 30); c.bezierCurveTo(52, 70, 54, 110, 32, 124); c.bezierCurveTo(10, 110, 12, 70, 32, 30); c.fill(); });
    const fl = []; for (let i = 0; i < 12; i++) { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: ft, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); g.add(sp); fl.push(sp); }
    const light = new THREE.PointLight(0x6aa8ff, 0, m(2), 1.5); light.position.set(0, m(.2), 0); g.add(light);
    g.userData.setFlame = (f, t = 0) => { fl.forEach((sp, i) => { const a = i / 12 * PI * 2; sp.visible = f > .02; sp.position.set(Math.cos(a) * m(.075), m(.13 + .03 * f), Math.sin(a) * m(.075)); const h = (.05 + .025 * Math.abs(Math.sin(t * 9 + i))) * f; sp.scale.set(m(.04), m(h), 1); }); light.intensity = 3 * f; };
    g.userData.setFlame(0); g.userData.panY = m(.17);
    return g;
  }
  // Tabung elpiji 3 kg (hijau melon) — tinggi ±0,4 m
  function lpg3kg(parent, { x = 0, y = 0, z = 0 } = {}) {
    const g = new THREE.Group(); g.position.set(m(x), m(y), m(z)); parent.add(g);
    const grn = Ms({ color: 0x7ccc3f, roughness: .45, metalness: .2 });
    mk(cyl(.135, .135, .24, 24), grn, g, [0, .2, 0]); mk(new THREE.SphereGeometry(m(.135), 24, 12, 0, PI * 2, 0, PI / 2), grn, g, [0, .32, 0]);
    mk(new THREE.SphereGeometry(m(.135), 24, 12, 0, PI * 2, PI / 2, PI / 2), grn, g, [0, .08, 0]);
    mk(cyl(.12, .13, .06, 24, true), grn, g, [0, .03, 0]); mk(cyl(.07, .07, .06, 16, true), grn, g, [0, .48, 0]); mk(cyl(.025, .025, .04, 10), MAT.steel, g, [0, .45, 0]);
    return g;
  }
  // Lampu gas/lampu bohlam teras — userData.setOn(0..1)
  function lamp(parent, { x = 0, y = 0, z = 0 } = {}) {
    const g = new THREE.Group(); g.position.set(m(x), m(y), m(z)); parent.add(g);
    const bm = Ms({ color: 0xf2f2ee, roughness: .2, emissive: 0xffe2a0, emissiveIntensity: 0 });
    mk(cyl(.01, .01, .4, 6), MAT.dark, g, [0, .2, 0]); mk(cyl(.05, .12, .1, 16, true), MAT.dark, g, [0, -.02, 0]); mk(new THREE.SphereGeometry(m(.07), 16, 12), bm, g, [0, -.1, 0]);
    const l = new THREE.PointLight(0xffd79a, 0, m(6), 1.6); l.position.set(0, m(-.15), 0); g.add(l);
    g.userData.setOn = f => { bm.emissiveIntensity = 2.4 * f; l.intensity = 30 * f; };
    return g;
  }


  /* ---------- PENERBANGAN & KILANG (16 Nov 2026, video jelantah-pesawat) ---------- */
  // Pesawat lorong tunggal kelas A320 (generik, TANPA logo/livery maskapai): panjang 37,6 m, bentang 35,8 m, tinggi 11,8 m.
  // Hidung menghadap +z, roda di y=0. userData.fuelPort = titik isi bahan bakar di bawah sayap kanan (lokal, unit scene).
  function airliner(parent, { x = 0, z = 0, ry = 0, body = 0xf4f6f8, accent = 0x2f6bd6 } = {}) {
    const g = new THREE.Group(); g.position.set(m(x), 0, m(z)); g.rotation.y = ry; parent.add(g);
    const skin = Ms({ color: body, roughness: .35, metalness: .25 }), grey = Ms({ color: 0xb9bfc6, roughness: .4, metalness: .5 }), acc = Ms({ color: accent, roughness: .4, metalness: .2 });
    const win = Ms({ color: 0x1c2733, roughness: .2, metalness: .4 });
    const R = 1.98, CY = 3.75; // jari-jari & tinggi sumbu badan
    // badan: profil lathe (z = sepanjang badan), hidung bulat, ekor mengecil
    const prof = [[0, -18.8], [.55, -18.6], [1.0, -17.6], [1.45, -15.6], [1.85, -12.6], [R, -10], [R, 13.2], [1.9, 15.2], [1.62, 16.8], [1.15, 18.0], [.6, 18.6], [0, 18.85]];
    const lg = new THREE.LatheGeometry(prof.map(([r, zz]) => new THREE.Vector2(m(r), m(zz))), 40); lg.rotateX(PI / 2); // sumbu lathe (y) → z, hidung ke +z
    const fus = mk(lg, skin, g, [0, CY, 0]); fus.scale.set(1, 1.04, 1);
    // ekor naik: bagian belakang dibentuk ulang (titik z<-10 diangkat sebanding jarak)
    { const q = lg.attributes.position; for (let i = 0; i < q.count; i++) { const zz = q.getZ(i) / U; if (zz < -10) { const k = (-10 - zz) / 8.8; q.setY(i, q.getY(i) * (1 - .55 * k) + m(1.3 * k * k)); } } q.needsUpdate = true; lg.computeVertexNormals(); }
    // garis aksen tipis di kedua sisi (bukan logo)
    for (const sx of [-1, 1]) { const st = mk(box(.02, .22, 23), acc, g, [sx * (R * 1.0 + .005), CY - .55, 0]); st.castShadow = false; }
    // jendela penumpang
    for (const sx of [-1, 1]) for (let i = 0; i < 30; i++) { const w = mk(box(.04, .32, .22, .05), win, g, [sx * (R + .01), CY + .32, -10.2 + i * .79]); w.castShadow = false; }
    // pintu
    for (const sx of [-1, 1]) for (const zz of [11.6, -11.2]) { const d = mk(box(.03, 1.85, .82), Ms({ color: 0xdfe3e7, roughness: .4 }), g, [sx * (R + .012), CY - .1, zz]); d.castShadow = false; }
    // kaca kokpit
    // kaca kokpit = pita tipis mengikuti lengkung hidung (lathe sebagian, r +0,8%) — menempel, tidak menonjol
    const rAt = zz => { for (let i = 1; i < prof.length; i++) if (zz <= prof[i][1]) { const [r0, z0] = prof[i - 1], [r1, z1] = prof[i]; return r0 + (r1 - r0) * (zz - z0) / (z1 - z0); } return 0; };
    const band = (z0, z1, a0, al) => { const pts = []; for (let k = 0; k <= 6; k++) { const zz = z0 + (z1 - z0) * k / 6; pts.push(new THREE.Vector2(m(rAt(zz) * 1.008), m(zz))); }
      const bg = new THREE.LatheGeometry(pts, 24, a0, al); bg.rotateX(PI / 2); const o = mk(bg, Ms({ color: 0x1c2733, roughness: .2, metalness: .4, side: THREE.DoubleSide }), g, [0, CY, 0]); o.scale.y = 1.04; o.castShadow = false; return o; };
    band(16.05, 16.75, PI - .62, 1.24); band(15.55, 16.35, PI - 1.08, .38); band(15.55, 16.35, PI + .70, .38);
    // sayap rendah: denah trapesium sapuan 25°, dihedral 5°
    const wingShape = new THREE.Shape([[0, 0], [17, -7.6], [17, -9.0], [0, -6.1]].map(([a, b]) => new THREE.Vector2(m(a), m(b))));
    for (const sx of [-1, 1]) {
      const wg = new THREE.ExtrudeGeometry(wingShape, { depth: m(.34), bevelEnabled: true, bevelThickness: m(.06), bevelSize: m(.06), bevelSegments: 2 }); wg.rotateX(PI / 2);
      const w = mk(wg, skin, g, [sx * 1.4, CY - 1.15, 2.6]); w.scale.x = sx; w.rotation.z = sx * .087;
      mk(box(.12, 2.4, 1.2), skin, g, [sx * 18.3, CY - 1.15 + 1.6 + 1.0, -5.9], [0, 0, sx * -.1]); // sharklet
      // mesin turbofan + pylon
      const ex = sx * 5.75, ey = 1.55, ez = 4.3;
      const nac = mk(new THREE.CylinderGeometry(m(1.0), m(.86), m(4.4), 32, 1, true), skin, g, [ex, ey, ez], [PI / 2, 0, 0]); nac.material = Ms({ color: body, roughness: .35, metalness: .3, side: THREE.DoubleSide });
      mk(new THREE.TorusGeometry(m(.97), m(.07), 10, 32), grey, g, [ex, ey, ez + 2.2]);
      mk(new THREE.CircleGeometry(m(.92), 32), Ms({ color: 0x3a3f46, roughness: .5, metalness: .6 }), g, [ex, ey, ez + 1.85]);
      mk(new THREE.ConeGeometry(m(.28), m(.5), 16), grey, g, [ex, ey, ez + 2.05], [PI / 2, 0, 0]);
      mk(new THREE.CylinderGeometry(m(.55), m(.38), m(1.2), 24), grey, g, [ex, ey, ez - 2.7], [PI / 2, 0, 0]);
      mk(box(.35, .6, 4.0), skin, g, [ex, ey + .95, ez - 2.7]);
    }
    // ekor tegak & horizontal
    const fin = new THREE.Shape([[0, 0], [5.6, 0], [7.6, 6.2], [5.4, 6.2]].map(([a, b]) => new THREE.Vector2(m(a), m(b))));
    const fg = new THREE.ExtrudeGeometry(fin, { depth: m(.3), bevelEnabled: false }); fg.translate(0, 0, -m(.15)); fg.rotateY(PI / 2);
    mk(fg, acc, g, [0, CY + 1.3, -12.4]);
    const hs = new THREE.Shape([[0, 0], [6.2, -2.6], [6.2, -3.6], [0, -3.9]].map(([a, b]) => new THREE.Vector2(m(a), m(b))));
    for (const sx of [-1, 1]) { const hg = new THREE.ExtrudeGeometry(hs, { depth: m(.18), bevelEnabled: false }); hg.rotateX(PI / 2); const h = mk(hg, skin, g, [sx * .6, CY + .75, -13.3]); h.scale.x = sx; h.rotation.z = sx * .1; }
    // roda pendarat (ban menyentuh y=0)
    const tire = MAT.rubber, gear = []; g.userData.gear = gear;
    gear.push(mk(cyl(.1, .1, 2.6, 10), grey, g, [0, 1.45, 13.6]));
    for (const sx of [-1, 1]) gear.push(mk(cyl(.37, .37, .24, 20), tire, g, [sx * .2, .37, 13.6], [0, 0, PI / 2]));
    for (const sx of [-1, 1]) { gear.push(mk(cyl(.15, .15, 2.4, 10), grey, g, [sx * 3.8, 1.65, .3]));
      for (const dz of [-.55, .55]) gear.push(mk(cyl(.58, .58, .38, 24), tire, g, [sx * 3.8, .58, .3 + dz], [0, 0, PI / 2])); }
    g.userData.fuelPort = new THREE.Vector3(m(8.5), m(CY - .93), m(-1.2)); // panel isi bahan bakar di bawah sayap kanan
    g.userData.CY = CY;
    return g;
  }
  // Truk tangki pengisi avtur (refueler) generik, panjang ±10 m, menghadap +z. userData.hoseOut = ujung selang (lokal).
  function tankTruck(parent, { x = 0, z = 0, ry = 0, tank = 0xeef1f3, stripe = 0xd23a2a, cab = 0xf2f4f5 } = {}) {
    const g = new THREE.Group(); g.position.set(m(x), 0, m(z)); g.rotation.y = ry; parent.add(g);
    mk(box(2.4, .4, 9.4), MAT.dark, g, [0, .9, 0]);
    mk(box(2.45, 2.5, 2.2, .25), Ms({ color: cab, roughness: .4 }), g, [0, 2.15, 3.6]);
    mk(box(2.2, .9, .06), MAT.glass, g, [0, 2.75, 4.72]);
    for (const sx of [-1, 1]) mk(box(.06, .8, 1.1), MAT.glass, g, [sx * 1.23, 2.7, 3.8]);
    const tk = mk(new THREE.CapsuleGeometry(m(1.15), m(5.4), 8, 24), Ms({ color: tank, roughness: .3, metalness: .5 }), g, [0, 2.3, -1.6], [PI / 2, 0, 0]); tk.scale.set(1.05, 1, .92);
    for (const sx of [-1, 1]) mk(box(.02, .3, 7.2), Ms({ color: stripe, roughness: .5 }), g, [sx * 1.215, 2.2, -1.6]);
    for (const zz of [3.4, -1.0, -2.4, -3.8]) for (const sx of [-1, 1]) mk(cyl(.5, .5, .38, 20), MAT.rubber, g, [sx * 1.1, .5, zz], [0, 0, PI / 2]);
    mk(box(1.6, 1.4, .9), MAT.steel, g, [0, 1.6, -4.9]); // lemari pompa & gulungan selang di belakang
    mk(cyl(.45, .45, .6, 20), MAT.dark, g, [0, 1.6, -5.45], [0, 0, PI / 2]);
    g.userData.hoseOut = new THREE.Vector3(m(1.25), m(1.5), m(-4.6));
    return g;
  }
  // Tangki timbun kilang (atap kerucut, tangga putar disederhanakan jadi tangga lurus + pagar atap)
  function storageTank(parent, { x = 0, z = 0, r = 12, h = 14, color = 0xf1f2ee } = {}) {
    const g = new THREE.Group(); g.position.set(m(x), 0, m(z)); parent.add(g);
    mk(cyl(r, r, h, 48), Ms({ color, roughness: .45, metalness: .35 }), g, [0, h / 2, 0]);
    mk(new THREE.ConeGeometry(m(r * 1.01), m(r * .18), 48), Ms({ color, roughness: .45, metalness: .35 }), g, [0, h + r * .09, 0]);
    mk(cyl(r + .4, r + .5, .3, 48), MAT.concrete, g, [0, .15, 0]);
    for (let i = 0; i < 3; i++) mk(new THREE.TorusGeometry(m(r + .02), m(.06), 6, 48), Ms({ color: 0xc9ccc6, roughness: .5, metalness: .4 }), g, [0, h * (i + 1) / 4, 0], [PI / 2, 0, 0]);
    mk(box(.8, h, .1), MAT.steel, g, [0, h / 2, r + .15]);
    return g;
  }
  // Jerigen plastik 5 L (putih susu, isi cokelat samar) — ±19×13×27 cm, gagang di atas sepanjang X, mulut tutup biru.
  // grip:true → origin = pusat gagang (untuk c.hold), badan di -Y. userData.mouth = mulut (lokal) untuk aliran tuang.
  function jerrycan(parent, { x = 0, y = 0, z = 0, ry = 0, fill = .7, grip = false } = {}) {
    const g = new THREE.Group(); g.position.set(m(x), m(y), m(z)); g.rotation.y = ry; if (parent) parent.add(g);
    const b = new THREE.Group(); g.add(b); const plast = Ms({ color: 0xf1efe6, roughness: .55, transparent: true, opacity: .85 });
    mk(box(.19, .25, .13, .03), plast, b, [0, .125, 0]);
    mk(box(.17, .23 * fill, .11, .02), Ms({ color: 0x5a3a14, roughness: .3 }), b, [0, .012 + .115 * fill, 0]);
    mk(cyl(.035, .042, .03, 16), plast, b, [.06, .262, 0]); mk(cyl(.022, .022, .03, 12), Ms({ color: 0x2f6bd6, roughness: .5 }), b, [.06, .29, 0]);
    for (const xx of [-.075, .015]) mk(box(.02, .055, .03, .008), plast, b, [xx, .275, 0]);
    mk(cyl(.011, .011, .11, 12), plast, b, [-.03, .3, 0], [0, 0, PI / 2]);
    if (grip) b.position.set(m(.03), -m(.3), 0);
    g.userData.mouth = new THREE.Vector3(m(.06) + b.position.x, m(.305) + b.position.y, 0);
    return g;
  }
  // Botol plastik bening 600 mL berisi jelantah (cokelat) — tinggi 22 cm, Ø 6,4 cm (muat di genggaman). Untuk c.hold: badan botol sepanjang X lokal,
  // origin = titik genggam (tengah badan), mulut di +X. userData.mouth = ujung mulut (lokal).
  function oilBottle({ fill = .7, cap = false } = {}) {
    const g = new THREE.Group(), b = new THREE.Group(); g.add(b); b.rotation.z = -PI / 2; // sumbu botol (Y) → +X
    const pet = Ms({ color: 0xd9c9a6, roughness: .08, transparent: true, opacity: .42, depthWrite: false });
    mk(cyl(.032, .032, .15, 24), pet, b, [0, -.005, 0]); mk(new THREE.SphereGeometry(m(.032), 24, 10, 0, PI * 2, 0, PI / 2), pet, b, [0, .07, 0], null, [1, 1.1, 1]);
    mk(cyl(.012, .012, .03, 16), pet, b, [0, .115, 0]);
    if (cap) mk(cyl(.014, .014, .018, 16), Ms({ color: 0xd23a2a }), b, [0, .135, 0]);
    g.userData.oil = mk(cyl(.029, .029, .14 * fill, 24), Ms({ color: 0x6a4212, roughness: .2 }), b, [0, -.075 + .07 * fill, 0]);
    g.userData.mouth = new THREE.Vector3(m(.13), 0, 0);
    return g;
  }
  return { MAT, airliner, tankTruck, storageTank, jerrycan, oilBottle, cow, barn, digester, wheelbarrow, attachBarrow, gasBalloon, stove, lpg3kg, lamp, sun, ground, road, paving, sea, house, houseRow, chimney, pipe, garbageTruck, tree, skiSlope, skiGear, climbingWall, placeClimber, pylons, PO };
}
