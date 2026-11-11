// ZunoLoop mascot kit v2 — keluarga 3D semi-realistis (PBR: kulit, kain, karet, rambut berserat) (gaya film animasi), berbasis foto Ari.
// Pakai: import {makeCast} from './kit/mascot.js';  const C=makeCast(THREE,RoundedBoxGeometry);
//        scene.add(C.ayah.root); C.ayah.root.position.set(x,0,z); C.ayah.root.scale.setScalar(s);
//        tiap frame: C.ayah.act('wave', detikSejakMulai, 'happy');
// Skala dunia nyata: C.M = unit per meter (ayah 1,70 m). Tinggi: ayah 1,70 · ibu 1,55 · orang 1,68 · kakak 1,25 · adik 1,0 m. Kaki di y=0, menghadap +z.
// Peran: ayah (kamu), ibu, kakak, adik, orang (dewasa generik: penerima/petugas/orang asing/penyadap — jangan jadikan anggota keluarga penjahat).
// Mata menatap kamera otomatis (makeCast(THREE,RBG,cam)) atau isi c.gaze = Vector3 dunia benda yang dibahas.
// Aksi: idle, walk, wave, point, think, shock, celebrate, facepalm, present, hold, crouch
// Ekspresi: normal, happy, shock, worried, think, wink
// Kepala: C.ayah.head (Object3D) — pakai head.localToWorld(new THREE.Vector3(0, 12, 0)) untuk posisi emote.

