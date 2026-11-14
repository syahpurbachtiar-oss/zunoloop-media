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

  return { MAT, sun, ground, road, paving, sea, house, houseRow, chimney, pipe, garbageTruck, tree, skiSlope, skiGear, climbingWall, placeClimber, pylons, PO };
}
