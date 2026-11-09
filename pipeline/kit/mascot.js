// ZunoLoop mascot kit — keluarga low-poly berbasis foto Ari.
// Pakai: import {makeCast} from './kit/mascot.js';  const C=makeCast(THREE,RoundedBoxGeometry);
//        scene.add(C.ayah.root); C.ayah.root.position.set(x,0,z); C.ayah.root.scale.setScalar(s);
//        tiap frame: C.ayah.act('wave', detikSejakMulai, 'happy');
// Tinggi dasar (skala 1): ayah ±62, ibu ±56, kakak ±44, adik ±36 unit. Kaki di y=0, menghadap +z.
// Aksi: idle, walk, wave, point, think, shock, celebrate, facepalm, present, hold, sit-free(jongkok)=crouch
// Ekspresi: normal, happy, shock, worried, think, wink

export function makeCast(THREE, RBG) {
  const M = (c, r = .6, m = 0) => new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: m });
  const mk = (g, mat, parent, pos, rot) => { const o = new THREE.Mesh(g, mat); o.castShadow = o.receiveShadow = true;
    if (pos) o.position.set(...pos); if (rot) o.rotation.set(...rot); parent.add(o); return o; };
  const box = (w, h, d, r = .25) => new RBG(w, h, d, 3, Math.min(r * Math.min(w, h, d), Math.min(w, h, d) / 2 - .01));
  const cap = (r, l) => new THREE.CapsuleGeometry(r, l, 6, 14);

  /* ---------- emblem ZunoLoop (pengganti logo di jaket) ---------- */
  function emblemTex() {
    const cv = document.createElement('canvas'); cv.width = cv.height = 256; const x = cv.getContext('2d');
    x.fillStyle = '#123a6b'; x.beginPath(); x.arc(128, 128, 120, 0, 7); x.fill();
    x.strokeStyle = '#ffd23f'; x.lineWidth = 16; x.beginPath(); x.arc(128, 128, 88, -2.6, 2.2); x.stroke();
    x.fillStyle = '#ffd23f'; x.beginPath(); x.moveTo(178, 186); x.lineTo(210, 196); x.lineTo(186, 222); x.fill();
    x.font = '900 128px Inter, Arial, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = '#fff'; x.fillText('Z', 128, 136);
    const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t;
  }
  const EMB = emblemTex();

  /* ---------- wajah (canvas, digambar ulang hanya saat ekspresi berubah) ---------- */
  function face(skin, opt) {
    const cv = document.createElement('canvas'); cv.width = cv.height = 256; const x = cv.getContext('2d');
    const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; let cur = '';
    function draw(ex, blink) {
      const key = ex + (blink ? 'b' : ''); if (key === cur) return; cur = key;
      x.fillStyle = skin; x.fillRect(0, 0, 256, 256);
      x.fillStyle = 'rgba(255,120,110,.35)'; for (const cx of [62, 194]) { x.beginPath(); x.ellipse(cx, 170, 22, 13, 0, 0, 7); x.fill(); }
      const ey = 120, eL = 86, eR = 170, big = ex === 'shock' ? 1.25 : 1;
      x.lineCap = 'round';
      // alis
      x.strokeStyle = opt.brow; x.lineWidth = 9;
      const bt = { worried: [.35, -.35], shock: [-.15, .15], think: [.25, -.05], happy: [0, 0] }[ex] || [0, 0];
      for (const [cx, s] of [[eL, -1], [eR, 1]]) { const a = s < 0 ? bt[0] : bt[1];
        x.beginPath(); x.moveTo(cx - 24, ey - 42 + s * a * 18 * -1 - (ex === 'shock' ? 10 : 0)); x.lineTo(cx + 24, ey - 42 + s * a * 18 - (ex === 'shock' ? 10 : 0)); x.stroke(); }
      // mata
      for (const cx of [eL, eR]) {
        const closed = blink || (ex === 'happy') || (ex === 'wink' && cx === eR);
        if (closed) { x.strokeStyle = '#2a1a12'; x.lineWidth = 9; x.beginPath();
          if (ex === 'happy' || ex === 'wink') x.arc(cx, ey + 6, 16, Math.PI * 1.1, Math.PI * 1.9); else { x.moveTo(cx - 16, ey); x.lineTo(cx + 16, ey); }
          x.stroke(); continue; }
        x.fillStyle = '#fff'; x.beginPath(); x.ellipse(cx, ey, 19 * big, 23 * big, 0, 0, 7); x.fill();
        x.fillStyle = '#2a1a12'; x.beginPath(); x.ellipse(cx + (ex === 'think' ? 6 : 0), ey + 3 - (ex === 'think' ? 6 : 0), 14 * big, 18 * big, 0, 0, 7); x.fill();
        x.fillStyle = '#fff'; x.beginPath(); x.arc(cx - 4, ey - 5, 5, 0, 7); x.fill();
      }
      // mulut
      x.strokeStyle = '#7a2e22'; x.fillStyle = '#7a2e22'; x.lineWidth = 8;
      if (ex === 'happy' || ex === 'wink') { x.beginPath(); x.arc(128, 172, 30, .15, Math.PI - .15); x.closePath(); x.fill();
        x.fillStyle = '#fff'; x.fillRect(104, 174, 48, 9); }
      else if (ex === 'shock') { x.beginPath(); x.ellipse(128, 190, 16, 22, 0, 0, 7); x.fill(); }
      else if (ex === 'worried') { x.beginPath(); x.moveTo(104, 196); x.quadraticCurveTo(128, 178, 152, 196); x.stroke(); }
      else if (ex === 'think') { x.beginPath(); x.moveTo(112, 188); x.lineTo(146, 182); x.stroke(); }
      else { x.beginPath(); x.arc(128, 166, 24, .35, Math.PI - .35); x.stroke(); }
      tex.needsUpdate = true;
    }
    draw('normal', false); return { tex, draw };
  }

  /* ---------- builder karakter ---------- */
  function build(s) {
    const k = s.scale, root = new THREE.Group(), body = new THREE.Group(); root.add(body);
    const legLen = 20 * k, torH = 17 * k, torW = 16 * k, torD = 10 * k, headS = 18 * k;
    const skin = M(s.skin, .55), top = M(s.top, .7), sleeve = M(s.sleeve || s.top, .7), pants = M(s.pants, .8);
    const shoe = M(s.shoe, .45), sole = M(s.sole || s.shoe, .6), rib = M(s.rib || s.top, .7);
    const hips = new THREE.Group(); hips.position.y = legLen; body.add(hips);
    // kaki
    const legs = [-1, 1].map(sd => { const p = new THREE.Group(); p.position.set(sd * 4.2 * k, 0, 0); hips.add(p);
      mk(cap(3.1 * k, legLen - 8 * k), pants, p, [0, -legLen / 2 + 1.5 * k, 0]);
      if (s.shoeType === 'boot') { mk(box(7 * k, 9 * k, 9 * k, .3), shoe, p, [0, -legLen + 5 * k, .8 * k]); mk(box(7.6 * k, 1.6 * k, 10 * k, .3), sole, p, [0, -legLen + .8 * k, 1 * k]); }
      else { mk(box(6.4 * k, 4 * k, 9 * k, .4), skin, p, [0, -legLen + 2.4 * k, 1 * k]); mk(box(7 * k, 1.4 * k, 10 * k, .3), sole, p, [0, -legLen + .7 * k, 1 * k]);
        mk(box(7.2 * k, 1.6 * k, 3 * k, .3), shoe, p, [0, -legLen + 3.4 * k, 2.4 * k]); }
      return p; });
    // badan
    const torso = new THREE.Group(); hips.add(torso);
    mk(box(torW, torH, torD, .3), top, torso, [0, torH / 2, 0]);
    if (s.shirt) mk(box(torW * .3, torH * .45, .6 * k, .3), M(s.shirt, .7), torso, [0, torH * .74, torD / 2]);
    if (s.rib) { mk(box(torW * 1.02, 2 * k, torD * 1.02, .3), rib, torso, [0, 1 * k, 0]); mk(box(torW * .7, 2 * k, torD * .8, .3), rib, torso, [0, torH, 0]); }
    if (s.zip) mk(box(.6 * k, torH * .9, .5 * k, .2), M(s.zip, .4), torso, [0, torH / 2, torD / 2 + .1]);
    if (s.emblem) { const e = new THREE.Mesh(new THREE.CircleGeometry(2.6 * k, 32), new THREE.MeshStandardMaterial({ map: EMB, roughness: .6 }));
      e.position.set(-5.2 * k, torH * .66, torD / 2 + .12); torso.add(e); }
    if (s.print) mk(box(torW * .5, torH * .38, .5 * k, .3), M(s.print, .8), torso, [0, torH * .45, torD / 2 + .05]);
    if (s.bag) { mk(box(6 * k, 5 * k, 2 * k, .3), M(0xf1e6d3, .6), torso, [-5 * k, 3 * k, torD / 2 + 1 * k]);
      const strap = mk(new THREE.BoxGeometry(.7 * k, torH * 1.25, .5 * k), M(0x9b7b55, .6), torso, [0, torH * .5, torD / 2 + .3]); strap.rotation.z = -.7; }
    // kepala
    const neck = new THREE.Group(); neck.position.y = torH; torso.add(neck);
    const head = new THREE.Group(); head.position.y = headS / 2 + 1 * k; neck.add(head);
    mk(box(headS, headS, headS * .9, .3), skin, head);
    const F = face(s.skinHex, { brow: s.brow || '#1d1410' });
    const fm = new THREE.Mesh(new THREE.PlaneGeometry(headS * .92, headS * .92), new THREE.MeshStandardMaterial({ map: F.tex, roughness: .6 }));
    fm.position.z = headS * .45 + .05; head.add(fm);
    for (const sd of [-1, 1]) mk(box(2.4 * k, 4 * k, 3 * k, .4), skin, head, [sd * headS * .52, 0, 0]); // telinga
    const hair = M(s.hair, .8);
    if (s.hairStyle === 'side') { // belah samping, poni menyapu
      mk(box(headS * 1.06, headS * .32, headS * .98, .35), hair, head, [0, headS * .44, -.3 * k]);
      mk(box(headS * 1.06, headS * .7, headS * .25, .3), hair, head, [0, headS * .12, -headS * .38]);
      const fr = mk(box(headS * .75, headS * .18, headS * .25, .4), hair, head, [-headS * .14, headS * .33, headS * .4]); fr.rotation.z = .18;
      for (const sd of [-1, 1]) mk(box(headS * .12, headS * .45, headS * .7, .3), hair, head, [sd * headS * .5, headS * .2, -headS * .05]);
    } else if (s.hairStyle === 'short') {
      mk(box(headS * 1.05, headS * .26, headS * .96, .4), hair, head, [0, headS * .44, -.2 * k]);
      mk(box(headS * 1.05, headS * .6, headS * .2, .3), hair, head, [0, headS * .14, -headS * .38]);
      mk(box(headS * .9, headS * .12, headS * .2, .4), hair, head, [0, headS * .39, headS * .4]);
    } else if (s.hairStyle === 'hijab') {
      const hj = M(s.hair, .85);
      mk(box(headS * 1.18, headS * 1.12, headS * 1.02, .4), hj, head, [0, headS * .06, -headS * .07]);
      mk(box(headS * 1.12, headS * .2, headS * .2, .4), hj, head, [0, headS * .46, headS * .42]);
      for (const sd of [-1, 1]) mk(box(headS * .2, headS * .9, headS * .25, .4), hj, head, [sd * headS * .5, -headS * .02, headS * .38]);
      mk(box(torW * .95, torH * .45, torD * 1.1, .4), hj, torso, [0, torH * .82, .3 * k]);
      fm.position.z = headS * .48;
    }
    // lengan
    const arms = [-1, 1].map(sd => { const sh = new THREE.Group(); sh.position.set(sd * (torW / 2 + 2 * k), torH - 2.5 * k, 0); torso.add(sh);
      mk(cap(2.6 * k, 6 * k), sleeve, sh, [0, -4.5 * k, 0]);
      const el = new THREE.Group(); el.position.y = -9 * k; sh.add(el);
      mk(cap(2.4 * k, 5 * k), s.shortSleeve ? skin : sleeve, el, [0, -3.6 * k, 0]);
      if (s.rib && !s.shortSleeve) mk(new THREE.CylinderGeometry(2.7 * k, 2.7 * k, 1.6 * k, 14), rib, el, [0, -6.8 * k, 0]);
      const hand = mk(new THREE.SphereGeometry(2.6 * k, 16, 12), skin, el, [0, -8.6 * k, 0]);
      return { sh, el, hand, sd }; });
    return { root, body, hips, torso, neck, head, legs, arms, F, k, legLen, H: legLen + torH + headS + 2 * k, expr: 'normal' };
  }

  /* ---------- pose: [fwd, out, elbow] per lengan (+ = maju/keluar/tekuk) ---------- */
  const POSE = {
    idle: { R: [.05, .14, .15], L: [.05, .14, .15] },
    wave: { R: [.25, 2.55, .7], L: [.05, .14, .15], head: [0, 0, .1] },
    point: { R: [1.5, .25, .05], L: [.05, .14, .2], torso: [0, -.25, 0] },
    think: { R: [1.25, .25, 2.2], L: [.55, -.25, 1.5], head: [.12, 0, .14] },
    shock: { R: [.5, 1.05, 1.9], L: [.5, 1.05, 1.9], torso: [-.12, 0, 0], head: [-.12, 0, 0] },
    celebrate: { R: [.25, 2.95, .15], L: [.4, .95, 1.7], head: [-.1, 0, -.08] },
    facepalm: { R: [1.65, .45, 2.45], L: [.05, .14, .2], head: [.3, 0, 0], torso: [.12, 0, 0] },
    present: { R: [.65, 1.0, .35], L: [.65, 1.0, .35] },
    hold: { R: [1.35, .12, .65], L: [1.35, .12, .65] },
    crouch: { R: [.9, .2, .9], L: [.9, .2, .9], crouch: 1 },
    walk: { R: [0, .12, .3], L: [0, .12, .3], walk: 1 },
  };
  const lerp = (a, b, p) => a + (b - a) * p, cl = (v, a, b) => v < a ? a : v > b ? b : v, eo = x => 1 - Math.pow(1 - x, 3);

  function apply(c, name, u, ex) {
    const P = POSE[name] || POSE.idle, I = POSE.idle, e = eo(cl(u / .35, 0, 1)); // transisi .35 s dari idle
    const set = (a, side) => { const tgt = P[side === 1 ? 'R' : 'L'], s = I[side === 1 ? 'R' : 'L'];
      const f = lerp(s[0], tgt[0], e), o = lerp(s[1], tgt[1], e), b = lerp(s[2], tgt[2], e);
      a.sh.rotation.set(-f, 0, side * o); a.el.rotation.set(-b, 0, 0); };
    c.arms.forEach(a => set(a, a.sd));
    const br = Math.sin(u * 2.4) * .015;
    const [tx, ty, tz] = (P.torso || [0, 0, 0]).map(v => v * e); c.torso.rotation.set(tx + br, ty, tz);
    const [hx, hy, hz] = (P.head || [0, 0, 0]).map(v => v * e); c.head.rotation.set(hx + Math.sin(u * 1.3) * .03, hy + Math.sin(u * .9) * .05, hz);
    c.body.position.y = 0; c.hips.position.y = c.legLen; c.legs.forEach(l => l.rotation.set(0, 0, 0));
    if (name === 'wave') { const w = Math.sin(u * 11) * .45 * e; c.arms[1].el.rotation.z = w; }
    if (name === 'celebrate') { const j = Math.abs(Math.sin(u * 7)); c.body.position.y = j * 5 * c.k; c.arms[1].sh.rotation.z += Math.sin(u * 14) * .12; }
    if (name === 'shock') c.body.position.y = Math.max(0, Math.sin(cl(u / .25, 0, 1) * Math.PI)) * 3 * c.k;
    if (name === 'think') c.arms[1].el.rotation.x -= Math.sin(u * 3) * .05;
    if (name === 'crouch') { c.hips.position.y = c.legLen * .62; c.legs.forEach(l => l.rotation.x = -.9); c.torso.rotation.x += .35; c.head.rotation.x -= .3; }
    if (P.walk) { const w = Math.sin(u * 7); c.legs[0].rotation.x = w * .55; c.legs[1].rotation.x = -w * .55;
      c.arms[0].sh.rotation.x = -w * .5; c.arms[1].sh.rotation.x = w * .5; c.body.position.y = Math.abs(Math.cos(u * 7)) * 1.2 * c.k; }
    const blink = ((u + c.k * 3) % 3.4) < .12 && ex !== 'happy';
    c.F.draw(ex || 'normal', blink);
  }

  const mkChar = s => { const c = build(s); c.act = (name, u, ex) => apply(c, name, u, ex); c.act('idle', 0, 'normal'); return c; };
  const SK = '#c98e62';
  return {
    // Tokoh utama (Ari): rambut hitam belah samping, jaket varsity biru-krem + emblem ZunoLoop, celana abu, bot ungu sol hijau.
    ayah: mkChar({ scale: 1, skin: 0xc98e62, skinHex: SK, hair: 0x14110f, hairStyle: 'side', top: 0x4f82cf, sleeve: 0xf3e6c4,
      rib: 0xf3e6c4, shirt: 0xa9cdf2, emblem: true, pants: 0x8b8d90, shoe: 0x6a4cc4, sole: 0x9bd13a, shoeType: 'boot', zip: 0xf6f1e3 }),
    // Istri: hijab hitam, jaket teal, atasan pink, celana hitam, bot merah, tas selempang krem.
    ibu: mkChar({ scale: .9, skin: 0xd9a17e, skinHex: '#d9a17e', hair: 0x17171a, hairStyle: 'hijab', top: 0x2fb9b4, shirt: 0xf3b7c6,
      pants: 0x1f1f24, shoe: 0xd8312f, sole: 0xb52623, shoeType: 'boot', bag: true }),
    // Anak besar: kaos hijau muda (gambar dino), jeans, sandal biru.
    kakak: mkChar({ scale: .72, skin: 0xb9805a, skinHex: '#b9805a', hair: 0x16120f, hairStyle: 'short', top: 0xcfe3b5, rib: 0x6f9a63,
      print: 0x5b8f5c, pants: 0x2d4f86, shoe: 0x3a86d6, sole: 0x8a6a4a, shoeType: 'sandal', shortSleeve: true }),
    // Anak kecil: kaos putih kerah oranye (gambar dino), celana krem, sandal biru.
    adik: mkChar({ scale: .6, skin: 0xbf8660, skinHex: '#bf8660', hair: 0x16120f, hairStyle: 'short', top: 0xf7f5f0, rib: 0xe8892e,
      print: 0xc7782f, pants: 0xcdb48c, shoe: 0x3a86d6, sole: 0x8a6a4a, shoeType: 'sandal', shortSleeve: true }),
    POSES: Object.keys(POSE),
  };
}