export function makeCast(THREE, RBG, cam) { // cam opsional: mata otomatis menatap kamera kecuali c.gaze diisi
  const V = (x, y, z) => new THREE.Vector3(x, y, z);
  const mk = (g, mat, parent, pos, rot, sc) => { const o = new THREE.Mesh(g, mat); o.castShadow = o.receiveShadow = true;
    if (pos) o.position.set(...pos); if (rot) o.rotation.set(...rot); if (sc) o.scale.set(...sc); parent.add(o); return o; };
  const sph = (r, ws = 32, hs = 24) => new THREE.SphereGeometry(r, ws, hs);
  const cap = (r, l) => new THREE.CapsuleGeometry(r, l, 10, 24);
  const taper = (r1, r2, h) => new THREE.CylinderGeometry(r1, r2, h, 28, 1);
  let seed = 11; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

  /* ---------- tekstur kain (noise + serat) ---------- */
  const texCache = {};
  function fabric(hex, kind = 'cotton') {
    const key = hex + kind; if (texCache[key]) return texCache[key];
    const cv = document.createElement('canvas'); cv.width = cv.height = 256; const x = cv.getContext('2d');
    x.fillStyle = '#808080'; x.fillRect(0, 0, 256, 256);
    if (kind === 'denim') { for (let i = 0; i < 256; i += 2) { x.strokeStyle = `rgba(255,255,255,${.05 + rnd() * .08})`; x.beginPath(); x.moveTo(i, 0); x.lineTo(i + 64, 256); x.stroke(); } }
    if (kind === 'rib') { for (let i = 0; i < 256; i += 8) { x.fillStyle = 'rgba(0,0,0,.18)'; x.fillRect(i, 0, 3, 256); } }
    if (kind === 'puffer') { for (let i = 0; i < 256; i += 64) { x.fillStyle = 'rgba(0,0,0,.25)'; x.fillRect(0, i, 256, 4); } }
    for (let i = 0; i < 2600; i++) { const v = 100 + rnd() * 60 | 0; x.fillStyle = `rgba(${v},${v},${v},.35)`; x.fillRect(rnd() * 256, rnd() * 256, 1 + rnd() * 2, 1 + rnd() * 2); }
    const t = new THREE.CanvasTexture(cv); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(2, 2); texCache[key] = t; return t;
  }
  const cloth = (c, kind = 'cotton', r = .82) => new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: 0, bumpMap: fabric(c, kind), bumpScale: kind === 'denim' ? .35 : .2 });
  const skinMat = c => new THREE.MeshPhysicalMaterial({ color: c, roughness: .52, metalness: 0, sheen: .4, sheenRoughness: .6, sheenColor: new THREE.Color(0xffc9a8), clearcoat: .05 });
  const strands = (() => { const cv = document.createElement('canvas'); cv.width = cv.height = 256; const x = cv.getContext('2d'); x.fillStyle = '#808080'; x.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 900; i++) { const v = rnd() > .5 ? 200 : 40, X = rnd() * 256, Y = rnd() * 256; x.strokeStyle = `rgba(${v},${v},${v},.35)`; x.lineWidth = 1 + rnd() * 1.5;
      x.beginPath(); x.moveTo(X, Y); x.quadraticCurveTo(X + 6, Y + 30, X + 2, Y + 60); x.stroke(); }
    const t = new THREE.CanvasTexture(cv); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(3, 2); return t; })();
  const hairMat = c => new THREE.MeshPhysicalMaterial({ color: c, roughness: .5, metalness: 0, sheen: .8, sheenColor: new THREE.Color(0x4a3a30), sheenRoughness: .35, bumpMap: strands, bumpScale: .9 });
  const rubber = (c, r = .28) => new THREE.MeshPhysicalMaterial({ color: c, roughness: r, metalness: 0, clearcoat: .6, clearcoatRoughness: .25 });
  const plain = (c, r = .5, m = 0) => new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: m });

  /* ---------- decal (emblem ZunoLoop, gambar dino) ---------- */
  function decal(draw) { const cv = document.createElement('canvas'); cv.width = cv.height = 256; draw(cv.getContext('2d'));
    const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace;
    return new THREE.MeshStandardMaterial({ map: t, transparent: true, roughness: .75, polygonOffset: true, polygonOffsetFactor: -2 }); }
  const EMBLEM = decal(x => { x.fillStyle = '#123a6b'; x.beginPath(); x.arc(128, 128, 118, 0, 7); x.fill();
    x.strokeStyle = '#f3e6c4'; x.lineWidth = 10; x.beginPath(); x.arc(128, 128, 110, 0, 7); x.stroke();
    x.strokeStyle = '#ffd23f'; x.lineWidth = 15; x.beginPath(); x.arc(128, 128, 80, -2.6, 2.2); x.stroke();
    x.fillStyle = '#ffd23f'; x.beginPath(); x.moveTo(172, 182); x.lineTo(206, 190); x.lineTo(182, 218); x.fill();
    x.font = '900 120px Inter, Arial, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = '#fff'; x.fillText('Z', 128, 134); });
  const dino = (body, belly) => decal(x => { x.fillStyle = body; x.beginPath(); x.ellipse(120, 150, 80, 52, -.2, 0, 7); x.fill();
    x.beginPath(); x.ellipse(196, 92, 46, 34, .2, 0, 7); x.fill(); x.fillRect(40, 170, 30, 50); x.fillRect(150, 180, 30, 46);
    x.beginPath(); x.moveTo(50, 140); x.lineTo(4, 120); x.lineTo(52, 170); x.fill();
    x.fillStyle = belly; x.beginPath(); x.ellipse(130, 165, 46, 26, -.2, 0, 7); x.fill();
    x.fillStyle = '#ffd23f'; x.fillRect(180, 76, 60, 18); x.fillStyle = '#222'; x.fillRect(184, 80, 22, 10); x.fillRect(212, 80, 22, 10);
    x.fillStyle = '#fff'; for (let i = 0; i < 5; i++) { x.beginPath(); x.moveTo(176 + i * 12, 112); x.lineTo(182 + i * 12, 124); x.lineTo(188 + i * 12, 112); x.fill(); } });

  /* ---------- kepala: tengkorak, rahang, hidung, telinga, mata 3D, kelopak, alis, mulut ---------- */
  function buildHead(s, k, parent) {
    const R = 7.2 * k * (s.headK || 1), head = new THREE.Group(); parent.add(head);
    const skin = skinMat(s.skin);
    const g = sph(R, 64, 48), p = g.attributes.position, v = new THREE.Vector3();
    for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); const ny = v.y / R;
      let sx = 1, sz = 1; if (ny < 0) { const j = -ny; sx = 1 - .28 * j * j; sz = 1 - .12 * j; }
      if (ny > .4) sz *= 1 + .04 * (ny - .4);
      v.x *= sx * .94; v.z *= sz; v.y *= 1.1; if (v.z > 0 && ny < -.15 && ny > -.75) v.z += .25 * k * Math.sin((-ny - .15) / .6 * Math.PI);
      p.setXYZ(i, v.x, v.y, v.z); }
    g.computeVertexNormals(); mk(g, skin, head);
    const zF = R * .9;
    mk(sph(R * .17, 20, 16), skin, head, [0, -R * .12, zF + R * .05], null, [1, 1.15, 1.1]);
    for (const sd of [-1, 1]) mk(sph(R * .085, 14, 10), skin, head, [sd * R * .11, -R * .2, zF + R * .02]);
    for (const sd of [-1, 1]) mk(sph(R * .22, 18, 14), skin, head, [sd * R * .93, -R * .02, -R * .05], [0, sd * .5, 0], [.45, 1, .8]);
    const eyes = [], white = plain(0xf7f4ef, .12), iris = plain(s.iris || 0x3b2416, .2), pup = plain(0x0a0605, .1), gl = plain(0xffffff, .05);
    for (const sd of [-1, 1]) {
      const eg = new THREE.Group(); eg.position.set(sd * R * .36, R * .08, zF - R * .12); head.add(eg);
      const er = R * .2; mk(sph(er, 28, 20), white, eg);
      const look = new THREE.Group(); eg.add(look);
      mk(new THREE.CircleGeometry(er * .62, 28), iris, look, [0, 0, er * .985]);
      mk(new THREE.CircleGeometry(er * .32, 24), pup, look, [0, 0, er * .99]);
      mk(sph(er * .13, 10, 8), gl, look, [-er * .22, er * .25, er * .97]);
      const up = new THREE.Group(); eg.add(up); mk(new THREE.SphereGeometry(er * 1.07, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2), skin, up);
      mk(new THREE.TorusGeometry(er * 1.07, er * .07, 6, 28, Math.PI), plain(0x15100d, .6), up);
      const lo = new THREE.Group(); eg.add(lo); mk(new THREE.SphereGeometry(er * 1.06, 28, 14, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), skin, lo);
      eyes.push({ eg, look, up, lo, sd, er });
    }
    const brows = [-1, 1].map(sd => { const b = new THREE.Group(); b.position.set(sd * R * .37, R * .4, zF - R * .03); head.add(b);
      mk(cap(R * .05, R * .3), hairMat(s.brow || 0x1a1410), b, null, [0, 0, Math.PI / 2 + sd * .08]); return b; });
    // ---- mulut v3 (revisi 11 Nov 2026): bentuk pipih yang MENEMPEL & mengikuti lengkung wajah, warna dari kulit,
    //      ujung bibir meruncing ke 0 (bukan tabung merah yang menonjol seperti "cabai") ----
    const surfZ = yy => { let z = -1e9; for (let i = 0; i < p.count; i++) { const px = p.getX(i), py = p.getY(i);
        if (Math.abs(px) < R * .07 && Math.abs(py - yy) < R * .07) z = Math.max(z, p.getZ(i)); } return z; };
    const MY = -R * .5, mz = surfZ(MY), slope = (surfZ(MY + R * .12) - surfZ(MY - R * .12)) / (R * .24);
    const mouth = new THREE.Group(); mouth.position.set(0, MY, mz + R * .03); mouth.rotation.x = Math.atan(slope); head.add(mouth);
    const RX = R * .78; // jari-jari lengkung horizontal wajah di ketinggian mulut
    const bend = g => { const q = g.attributes.position; for (let i = 0; i < q.count; i++) q.setZ(i, q.getZ(i) - q.getX(i) * q.getX(i) / (2 * RX)); q.needsUpdate = true; g.computeVertexNormals(); return g; };
    const flat = (c, r = .55) => new THREE.MeshStandardMaterial({ color: c, roughness: r, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4 });
    const lipC = new THREE.Color(s.skin).lerp(new THREE.Color(0x9a3f36), .42).multiplyScalar(.82);
    const lip = flat(lipC, .5), dark = flat(0x3b1714, .8), teeth = new THREE.MeshBasicMaterial({ color: 0xf7f2ea, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4 }), tongue = flat(0xc0605d, .6);
    const layer = (shape, mat, parent, z = 0, seg = 24) => { const m = new THREE.Mesh(bend(new THREE.ShapeGeometry(shape, seg)), mat); m.position.z = z; m.renderOrder = 2; parent.add(m); return m; };
    // bulan sabit meruncing: tepi atas (-w,0)→(0,-d1)→(w,0), tepi bawah kembali lewat (0,-d2)
    const crescent = (w, d1, d2, y0 = 0) => { const sh = new THREE.Shape(); sh.moveTo(-w, y0); sh.quadraticCurveTo(0, y0 - d1 * 2, w, y0); sh.quadraticCurveTo(0, y0 - d2 * 2, -w, y0); return sh; };
    const M = {};
    M.normal = new THREE.Group(); layer(crescent(R * .25, R * .05, R * .16), flat(lipC.clone().multiplyScalar(.5), .5), M.normal);
    M.worried = new THREE.Group(); layer(crescent(R * .16, -R * .045, -R * .08, -R * .03), lip, M.worried);
    M.think = new THREE.Group(); { const sh = new THREE.Shape(); sh.moveTo(-R * .1, R * .01); sh.quadraticCurveTo(R * .03, R * .03, R * .15, -R * .025); sh.quadraticCurveTo(R * .03, -R * .02, -R * .1, R * .01);
      layer(sh, lip, M.think).position.x = R * .03; }
    M.happy = new THREE.Group(); {
      const w = R * .27, top = R * .02, bot = R * .3;
      const open = new THREE.Shape(); open.moveTo(-w, top); open.quadraticCurveTo(0, top - R * .05, w, top); open.quadraticCurveTo(w * .85, -bot * .9, 0, -bot); open.quadraticCurveTo(-w * .85, -bot * .9, -w, top);
      layer(open, dark, M.happy, 0).material.depthWrite = false;
      const tb = new THREE.Shape(); tb.moveTo(-w * .82, top - R * .015); tb.quadraticCurveTo(0, top - R * .06, w * .82, top - R * .015); tb.lineTo(w * .7, -R * .07); tb.quadraticCurveTo(0, -R * .1, -w * .7, -R * .07); tb.closePath();
      layer(tb, teeth, M.happy, R * .008).renderOrder = 4;
      const tg = new THREE.Shape(); tg.absellipse(0, -bot * .72, w * .48, bot * .22, 0, Math.PI * 2); layer(tg, tongue, M.happy, R * .008).renderOrder = 3;
      layer(crescent(w * 1.04, R * .0, R * .03, top + R * .012), lip, M.happy, R * .016).renderOrder = 5;           // bibir atas tipis
      const ob = bot + R * .045, lo = new THREE.Shape(); lo.moveTo(-w, top); lo.quadraticCurveTo(-w * .85, -ob * .95, 0, -ob); lo.quadraticCurveTo(w * .85, -ob * .95, w, top);
      lo.quadraticCurveTo(w * .85, -bot * .9, 0, -bot); lo.quadraticCurveTo(-w * .85, -bot * .9, -w, top);
      layer(lo, lip, M.happy, R * .016).renderOrder = 5;                                                             // bibir bawah tipis, meruncing ke sudut
    }
    M.shock = new THREE.Group(); { const o = new THREE.Shape(); o.absellipse(0, -R * .08, R * .11, R * .15, 0, Math.PI * 2); layer(o, dark, M.shock);
      const ring = new THREE.Shape(); ring.absellipse(0, -R * .08, R * .135, R * .18, 0, Math.PI * 2); const hole = new THREE.Path(); hole.absellipse(0, -R * .08, R * .11, R * .15, 0, Math.PI * 2, true); ring.holes.push(hole);
      layer(ring, lip, M.shock, R * .002); }
    for (const kx in M) { mouth.add(M[kx]); M[kx].visible = kx === 'normal'; }
    const blush = new THREE.MeshBasicMaterial({ color: 0xff8a80, transparent: true, opacity: .18, depthWrite: false });
    for (const sd of [-1, 1]) { const b = new THREE.Mesh(new THREE.CircleGeometry(R * .16, 20), blush); b.position.set(sd * R * .5, -R * .25, zF - R * .2); b.rotation.y = sd * .5; head.add(b); }
    return { head, R, eyes, brows, mouth, M, zF };
  }

  function setExpr(H, ex, blink, t) {
    // [buka kelopak atas (- = lebih lebar), -, angkat kelopak bawah, angkat alis]
    const E = { normal: [.14, 0, .12, 0], happy: [.15, 0, .45, .06], wink: [.15, 0, .45, .06], shock: [-.4, 0, -.1, .22],
      worried: [.2, 0, .1, -.04], think: [.3, 0, 0, .04] }[ex] || [0, 0, 0, 0];
    H.eyes.forEach(e => { let upA = E[0] + (blink ? 1.3 : 0); if (ex === 'wink' && e.sd > 0) upA = 1.35;
      const closed = blink || (ex === 'wink' && e.sd > 0);
      e.up.rotation.x = closed ? 1.52 : -.8 + upA * 1.6; e.lo.rotation.x = closed ? .25 : .85 - E[2] * 1.1;
      e.look.visible = !closed; e.eg.children[0].visible = !closed;
      if (ex === 'think') e.look.rotation.set(-.25, .2, 0);
      else if (H.gazeDir) e.look.rotation.set(H.gazeDir[e.sd > 0 ? 1 : 0][0], H.gazeDir[e.sd > 0 ? 1 : 0][1], 0);
      else e.look.rotation.set(0, Math.sin(t * .7) * .06, 0); });
    H.brows.forEach(b => { b.position.y = H.R * (.4 + E[3] * 2); const r = b.position.x > 0 ? 1 : -1;
      b.rotation.z = r * (ex === 'worried' ? .28 : ex === 'think' ? -.14 : ex === 'shock' ? -.06 : 0); });
    const key = ex === 'wink' ? 'happy' : ex; for (const kx in H.M) H.M[kx].visible = kx === (H.M[key] ? key : 'normal');
  }

  /* ---------- rambut / hijab ---------- */
  function hair(s, H) {
    const hm = hairMat(s.hair), R = H.R, h = H.head;
    if (s.hairStyle === 'side' || s.hairStyle === 'short') {
      // massa rambut atas (sedikit tebal & bervolume), belakang, samping menutupi pelipis
      mk(new THREE.SphereGeometry(R * 1.07, 56, 36, 0, Math.PI * 2, 0, Math.PI * .5), hm, h, [0, R * .3, -R * .1], [-.32, 0, 0], [1.0, 1.0, 1.05]);
      mk(new THREE.SphereGeometry(R * 1.04, 48, 28, Math.PI * .2, Math.PI * .6, Math.PI * .35, Math.PI * .42), hm, h, [0, R * .04, -R * .05], [0, Math.PI, 0]);
      for (const sd of [-1, 1]) mk(sph(R * .42, 24, 18), hm, h, [sd * R * .8, R * .32, R * .02], [0, 0, sd * .2], [.42, .85, 1.25]);
      if (s.hairStyle === 'side') { // poni tebal menyapu dari belahan kiri ke kanan
        mk(sph(R * .62, 32, 20), hm, h, [R * .1, R * .72, R * .52], [.7, .1, -.25], [1.6, .5, .95]);
        mk(sph(R * .45, 28, 18), hm, h, [-R * .5, R * .86, R * .36], [.4, 0, .3], [1.1, .6, 1.1]);
        mk(sph(R * .36, 24, 16), hm, h, [R * .66, R * .56, R * .5], [.7, 0, -.65], [1.25, .45, .85]);
      } else { mk(sph(R * .55, 28, 18), hm, h, [0, R * .6, R * .5], [.6, 0, 0], [1.7, .45, .85]); }
    } else if (s.hairStyle === 'cap') {
      for (const sd of [-1, 1]) mk(sph(R * .4, 24, 18), hm, h, [sd * R * .8, R * .18, -R * .02], [0, 0, sd * .2], [.4, .7, 1.2]);
      mk(new THREE.SphereGeometry(R * 1.05, 40, 24, Math.PI * .2, Math.PI * .6, Math.PI * .4, Math.PI * .35), hm, h, [0, 0, -R * .05], [0, Math.PI, 0]);
      const cm = cloth(s.capColor || 0x2c3e66, 'cotton', .85);
      mk(new THREE.SphereGeometry(R * 1.08, 48, 24, 0, Math.PI * 2, 0, Math.PI * .5), cm, h, [0, R * .32, -R * .04], [-.12, 0, 0], [1, .82, 1.04]);
      mk(new THREE.CylinderGeometry(R * .62, R * .62, R * .06, 32, 1, false, -Math.PI / 2, Math.PI), cm, h, [0, R * .38, R * .72], [.18, 0, 0], [1, 1, 1.25]);
      mk(sph(R * .09, 12, 8), cm, h, [0, R * 1.18, -R * .04]);
    } else if (s.hairStyle === 'hijab') {
      const hj = cloth(s.hair, 'cotton', .92); hj.side = THREE.DoubleSide;
      const shell = new THREE.SphereGeometry(R * 1.16, 48, 32, 0, Math.PI * 2, 0, Math.PI * .8);
      const gp = shell.attributes.position, idx = shell.index.array, keep = [];
      for (let i = 0; i < idx.length; i += 3) { let face = true; for (let j = 0; j < 3; j++) { const a = idx[i + j], z = gp.getZ(a), y = gp.getY(a), x = gp.getX(a);
          if (!(z > R * .5 && y < R * .58 && y > -R * 1.0 && Math.abs(x) < R * .8)) face = false; } if (!face) keep.push(idx[i], idx[i + 1], idx[i + 2]); }
      shell.setIndex(keep); shell.computeVertexNormals(); mk(shell, hj, h, [0, R * .06, -R * .02], null, [1, 1.08, 1]);
      mk(new THREE.TorusGeometry(R * .9, R * .09, 12, 48, Math.PI * 1.15), hj, h, [0, -R * .02, R * .55], [0, 0, -Math.PI * .075], [1, 1.15, 1]);
      H.drape = hj;
    }
  }

  /* ---------- tangan dengan jari ---------- */
  // tangan v2: jari & ibu jari bersendi (pangkal + ruas ujung) supaya bisa menggenggam HP secara natural tanpa menembus
  function hand(skin, k, parent, sd) {
    const g = new THREE.Group(); parent.add(g);
    mk(new RBG(3.4 * k, 3.8 * k, 1.8 * k, 4, .8 * k), skin, g, [0, -1.6 * k, 0]);
    const fingers = [];
    for (let i = 0; i < 4; i++) { const len = (i === 0 || i === 3 ? .8 : 1) * k;
      const base = new THREE.Group(); base.position.set((-1.2 + i * .8) * k, -3.4 * k, .1 * k); g.add(base);
      mk(cap(.42 * k, 1.0 * len), skin, base, [0, -.75 * len, 0]);
      const tip = new THREE.Group(); tip.position.y = -1.5 * len; base.add(tip); mk(cap(.4 * k, .7 * len), skin, tip, [0, -.55 * len, 0]);
      fingers.push({ base, tip }); }
    const tb = new THREE.Group(); tb.position.set(sd * -1.55 * k, -1.0 * k, .55 * k); g.add(tb);
    mk(cap(.5 * k, .9 * k), skin, tb, [0, -.7 * k, 0]);
    const tt = new THREE.Group(); tt.position.y = -1.4 * k; tb.add(tt); mk(cap(.46 * k, .65 * k), skin, tt, [0, -.55 * k, 0]);
    g.userData = { fingers, tb, tt, sd, k };
    setGrip(g, false);
    return g;
  }
  // grip=false: santai. grip=true: memegang HP yang bertumpu di telapak (punggung HP z≈1.2k): jari lurus di belakang HP,
  // ibu jari menyusuri tepi kiri HP lalu ruas ujungnya melengkung lembut ke depan (di depan layar, tidak menembus).
  function setGrip(g, grip) { const { fingers, tb, tt, sd } = g.userData;
    fingers.forEach((f, i) => { f.base.rotation.set(grip ? .08 : .2, 0, 0); f.tip.rotation.set(grip ? .1 : .25, 0, 0); });
    if (grip) { tb.position.x = sd * -1.95 * g.userData.k; tb.rotation.set(-.55, 0, sd * .12); tt.rotation.set(-.5, 0, sd * .28); }
    else { tb.position.x = sd * -1.55 * g.userData.k; tb.rotation.set(0, 0, sd * .7); tt.rotation.set(0, 0, sd * .25); } }

  /* ---------- builder karakter ---------- */
  function build(s) {
    const k = s.scale, root = new THREE.Group(), body = new THREE.Group(); root.add(body);
    const legLen = (s.legK || 26) * k, torH = (s.torK || 19) * k, torW = 15 * k, torD = 9.5 * k;
    const skin = skinMat(s.skin), top = cloth(s.top, s.topKind || 'cotton'), sleeve = cloth(s.sleeve || s.top, s.topKind || 'cotton');
    const rib = cloth(s.rib || s.top, 'rib', .9), pants = cloth(s.pants, s.pantsKind || 'cotton', .85);
    const hips = new THREE.Group(); hips.position.y = legLen; body.add(hips);
    mk(new RBG(torW * .92, 5 * k, torD * .95, 5, 2.2 * k), pants, hips, [0, .5 * k, 0]);
    const legs = [-1, 1].map(sd => { const p = new THREE.Group(); p.position.set(sd * 3.7 * k, 0, 0); hips.add(p);
      const th = legLen * .5; mk(taper(3.3 * k, 2.9 * k, th), pants, p, [0, -th / 2, 0]);
      const knee = new THREE.Group(); knee.position.y = -th; p.add(knee); mk(sph(2.9 * k, 18, 14), pants, knee);
      const sh = legLen * .5 - 2.2 * k; mk(taper(2.9 * k, 2.6 * k, sh), pants, knee, [0, -sh / 2, 0]);
      const foot = new THREE.Group(); foot.position.y = -sh; knee.add(foot);
      if (s.shoeType === 'boot') { const bm = rubber(s.shoe), so = rubber(s.sole || s.shoe, .5);
        mk(taper(3.2 * k, 3.0 * k, 8.5 * k), bm, foot, [0, 2.2 * k, 0]); mk(new THREE.TorusGeometry(3.2 * k, .35 * k, 10, 28), bm, foot, [0, 6.5 * k, 0], [Math.PI / 2, 0, 0]);
        mk(new RBG(5.6 * k, 4 * k, 9.5 * k, 5, 1.9 * k), bm, foot, [0, -.8 * k, 1.6 * k]);
        mk(new RBG(6 * k, 1.3 * k, 10.2 * k, 4, .6 * k), so, foot, [0, -2.5 * k, 1.7 * k]);
      } else if (s.shoeType === 'sneaker') { const up = cloth(s.shoe, 'cotton', .7), so = rubber(s.sole || 0xdddddd, .6);
        mk(new RBG(5.6 * k, 4.2 * k, 10 * k, 5, 1.8 * k), up, foot, [0, -.9 * k, 1.5 * k]);
        mk(new RBG(6 * k, 1.4 * k, 10.6 * k, 4, .6 * k), so, foot, [0, -2.6 * k, 1.6 * k]);
        for (let i = 0; i < 3; i++) mk(new THREE.BoxGeometry(3.2 * k, .25 * k, .5 * k), plain(0x333333, .6), foot, [0, .4 * k - i * .9 * k, 3.6 * k + i * .6 * k], [-.5, 0, 0]);
      } else {
        mk(cap(1.5 * k, 2 * k), skin, foot, [0, -1 * k, 0]); mk(new RBG(4.8 * k, 2.4 * k, 8.4 * k, 4, 1.1 * k), skin, foot, [0, -1.9 * k, 1.6 * k]);
        mk(new RBG(5.6 * k, 1.1 * k, 9.6 * k, 4, .5 * k), rubber(s.sole || 0x8a6a4a, .6), foot, [0, -3.3 * k, 1.6 * k]);
        for (const z of [3.4, -.4]) mk(new RBG(5.4 * k, 1.1 * k, 1.6 * k, 3, .5 * k), rubber(s.shoe, .5), foot, [0, -1.4 * k, z * k]);
      }
      return { p, knee, foot }; });
    const torso = new THREE.Group(); hips.add(torso);
    mk(new RBG(torW, torH, torD, 6, 4.2 * k), top, torso, [0, torH / 2 + 1.5 * k, 0]);
    for (const sd of [-1, 1]) mk(sph(3.6 * k, 24, 18), sleeve, torso, [sd * (torW / 2 - .6 * k), torH - 1 * k, 0]);
    if (s.shirt) mk(new THREE.CircleGeometry(2.6 * k, 24, 0, Math.PI), cloth(s.shirt), torso, [0, torH + 1.2 * k, torD / 2 + .02], [0, 0, Math.PI]);
    if (s.varsity) {
      mk(new THREE.TorusGeometry(3.6 * k, 1.0 * k, 12, 32), rib, torso, [0, torH + 1.6 * k, .2 * k], [Math.PI / 2 - .25, 0, 0], [1.2, 1, .8]);
      mk(new RBG(torW * 1.02, 2.4 * k, torD * 1.04, 4, 1 * k), rib, torso, [0, 2.4 * k, 0]);
      mk(new THREE.BoxGeometry(torW * 1.03, .5 * k, torD * 1.05), cloth(s.top), torso, [0, 2.6 * k, 0]);
      mk(new THREE.BoxGeometry(.5 * k, torH - 3 * k, .2 * k), rib, torso, [0, torH / 2 + 2 * k, torD / 2 + .05]);
      for (let i = 0; i < 5; i++) mk(new THREE.CylinderGeometry(.55 * k, .55 * k, .35 * k, 16), plain(0xf6f0de, .3), torso, [0, 4.6 * k + i * 3.2 * k, torD / 2 + .2 * k], [Math.PI / 2, 0, 0]);
      for (const sd of [-1, 1]) mk(new RBG(.9 * k, 4.2 * k, .4 * k, 2, .3 * k), rib, torso, [sd * 4.4 * k, 7.5 * k, torD / 2 + .05], [0, 0, sd * .35]);
    }
    if (s.zip) { mk(new THREE.BoxGeometry(.4 * k, torH - 1 * k, .25 * k), plain(0xd9dde2, .3, .8), torso, [0, torH / 2 + 1.5 * k, torD / 2 + .1]);
      for (let i = 1; i < 4; i++) mk(new THREE.BoxGeometry(torW * 1.01, .25 * k, torD * 1.01), cloth(s.top, 'puffer'), torso, [0, i * torH / 4 + 1.5 * k, 0]); }
    if (s.emblem) mk(new THREE.CircleGeometry(2.3 * k, 32), EMBLEM, torso, [-4.1 * k, torH * .72 + 1 * k, torD / 2 + .08]);
    if (s.print) mk(new THREE.PlaneGeometry(9 * k, 9 * k), s.print, torso, [0, torH * .5 + 1 * k, torD / 2 + .06]);
    if (s.bag) { mk(new RBG(6 * k, 5 * k, 2 * k, 4, .8 * k), plain(0xf1e6d3, .55), torso, [-5.5 * k, 3.5 * k, torD / 2 + 1 * k]);
      mk(new THREE.CylinderGeometry(.6 * k, .6 * k, .3 * k, 16), plain(0xc9a46a, .3, .8), torso, [-5.5 * k, 4.4 * k, torD / 2 + 2.05 * k], [Math.PI / 2, 0, 0]);
      mk(new THREE.BoxGeometry(.7 * k, torH * 1.3, .35 * k), plain(0x9b7b55, .6), torso, [-.8 * k, torH * .62, torD / 2 + .25], [0, 0, -.62]); }
    const neck = new THREE.Group(); neck.position.y = torH + 1.2 * k; torso.add(neck);
    mk(taper(2.1 * k, 2.4 * k, 3.2 * k), skin, neck, [0, 1 * k, 0]);
    const headPivot = new THREE.Group(); headPivot.position.y = 2.6 * k; neck.add(headPivot);
    const H = buildHead(s, k, headPivot); H.head.position.y = H.R * 1.0; hair(s, H);
    if (s.hairStyle === 'hijab') { const hj = H.drape; mk(new THREE.CylinderGeometry(H.R * .95, torW * .62, 8 * k, 32, 1, true), hj, neck, [0, .2 * k, .3 * k]);
      mk(new RBG(torW * .95, 7 * k, torD * 1.08, 5, 3 * k), hj, torso, [0, torH - 1.6 * k, .4 * k]); }
    const arms = [-1, 1].map(sd => { const sh = new THREE.Group(); sh.position.set(sd * (torW / 2 + 1.4 * k), torH - 1.5 * k, 0); torso.add(sh);
      const ua = 8.6 * k; mk(taper(2.6 * k, 2.3 * k, ua), s.shortSleeve ? top : sleeve, sh, [0, -ua / 2, 0]);
      if (s.shortSleeve) mk(taper(2.0 * k, 1.9 * k, ua * .5), skin, sh, [0, -ua * .78, 0]);
      const el = new THREE.Group(); el.position.y = -ua; sh.add(el); mk(sph(2.3 * k, 18, 14), s.shortSleeve ? skin : sleeve, el);
      const fa = 7.8 * k; mk(taper(2.25 * k, 1.9 * k, fa), s.shortSleeve ? skin : sleeve, el, [0, -fa / 2, 0]);
      if (!s.shortSleeve) mk(taper(2.1 * k, 2.1 * k, 1.6 * k), rib, el, [0, -fa + .6 * k, 0]);
      if (s.shortSleeve && s.rib) mk(new THREE.TorusGeometry(2.5 * k, .35 * k, 8, 24), rib, sh, [0, -ua * .5, 0], [Math.PI / 2, 0, 0]);
      const wr = new THREE.Group(); wr.position.y = -fa; el.add(wr); const hd = hand(skin, k, wr, sd);
      return { sh, el, wr, sd, hand: hd }; });
    return { root, body, hips, torso, neck, head: headPivot, H, legs, arms, k, legLen };
  }

  /* ---------- pose: [maju, keluar, tekuk-siku] per lengan ---------- */
  const POSE = {
    idle: { R: [.06, .12, .2], L: [.06, .12, .2] },
    wave: { R: [.25, 2.5, .8], L: [.06, .12, .2], head: [0, 0, .08] },
    point: { R: [1.5, .25, .05], L: [.06, .14, .25], torso: [0, -.25, 0] },
    think: { R: [1.15, .3, 2.25], L: [.6, -.3, 1.55], head: [.12, 0, .12] },
    shock: { R: [.6, 1.0, 2.0], L: [.6, 1.0, 2.0], torso: [-.12, 0, 0], head: [-.14, 0, 0] },
    celebrate: { R: [.25, 2.95, .15], L: [.4, .95, 1.75], head: [-.1, 0, -.08] },
    facepalm: { R: [1.6, .45, 2.5], L: [.06, .14, .25], head: [.3, 0, 0], torso: [.12, 0, 0] },
    present: { R: [1.0, .28, 1.05], L: [1.0, .28, 1.05] }, // kedua tangan di depan dada, telapak terbuka — BUKAN T-pose
    hold: { R: [1.3, .12, .7], L: [1.3, .12, .7] },
    crouch: { R: [.9, .2, .9], L: [.9, .2, .9], crouch: 1 },
    walk: { R: [0, .1, .3], L: [0, .1, .3], walk: 1 },
  };
  const lerp = (a, b, p) => a + (b - a) * p, cl = (v, a, b) => v < a ? a : v > b ? b : v, eo = x => 1 - Math.pow(1 - x, 3);

  function apply(c, name, u, ex) {
    const P = POSE[name] || POSE.idle, I = POSE.idle, e = eo(cl(u / .35, 0, 1));
    c.arms.forEach(a => { const tg = P[a.sd > 0 ? 'R' : 'L'], s0 = I[a.sd > 0 ? 'R' : 'L'];
      a.sh.rotation.set(-lerp(s0[0], tg[0], e), 0, a.sd * lerp(s0[1], tg[1], e)); a.el.rotation.set(-lerp(s0[2], tg[2], e), 0, 0); });
    const br = Math.sin(u * 2.4) * .012;
    const [tx, ty, tz] = (P.torso || [0, 0, 0]).map(v => v * e); c.torso.rotation.set(tx + br, ty, tz);
    const [hx, hy, hz] = (P.head || [0, 0, 0]).map(v => v * e); c.head.rotation.set(hx + Math.sin(u * 1.3) * .025, hy + Math.sin(u * .9) * .05, hz);
    c.body.position.y = 0; c.hips.position.y = c.legLen; c.legs.forEach(l => { l.p.rotation.set(0, 0, 0); l.knee.rotation.set(0, 0, 0); l.foot.rotation.set(0, 0, 0); });
    if (name === 'wave') c.arms[1].el.rotation.z = Math.sin(u * 10) * .45 * e;
    if (name === 'celebrate') { c.body.position.y = Math.abs(Math.sin(u * 7)) * 4 * c.k; c.arms[1].sh.rotation.z += Math.sin(u * 14) * .1; }
    if (name === 'shock') c.body.position.y = Math.max(0, Math.sin(cl(u / .25, 0, 1) * Math.PI)) * 2.5 * c.k;
    if (name === 'crouch') { c.hips.position.y = c.legLen * .55; c.legs.forEach(l => { l.p.rotation.x = -1.25; l.knee.rotation.x = 2.1; l.foot.rotation.x = -.85; });
      c.torso.rotation.x += .4; c.head.rotation.x -= .35; }
    if (P.walk) { const w = Math.sin(u * 6.5); c.legs[0].p.rotation.x = w * .5; c.legs[1].p.rotation.x = -w * .5;
      c.legs[0].knee.rotation.x = Math.max(0, -w) * .7; c.legs[1].knee.rotation.x = Math.max(0, w) * .7;
      c.arms[0].sh.rotation.x = -w * .45; c.arms[1].sh.rotation.x = w * .45; c.body.position.y = Math.abs(Math.cos(u * 6.5)) * 1.0 * c.k; }
    // arah tatapan: c.gaze (Vector3 dunia: benda yang dibahas) atau kamera; dibatasi agar tidak juling
    const tgt = c.gaze || (cam ? cam.position : null); c.H.gazeDir = null;
    if (tgt) { c.root.updateWorldMatrix(true, true); c.H.gazeDir = c.H.eyes.map(e => { const d = e.eg.worldToLocal(tgt.clone());
        const yaw = Math.atan2(d.x, d.z), pitch = -Math.atan2(d.y, Math.hypot(d.x, d.z)); return [cl(pitch, -.3, .3), cl(yaw, -.4, .4)]; }); }
    const blink = ((u + c.k * 3) % 3.6) < .13 && ex !== 'happy' && ex !== 'wink';
    setExpr(c.H, ex || 'normal', blink, u);
  }

  const mkChar = s => { const c = build(s); c.gaze = null; c.grip = (side, on) => setGrip(c.arms[side].hand, on); c.act = (name, u, ex) => apply(c, name, u, ex); c.act('idle', 0, 'normal');
    c.root.updateWorldMatrix(true, true); const b = new THREE.Box3().setFromObject(c.root); c.height = b.max.y - b.min.y; c.heightM = s.heightM; return c; };
  const cast = {
    // Tokoh utama (Ari): rambut hitam belah samping, jaket varsity biru-krem + emblem ZunoLoop, kaos biru muda, celana abu, bot karet ungu sol hijau.
    ayah: mkChar({ scale: 1, heightM: 1.70, skin: 0xc68d63, hair: 0x15110e, hairStyle: 'side', top: 0x6f95cf, sleeve: 0xf1e5c6, rib: 0xf1e5c6, varsity: true,
      shirt: 0xbcd8f4, emblem: true, pants: 0x85888c, pantsKind: 'denim', shoe: 0x6a46c8, sole: 0x3b2a6b, shoeType: 'boot' }),
    // Istri: hijab hitam, jaket puffer teal, atasan pink, legging hitam, bot karet merah, tas selempang krem.
    ibu: mkChar({ scale: .88, heightM: 1.55, skin: 0xe0ad8a, hair: 0x18181b, hairStyle: 'hijab', top: 0x2fbfb8, topKind: 'puffer', zip: true, shirt: 0xf3b7c6,
      pants: 0x1d1d22, shoe: 0xd6302d, sole: 0xb02421, shoeType: 'boot', bag: true }),
    // Anak besar: kaos hijau muda gambar dino, jeans, sandal biru.
    kakak: mkChar({ scale: .7, heightM: 1.25, headK: 1.18, legK: 22, torK: 17, skin: 0xb8805b, hair: 0x15110e, hairStyle: 'short', top: 0xd3e6b9, rib: 0x6f9a63,
      print: dino('#5f9a5c', '#a9d39a'), pants: 0x2e5189, pantsKind: 'denim', shoe: 0x3a86d6, sole: 0x8a6a4a, shoeType: 'sandal', shortSleeve: true }),
    // Anak kecil: kaos putih kerah oranye gambar dino, celana krem, sandal biru.
    adik: mkChar({ scale: .58, heightM: 1.0, headK: 1.3, legK: 20, torK: 16, skin: 0xbe8862, hair: 0x15110e, hairStyle: 'short', top: 0xf7f5f0, rib: 0xe8892e,
      print: dino('#c7782f', '#f1c48c'), pants: 0xcdb48c, shoe: 0x3a86d6, sole: 0x8a6a4a, shoeType: 'sandal', shortSleeve: true }),
    // Orang dewasa generik (penerima pesan, petugas, teknisi, orang asing/penyadap): topi + hoodie abu, sneaker.
    orang: mkChar({ scale: .98, heightM: 1.68, skin: 0xb98463, hair: 0x1a1512, hairStyle: 'cap', capColor: 0x2c3e66, top: 0x6b7280, rib: 0x4b5260,
      pants: 0x2b3038, pantsKind: 'denim', shoe: 0xf2f2f2, sole: 0xd9d9d9, shoeType: 'sneaker' }),
    POSES: Object.keys(POSE),
  };
  // SKALA DUNIA NYATA: cast.M = unit per 1 meter (ayah = 1,70 m). Semua benda WAJIB dimodelkan dengan ukuran asli × cast.M,
  // mis. pintu 2,1 m → 2.1*C.M; motor tinggi 1,1 m → 1.1*C.M. Tinggi karakter: C.ayah.height (unit) / C.M = meter.
  cast.M = cast.ayah.height / 1.70;
  return cast;
}
