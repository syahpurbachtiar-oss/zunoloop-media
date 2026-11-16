// ZunoLoop KISI benda-tembus-benda (revisi Ari 17 Nov 2026: "botolnya masih nembus tempat sampah", "botol masuk mesin kok nggak ada lubangnya").
// Semua pelanggaran masuk window.__fxViol → render.py → qc_fx.json → qc.py GAGAL.
// Pakai:
//   import {makeCollide} from './kit/collide.js'; const COL=makeCollide(THREE,U);
//   COL.solid(obj, {t:'box',min:[..],max:[..]})            // padatan; koordinat LOKAL obj, satuan dunia (pakai m()); default = boundingBox geometri mesh
//   COL.solid(obj, {t:'shell',r0,r1,y0,y1,w})               // tong/silinder terbuka: dinding tebal w, jari-jari luar r0 (y0) → r1 (y1)
//   COL.solid(obj, {t:'rshell',x0,z0,x1,z1,y0,y1,w})        // corong/hopper/bak persegi terbuka: setengah-lebar luar x0,z0 (y0) → x1,z1 (y1)
//   COL.solid(obj, {t:'cyl',r,y0,y1}) / {t:'sphere',r}
//   COL.item(obj, a, b, r, name)                            // benda lepas = kapsul a→b jari-jari r (lokal obj, satuan dunia)
//   COL.intake(obj, {min,max}, name)                        // ruang tempat benda BOLEH lenyap/muncul (dalam corong mesin, di bawah tumpukan, dsb.)
//   COL.check(scene, cam, {t, shot, ground:(x,z)=>y})        // tiap frame, SEBELUM FX.end()
// Aturan yang dicek: (1) titik kapsul benda di dalam padatan → tembus-<benda>-<padatan>; (2) dua benda saling tembus → tembus-<a>-<b>;
// (3) benda di bawah lantai → tembus-lantai-<benda>; (4) benda lenyap/muncul di dalam layar tapi tidak di dalam intake → hilang-<benda> / muncul-<benda>;
// (5) benda melompat seketika (>20 m/s) di dalam shot → lompat-<benda>.
export function makeCollide(THREE, U) {
  const S = [], I = [], K = [], tol = .006 * U, P = new Map();
  const v = new THREE.Vector3(), inv = new THREE.Matrix4(), q = new THREE.Vector3();
  const vis = (o, sc) => { while (o) { if (!o.visible) return false; if (o === sc) return true; o = o.parent; } return false; };
  function solid(obj, shape, name) {
    if (!shape) { obj.geometry.computeBoundingBox(); const bb = obj.geometry.boundingBox; shape = { t: 'box', min: bb.min.toArray(), max: bb.max.toArray() }; }
    S.push({ obj, s: shape, name: name || obj.name || 'padatan' }); return obj;
  }
  // fix=true: benda diam (tumpukan) — dicek penuh sekali per scene lalu hasilnya disimpan (hemat waktu render)
  function item(obj, a, b, r, name, fix = false) { I.push({ obj, a: new THREE.Vector3(...a), b: new THREE.Vector3(...b), r, name: name || 'benda', fix }); return obj; }
  function intake(obj, box, name) { K.push({ obj, min: new THREE.Vector3(...box.min), max: new THREE.Vector3(...box.max), name }); }
  // kapsul dunia
  function seg(it) { const A = it.a.clone().applyMatrix4(it.obj.matrixWorld), B = it.b.clone().applyMatrix4(it.obj.matrixWorld); const sc = new THREE.Vector3(); it.obj.getWorldScale(sc); return [A, B, it.r * Math.max(sc.x, sc.y, sc.z)]; }
  function pts(it) { const [A, B, r] = seg(it), d = B.clone().sub(A), L = d.length(), out = [];
    const ax = L > 1e-6 ? d.clone().divideScalar(L) : new THREE.Vector3(0, 1, 0), p1 = new THREE.Vector3(1, 0, 0); if (Math.abs(ax.x) > .9) p1.set(0, 1, 0);
    const e1 = p1.clone().cross(ax).normalize(), e2 = ax.clone().cross(e1);
    for (let i = 0; i <= 4; i++) { const c = A.clone().addScaledVector(d, i / 4); out.push(c.clone()); for (let j = 0; j < 8; j++) { const an = j / 8 * Math.PI * 2; out.push(c.clone().addScaledVector(e1, Math.cos(an) * r * .85).addScaledVector(e2, Math.sin(an) * r * .85)); } }
    out.push(A.clone().addScaledVector(ax, -r * .85), B.clone().addScaledVector(ax, r * .85)); return out; }
  function inside(p, s) { // p lokal (satuan dunia), dikurangi toleransi kontak
    const x = p.x, y = p.y, z = p.z;
    if (s.t === 'box') return x > s.min[0] + tol && x < s.max[0] - tol && y > s.min[1] + tol && y < s.max[1] - tol && z > s.min[2] + tol && z < s.max[2] - tol;
    if (s.t === 'sphere') return Math.hypot(x, y, z) < s.r - tol;
    if (s.t === 'cyl') return y > s.y0 + tol && y < s.y1 - tol && Math.hypot(x, z) < s.r - tol;
    if (y <= s.y0 + tol || y >= s.y1 - tol) return false; const k = (y - s.y0) / (s.y1 - s.y0);
    if (s.t === 'shell') { const ro = s.r0 + (s.r1 - s.r0) * k, d = Math.hypot(x, z); return d < ro - tol && d > ro - s.w + tol; }
    if (s.t === 'rshell') { const hx = s.x0 + (s.x1 - s.x0) * k, hz = s.z0 + (s.z1 - s.z0) * k, ax = Math.abs(x), az = Math.abs(z);
      const inOut = ax < hx - tol && az < hz - tol, inIn = ax < hx - s.w + tol && az < hz - s.w + tol; return inOut && !inIn; }
    return false;
  }
  function segDist(p1, q1, p2, q2) { // jarak terdekat dua ruas
    const d1 = q1.clone().sub(p1), d2 = q2.clone().sub(p2), r = p1.clone().sub(p2), a = d1.dot(d1), e = d2.dot(d2), f = d2.dot(r); let s, t;
    if (a < 1e-9 && e < 1e-9) return p1.distanceTo(p2);
    if (a < 1e-9) { s = 0; t = Math.min(1, Math.max(0, f / e)); } else { const c = d1.dot(r); if (e < 1e-9) { t = 0; s = Math.min(1, Math.max(0, -c / a)); } else {
      const b = d1.dot(d2), den = a * e - b * b; s = den > 1e-9 ? Math.min(1, Math.max(0, (b * f - c * e) / den)) : 0; t = (b * s + f) / e;
      if (t < 0) { t = 0; s = Math.min(1, Math.max(0, -c / a)); } else if (t > 1) { t = 1; s = Math.min(1, Math.max(0, (b - c) / a)); } } }
    return p1.clone().addScaledVector(d1, s).distanceTo(p2.clone().addScaledVector(d2, t)); }
  function hitSolid(it, sc, only) { for (const p of pts(it)) for (const so of S) { if (only && so !== only) continue; if (sc && !vis(so.obj, sc)) continue; so.obj.updateMatrixWorld(true);
    inv.copy(so.obj.matrixWorld).invert(); q.copy(p).applyMatrix4(inv); if (inside(q, so.s)) return so; } return null; }
  function inIntake(p, sc) { for (const k of K) { if (!vis(k.obj, sc)) continue; inv.copy(k.obj.matrixWorld).invert(); q.copy(p).applyMatrix4(inv);
    if (q.x > k.min.x && q.x < k.max.x && q.y > k.min.y && q.y < k.max.y && q.z > k.min.z && q.z < k.max.z) return true; } return false; }
  const onScreen = (p, cam) => { v.copy(p).project(cam); return v.z < 1 && Math.abs(v.x) < 1 && Math.abs(v.y) < 1; };
  // susun benda di atas tumpukan: naikkan y sampai tidak menembus benda lain/padatan (dipakai saat membangun scene)
  function settle(it, placed, y0, sc, step = .004 * U, maxY = 50 * U) {
    it.obj.position.y = y0; it.obj.updateMatrixWorld(true);
    for (let n = 0; n < 4000 && it.obj.position.y < maxY; n++) { const [A, B, r] = seg(it); let ok = true;
      for (const o of placed) { const [A2, B2, r2] = seg(o); if (segDist(A, B, A2, B2) < r + r2) { ok = false; break; } }
      if (ok && !hitSolid(it, sc)) return true; it.obj.position.y += step; it.obj.updateMatrixWorld(true); }
    return false; }
  function check(sc, cam, opt = {}) {
    const viol = window.__fxViol || (window.__fxViol = []), add = s => { if (!viol.includes(s)) viol.push(s); };
    sc.updateMatrixWorld(true); const live = I.filter(it => vis(it.obj, sc));
    const fixDone = sc.userData.__colFix === true;
    for (const it of live) { if (it.fix && fixDone) { for (const v_ of it.res || []) add(v_); continue; } const res = [];
      const so = hitSolid(it, sc); if (so) res.push(`tembus-${it.name}-${so.name}`);
      if (opt.ground) for (const p of pts(it)) if (p.y < opt.ground(p.x, p.z) - tol) { res.push(`tembus-lantai-${it.name}`); break; }
      res.forEach(add); if (it.fix) it.res = res; }
    const sg = live.map(seg);
    for (let i = 0; i < live.length; i++) for (let j = i + 1; j < live.length; j++) { if (fixDone && live[i].fix && live[j].fix) continue; const [A, B, r] = sg[i], [A2, B2, r2] = sg[j];
      if (A.distanceTo(A2) > (A.distanceTo(B) + A2.distanceTo(B2)) + r + r2) continue;
      if (segDist(A, B, A2, B2) < (r + r2) * .85) { const v_ = `tembus-${live[i].name}-${live[j].name}`; add(v_); if (live[i].fix && live[j].fix) (live[i].res = live[i].res || []).push(v_); } }
    sc.userData.__colFix = true;
    // lenyap/muncul: hanya antar-frame berurutan dalam shot yang sama
    // benda yang sama berpindah objek (dilepas dari tangan → objek jatuh) = lenyap & muncul di titik yang sama (≤10 cm) pada frame yang sama → sah
    if (opt.t !== undefined) { const ev = [];
      for (const it of I) { const now = vis(it.obj, sc), [A, B] = seg(it), c = A.clone().add(B).multiplyScalar(.5), pr = P.get(it);
        if (pr && pr.sc === sc && opt.t > pr.t && opt.t - pr.t < .2 && pr.shot === opt.shot) {
          if (pr.vis && !now) ev.push({ k: 'hilang', it, c: pr.c }); if (!pr.vis && now) ev.push({ k: 'muncul', it, c });
          if (pr.vis && now && c.distanceTo(pr.c) > 20 * U * (opt.t - pr.t) && (onScreen(c, cam) || onScreen(pr.c, cam))) add(`lompat-${it.name}`); /* benda berpindah tempat seketika (teleport) di dalam shot */ }
        P.set(it, { t: opt.t, shot: opt.shot, vis: now, c, sc }); }
      for (const e of ev) { if (ev.some(f => f.k !== e.k && f.c.distanceTo(e.c) < .1 * U)) continue;
        if (onScreen(e.c, cam) && !inIntake(e.c, sc)) add(`${e.k}-${e.it.name}`); } }
  }
  return { solid, item, intake, check, settle, seg, segDist, hitSolid, S, I, K };
}
