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
    // 3) anatomi: tidak ada NaN / sendi lepas (tangan & kepala harus dekat badan)
    const t = c.torso.getWorldPosition(new THREE.Vector3()), h = c.head.getWorldPosition(new THREE.Vector3());
    if (![t.x, t.y, t.z, h.x, h.y, h.z].every(Number.isFinite)) { viol.push(`anatomi-nan-${k}`); continue; }
    if (h.distanceTo(t) / U > .9) viol.push(`kepala-lepas-${k}`);
    for (const a of c.arms) { const p = a.hand.getWorldPosition(new THREE.Vector3()); if (p.distanceTo(t) / U > 1.1) viol.push(`tangan-lepas-${k}`); }
  }
}
function isIn(o, scene) { while (o) { if (o === scene) return true; o = o.parent; } return false; }
