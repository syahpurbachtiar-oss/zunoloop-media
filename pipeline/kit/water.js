// ZunoLoop kit air 3D kontinu (revisi Ari 14 Nov 2026: air TIDAK boleh digambar sebagai bola-bola).
// Bola/dots() hanya untuk benda yang memang butiran: mikroba, garam/ion, debu, gelembung, percikan kecil.
// Semua ukuran dalam satuan dunia (sudah dikali m()). Panggil liquid.update(t) sekali per frame di render(t).
export function makeLiquid(THREE) {
  const mats = [];
  // tekstur garis-garis lembut → terlihat mengalir saat offset digeser
  const flowTex = () => { const c = document.createElement('canvas'); c.width = 64; c.height = 256; const x = c.getContext('2d');
    x.fillStyle = '#fff'; x.fillRect(0, 0, 64, 256);
    for (let i = 0; i < 26; i++) { const y = (i * 97) % 256, w = 4 + (i * 37) % 22; x.fillStyle = `rgba(150,200,235,${.25 + (i % 3) * .12})`; x.fillRect((i * 23) % 64, y, w, 18 + (i * 13) % 40); }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; return t; };
  // permukaan beriak untuk bak/tangki/gelas
  const rippleTex = () => { const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d');
    x.fillStyle = '#fff'; x.fillRect(0, 0, 128, 128); x.strokeStyle = 'rgba(140,195,235,.3)'; x.lineWidth = 2;
    for (let i = 0; i < 9; i++) { x.beginPath(); x.ellipse((i * 41) % 128, (i * 67) % 128, 10 + (i * 7) % 18, 5 + (i * 5) % 9, 0, 0, Math.PI * 2); x.stroke(); }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; return t; };

  /** Material air. color: biru jernih default; untuk air laut/limbah ganti warna, bukan bentuk. speed = kecepatan alir (repeat/detik). */
  function mat({ color = 0x3fa2e0, opacity = .8, speed = 1.2, rep = [1, 4], ripple = false } = {}) {
    const map = ripple ? rippleTex() : flowTex(); map.repeat.set(...rep);
    const m_ = new THREE.MeshStandardMaterial({ color, map, transparent: true, opacity, roughness: .08, metalness: .1, emissive: color, emissiveIntensity: .12 });
    m_.userData.speed = speed; m_.userData.ripple = ripple; mats.push(m_); return m_;
  }

  /** Aliran air sepanjang kurva (pipa terbuka, kanal, semburan). pts = Vector3[] dunia. set(k): 0..1 panjang yang sudah terisi. */
  function stream(pts, r, material = mat()) {
    const curve = new THREE.CatmullRomCurve3(pts), seg = Math.max(24, pts.length * 24);
    const g = new THREE.TubeGeometry(curve, seg, r, 14, false), mesh = new THREE.Mesh(g, material); mesh.castShadow = false;
    const n = g.index.count;
    return { mesh, curve, set(k) { const c = Math.max(0, Math.min(1, k)); mesh.visible = c > .001; g.setDrawRange(0, Math.floor(n * c / 6) * 6); } };
  }

  /** Tuangan jatuh dari `from` ke `to` (parabola) + cincin cipratan di bawah. set(k, t): k = 0..1 seberapa jauh tuangan sudah jatuh. */
  function pour(from, to, r, material = mat({ rep: [1, 3], speed: 2.2 })) {
    const mid = from.clone().lerp(to, .5); mid.y = Math.max(from.y, to.y) - (from.y - to.y) * .15;
    const s = stream([from, from.clone().lerp(mid, .5), mid, to], r, material);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(r * 2.2, r * .35, 8, 24), material); ring.rotation.x = Math.PI / 2; ring.position.copy(to);
    const grp = new THREE.Group(); grp.add(s.mesh, ring);
    return { mesh: grp, set(k, t = 0) { s.set(k); ring.visible = k >= .99; const w = 1 + .25 * Math.sin(t * 9); ring.scale.set(w, w, 1); } };
  }

  /** Isi bak/tangki/gelas berbentuk kotak (w,h,d) atau silinder (shape:'cyl', w = diameter). Alas di y=0 grup. setLevel(f) 0..1. */
  function body(w, h, d, { color = 0x3fa2e0, opacity = .62, shape = 'box' } = {}) {
    const grp = new THREE.Group();
    const vol = new THREE.MeshStandardMaterial({ color, transparent: true, opacity, roughness: .1, metalness: .05, depthWrite: false });
    const geo = shape === 'cyl' ? new THREE.CylinderGeometry(w / 2, w / 2, 1, 32) : new THREE.BoxGeometry(w, 1, d);
    geo.translate(0, .5, 0); const v = new THREE.Mesh(geo, vol); v.castShadow = false; grp.add(v);
    const top = new THREE.Mesh(shape === 'cyl' ? new THREE.CircleGeometry(w / 2 * .995, 32) : new THREE.PlaneGeometry(w * .995, d * .995), mat({ color, opacity: .9, ripple: true, rep: [2, 2], speed: .15 }));
    top.rotation.x = -Math.PI / 2; grp.add(top);
    const api = { mesh: grp, level: 1, setLevel(f) { api.level = Math.max(.001, f); v.scale.y = h * api.level; top.position.y = h * api.level + .001 * h; } };
    api.setLevel(1); return api;
  }

  function update(t) { for (const m_ of mats) { const sp = m_.userData.speed; if (m_.userData.ripple) { m_.map.offset.set(t * sp, t * sp * .6); } else m_.map.offset.y = -t * sp; } }
  return { mat, stream, pour, body, update };
}

/** Rentang kedalaman kamera dinamis — WAJIB dipanggil tiap frame setelah cam.lookAt(tg).
 * Near tetap 5 cm + far 2,6 km membuat lapisan tipis (jalan 2 cm di atas pasir) hilang-muncul (bug kedap-kedip 13 Nov 2026). */
export function autoNear(cam, target, U) {
  cam.near = Math.max(.05 * U, Math.min(5 * U, cam.position.distanceTo(target) * .02)) ; cam.updateProjectionMatrix();
  if (window.__jit) { cam.position.x += window.__jit * U; cam.position.y += window.__jit * U * .7; cam.updateMatrixWorld(); } // geser kamera 2 mm: dipakai zfight.py
}
