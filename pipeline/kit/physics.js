// ZunoLoop KISI fisika & anatomi karakter — dipanggil tiap frame di render(t), SEBELUM FX.end().
// Pelanggaran masuk window.__fxViol → render.py → qc_fx.json → qc.py GAGAL.
// Pakai: import {checkCast} from './kit/physics.js';
//        checkCast(THREE, C, sc, (x,z)=>tinggiTanahDunia, {U:C.M, allow:{melayang:['celebrate','shock','climb']}})
// groundFn(xWorld, zWorld) → y dunia permukaan tempat karakter berdiri (lantai 0, lereng ski: yAt, atap, dll.).
export function checkCast(THREE, C, scene, groundFn, opt = {}) {
  const U = opt.U || C.M, v = new THREE.Vector3(), box = new THREE.Box3();
  const free = { celebrate: 1, shock: 1, climb: 1, ...(opt.allowFloat || {}) };
  const viol = window.__fxViol || (window.__fxViol = []);
  for (const k of ['ayah', 'ibu', 'kakak', 'adik', 'orang']) {
    const c = C[k]; if (!c || !c.root.visible || !isIn(c.root, scene)) continue;
    c.root.updateMatrixWorld(true);
    // 1) skala: tinggi tubuh harus sesuai heightM (±6%) — karakter tidak boleh di-scale sembarangan
    const sw = new THREE.Vector3(); c.root.getWorldScale(sw);
    if (Math.abs(sw.y - 1) > .06) viol.push(`skala-${k}`);
    // 2) kaki: sol terendah harus di permukaan (toleransi 4 cm) kecuali pose melompat/memanjat
    if (free[c.pose] || c.pose === 'ski') { /* ski: papan di bawah sol, dicek lewat papan */ }
    else {
      let lo = Infinity, fx = 0, fz = 0;
      c.root.traverse(o => { if (o.userData && o.userData.sole) { box.setFromObject(o); if (box.min.y < lo) { lo = box.min.y; box.getCenter(v); fx = v.x; fz = v.z; } } });
      if (lo < Infinity) { const g = groundFn(fx, fz); const gap = (lo - g) / U;
        if (gap > .04) viol.push(`kaki-melayang-${k}`); if (gap < -.05) viol.push(`kaki-tembus-${k}`); }
    }
    // 2b) arah jalan (revisi Ari 16 Nov 2026: "kok jalannya mundur"): pose berjalan harus bergerak MAJU searah hadapan badan;
    //     pose diam tidak boleh meluncur. Butuh opt.t (detik video) agar kecepatan antar-frame bisa dihitung.
    if (opt.t !== undefined) { const P = (window.__castPrev || (window.__castPrev = {})), wp = c.root.getWorldPosition(new THREE.Vector3()), pr = P[k];
      const qw = c.root.getWorldQuaternion(new THREE.Quaternion()), fw = new THREE.Vector3(0, 0, 1).applyQuaternion(qw);
      if (pr && opt.t > pr.t && opt.t - pr.t < .2 && pr.shot === opt.shot) { /* potongan shot (opt.shot berganti) = lompatan kamera/lokasi, bukan meluncur */ const dt = opt.t - pr.t, vx = (wp.x - pr.x) / dt / U, vz = (wp.z - pr.z) / dt / U, sp = Math.hypot(vx, vz);
        const walking = /^(walk|push|carry)$/.test(c.pose);
        if (walking && sp > .15 && (vx * fw.x + vz * fw.z) / sp < .5) viol.push(`jalan-mundur-${k}`);
        if (walking && sp < .15) viol.push(`jalan-di-tempat-${k}`);
        if (!walking && !/^(ski|climb)$/.test(c.pose) && sp > .4) viol.push(`meluncur-${k}`); }
      P[k] = { t: opt.t, x: wp.x, z: wp.z, shot: opt.shot }; }
    // 3) anatomi: tidak ada NaN / sendi lepas (tangan & kepala harus dekat badan)
    const t = c.torso.getWorldPosition(new THREE.Vector3()), h = c.head.getWorldPosition(new THREE.Vector3());
    if (![t.x, t.y, t.z, h.x, h.y, h.z].every(Number.isFinite)) { viol.push(`anatomi-nan-${k}`); continue; }
    if (h.distanceTo(t) / U > .9) viol.push(`kepala-lepas-${k}`);
    for (const a of c.arms) { const p = a.hand.getWorldPosition(new THREE.Vector3()); if (p.distanceTo(t) / U > 1.1) viol.push(`tangan-lepas-${k}`); }
    // 4) pose wajar & proporsional (revisi Ari 26 Nov 2026: "kalau jongkok ya jongkok yang natural" — kaki jongkok tampak seperti lepas sepatu).
    //    Sendi dalam batas anatomi; pergelangan kaki ≤0,75 rad (batas tekuk telapak saat jongkok); telapak yang menapak rata di pose diam;
    //    pinggul berada di atas telapak (seimbang). Ski/memanjat punya aturan sendiri.
    if (c.legs && !/^(ski|climb)$/.test(c.pose)) {
      const still = !free[c.pose] && !/^(walk|push|carry)$/.test(c.pose), up = new THREE.Vector3(0, 1, 0), q = new THREE.Quaternion(), fm = new THREE.Vector3(); let nf = 0;
      for (const l of c.legs) { const hx = l.p.rotation.x, kx = l.knee.rotation.x;
        if (hx < -2.3 || hx > .9 || Math.abs(l.p.rotation.z) > .5) viol.push(`sendi-pinggul-${k}`);
        if (kx < -.05 || kx > 2.35) viol.push(`sendi-lutut-${k}`);
        const ys = up.clone().applyQuaternion(l.knee.getWorldQuaternion(q)), yf = up.clone().applyQuaternion(l.foot.getWorldQuaternion(q));
        if (ys.angleTo(yf) > .75) viol.push(`pergelangan-tertekuk-${k}`);
        box.setFromObject(l.foot); box.getCenter(v); fm.add(v); nf++;
        if (still && (box.min.y - groundFn(v.x, v.z)) / U < .04 && yf.angleTo(up) > .3) viol.push(`telapak-miring-${k}`); }
      for (const a of c.arms) { const ex = a.el.rotation.x, sx = a.sh.rotation.x; if (ex < -2.7 || ex > .15) viol.push(`sendi-siku-${k}`); if (sx < -3.3 || sx > 1.3) viol.push(`sendi-bahu-${k}`); }
      if (still && nf) { fm.divideScalar(nf); const hp = c.hips.getWorldPosition(new THREE.Vector3()); if (Math.hypot(hp.x - fm.x, hp.z - fm.z) / U > .35) viol.push(`tidak-seimbang-${k}`); }
    }
  }
}
function isIn(o, scene) { while (o) { if (o === scene) return true; o = o.parent; } return false; }
