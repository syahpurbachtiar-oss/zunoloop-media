// ZunoLoop FX kit — overlay 2D gaya "bedah" (label tahap, caption karaoke, panah, chip ✗/✓,
// label part, onomatope, ULANG, emote, konfeti). Semua digambar ulang per frame (deterministik untuk render).
// Pakai:
//   import {makeFX} from './kit/fx.js';
//   const FX=makeFX(THREE, document.getElementById('st'), cam, renderer.domElement);
//   di render(t): FX.begin(); ...panggil efek...; FX.end();   (setelah R.render)
// Posisi bisa world (THREE.Vector3/array [x,y,z]) atau layar {x,y} (px, kanvas 1080x1920).
// SAFE ZONE (revisi 11 Nov 2026): y < 300 (UI nama akun IG/TikTok) dan y > 1500 (caption/deskripsi aplikasi)
// serta x > 960 (tombol like/share) TIDAK dipakai teks. label() & chip() digambar di end() dengan
// penghindaran tabrakan otomatis (tidak menimpa stage, karaoke, atau label lain) dan dijepit di dalam safe zone.

export function makeFX(THREE, host, cam, glCanvas) {
  const W = 1080, H = 1920;
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  Object.assign(cv.style, { position: 'absolute', left: 0, top: 0, width: W + 'px', height: H + 'px', zIndex: 8, pointerEvents: 'none' });
  host.appendChild(cv); const x = cv.getContext('2d');
  const FONT = 'Inter, "Plus Jakarta Sans", Arial, sans-serif';
  const BLUE = '#2f6bff', BLUE_D = '#1638a8', RED = '#ff3b3b', GREEN = '#1fbf5f', INK = '#0b1b33';
  const cl = (v, a, b) => v < a ? a : v > b ? b : v, eo = q => 1 - Math.pow(1 - q, 3);
  const bk = q => 1 + 2.70158 * Math.pow(q - 1, 3) + 1.70158 * Math.pow(q - 1, 2);
  const v3 = new THREE.Vector3();
  function scr(p) { if (p && p.x !== undefined && p.z === undefined) return { x: p.x, y: p.y, ok: true };
    Array.isArray(p) ? v3.set(...p) : v3.copy(p); v3.project(cam);
    return { x: (v3.x + 1) / 2 * W, y: (1 - v3.y) / 2 * H, ok: v3.z < 1 }; }
  // catatan: kamera template pakai setViewOffset(...,0,170,...), project() sudah memperhitungkannya.
  const rr = (X, Y, w, h, r) => { x.beginPath(); x.roundRect(X, Y, w, h, r); };
  const pop = u => u <= 0 ? 0 : bk(cl(u / .3, 0, 1));
  const fadeIO = (u, d, fi = .25, fo = .25) => u < 0 || u > d ? 0 : Math.min(cl(u / fi, 0, 1), cl((d - u) / fo, 0, 1));
  function textStroke(s, X, Y, size, fill = '#fff', stroke = INK, sw = .16, align = 'center', weight = 900, italic = '') {
    x.font = `${italic} ${weight} ${size}px ${FONT}`; x.textAlign = align; x.textBaseline = 'middle';
    x.lineJoin = 'round'; x.strokeStyle = stroke; x.lineWidth = size * sw; x.strokeText(s, X, Y); x.fillStyle = fill; x.fillText(s, X, Y); }

  const SAFE = { x0: 40, x1: 950, y0: 300, y1: 1490 };
  let occ = [], queue = [], segs = [];
  const hit = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  // segmen panah (tebal) juga dianggap terisi: label/chip/teks tidak boleh menimpa panah
  const segHit = (r, s_) => { const pad = s_.w / 2 + 6, R = { x: r.x - pad, y: r.y - pad, w: r.w + 2 * pad, h: r.h + 2 * pad };
    for (let k = 0; k <= 24; k++) { const q = k / 24, X = s_.a.x + (s_.b.x - s_.a.x) * q, Y = s_.a.y + (s_.b.y - s_.a.y) * q;
      if (X > R.x && X < R.x + R.w && Y > R.y && Y < R.y + R.h) return true; } return false; };
  const free = r => r.x >= SAFE.x0 && r.x + r.w <= SAFE.x1 + 90 && r.y >= SAFE.y0 && r.y + r.h <= SAFE.y1 && !occ.some(o => hit(r, o)) && !segs.some(s_ => segHit(r, s_));
  const Q = (pri, f) => queue.push({ pri, f });
  // kata kunci: string frasa ("serat optik"), array, atau '*' (semua kata) → Set kata bersih
  const clean = w => w.toLowerCase().replace(/[^a-z0-9à-ÿ\-]/gi, '');
  const keySet = key => key === '*' ? '*' : new Set((Array.isArray(key) ? key.join(' ') : (key || '')).split(/\s+/).map(clean).filter(Boolean));

  const FX = {
    canvas: cv, project: scr, SAFE,
    begin() { x.clearRect(0, 0, W, H); glCanvas.style.filter = ''; occ = []; queue = []; segs = []; },
    // urutan gambar: panah (0) → teks besar/boom/ULANG (1) → chip (2) → label (3); tiap elemen menghindari yang sudah ada
    end() { queue.sort((a, b) => a.pri - b.pri); for (const q of queue) q.f(); queue = []; },
    /* Daftarkan area yang TIDAK boleh tertutup teks (wajah karakter, layar HP, part penting). r = {x,y,w,h} px,
       atau avoidPts([Vector3...], pad) = kotak pembatas titik-titik dunia. Panggil SETELAH begin() dan sebelum efek lain. */
    avoid(r) { occ.push(r); },
    avoidPts(pts, pad = 20, hard = false) { let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9, any = false;
      for (const p of pts) { const q = scr(p); if (!q.ok) continue; any = true; x0 = Math.min(x0, q.x); y0 = Math.min(y0, q.y); x1 = Math.max(x1, q.x); y1 = Math.max(y1, q.y); }
      if (any && x1 > 0 && x0 < W && y1 > 0 && y0 < H) { const r = { x: x0 - pad, y: y0 - pad, w: x1 - x0 + 2 * pad, h: y1 - y0 + 2 * pad, hard }; occ.push(r); return r; } return null; },

    /* Label tahap kiri atas (di bawah UI aplikasi): baris kecil "• MASALAH: ..." + judul tebal.
       key = frasa yang disorot biru: satu kata, beberapa kata berurutan ("serat optik"), atau '*' = seluruh judul.
       Tidak harus sama dengan kata kunci karaoke. u = detik sejak adegan mulai */
    stage(problem, title, key, u, dur = 99) {
      const o = fadeIO(u, dur, .2, .2); if (!o) return; x.save(); x.globalAlpha = o;
      const X = 46, Y = 318; occ.push({ x: 30, y: Y - 26, w: 900, h: 130 });
      if (key === '*') key = title;
      // teks putih + garis tepi gelap + bayangan → terbaca di langit terang, laut, maupun luar angkasa hitam (revisi Ari 11 Nov)
      const shadowOn = () => { x.shadowColor = 'rgba(0,0,0,.55)'; x.shadowBlur = 10; x.shadowOffsetY = 4; }, shadowOff = () => { x.shadowColor = 'transparent'; x.shadowBlur = 0; x.shadowOffsetY = 0; };
      if (problem) { x.font = `800 30px ${FONT}`; x.textAlign = 'left'; x.textBaseline = 'middle'; x.lineJoin = 'round';
        const pt = '• ' + problem.toUpperCase(); shadowOn(); x.lineWidth = 7; x.strokeStyle = INK; x.strokeText(pt, X, Y); shadowOff(); x.fillStyle = '#fff'; x.fillText(pt, X, Y); }
      const sz = 60, s = eo(cl(u / .3, 0, 1)), dx = (1 - s) * -40; x.translate(dx, 0);
      x.font = `900 ${sz}px ${FONT}`; let cx = X; const ty = Y + 62;
      const parts = key && title.includes(key) ? title.split(key) : [title];
      const seg = (txt, boxed) => { if (!txt) return; const w = x.measureText(txt).width;
        if (boxed) { x.fillStyle = BLUE; rr(cx - 10, ty - sz * .62, w + 20, sz * 1.18, 10); x.fill(); x.strokeStyle = '#fff'; x.lineWidth = 5; x.stroke();
          x.fillStyle = '#fff'; x.fillText(txt, cx, ty + 2); }
        else { x.lineJoin = 'round'; shadowOn(); x.lineWidth = 12; x.strokeStyle = INK; x.strokeText(txt, cx, ty + 2); shadowOff(); x.fillStyle = '#fff'; x.fillText(txt, cx, ty + 2); }
        cx += w + (boxed ? 22 : 0); };
      x.textAlign = 'left'; x.textBaseline = 'middle';
      if (parts.length > 1) { seg(parts[0], false); seg(key, true); seg(parts.slice(1).join(key), false); } else seg(title, false);
      x.restore(); },

    /* Caption karaoke ala @kalbotau: kalimat dipecah per kelompok 2–4 kata (maks 2 baris); HANYA kata yang sudah
       diucapkan yang tampil (tanpa kata abu-abu), kata aktif pop. key = kata/frasa/array yang dikotak biru (boleh beda dari stage).
       p = 0..1 progres kalimat. Posisi di atas zona caption aplikasi. */
    karaoke(text, key, p, y = 1340) {
      const words = text.split(/\s+/).filter(Boolean); if (!words.length) return;
      const n = Math.min(words.length, Math.max(1, Math.ceil(cl(p, 0, 1) * words.length + .001))); const sz = 82; x.font = `900 ${sz}px ${FONT}`;
      // kelompok 2–4 kata, putus di tanda baca; kelompok berganti saat kata pertamanya diucapkan
      const groups = []; let g = [];
      words.forEach((w, i) => { g.push(i); const tw = x.measureText(g.map(j => words[j]).join(' ')).width;
        if (g.length >= 4 || tw > 1500 || (/[,.?!:…]$/.test(w) && g.length >= 2)) { groups.push(g); g = []; } });
      if (g.length) { if (g.length === 1 && groups.length) groups[groups.length - 1].push(...g); else groups.push(g); }
      const gi = groups.findIndex(G => G.includes(n - 1)), G = groups[Math.max(0, gi)];
      const lines = []; let cur = [], lw = 0; const maxW = 860;
      G.forEach(i => { const ww = x.measureText(words[i] + ' ').width; if (lw + ww > maxW && cur.length) { lines.push(cur); cur = []; lw = 0; } cur.push(i); lw += ww; });
      if (cur.length) lines.push(cur);
      const ks = keySet(key);
      const kr = yy => ({ x: 60, y: yy - sz * .75 - (lines.length - 1) * sz * .57, w: W - 120, h: sz * 1.15 * lines.length + sz * .3 });
      // posisi bebas pertama; bila semua tertutup objek penting, pilih yang tumpang tindihnya paling kecil
      const ov = r => occ.filter(o => o.hard).reduce((s_, o) => s_ + Math.max(0, Math.min(r.x + r.w, o.x + o.w) - Math.max(r.x, o.x)) * Math.max(0, Math.min(r.y + r.h, o.y + o.h) - Math.max(r.y, o.y)), 0);
      let best = null;
      for (const yy of [y, y + 110, y - 140, y + 60, y - 260, y - 400, y - 540, y - 680]) { const r = kr(yy); if (r.y + r.h > SAFE.y1 + 20 || r.y < SAFE.y0 + 120) continue;
        const v = ov(r); if (!best || v < best[1] - 1) best = [yy, v]; if (v === 0) break; }
      if (best) y = best[0];
      occ.push(kr(y));
      lines.forEach((L, r) => { const vis = L.filter(i => i < n); if (!vis.length) return;
        const tw = x.measureText(L.map(i => words[i]).join(' ')).width; let cx = W / 2 - tw / 2; const cy = y + r * (sz * 1.15) - (lines.length - 1) * sz * .57;
        L.forEach(i => { const w = words[i], ww = x.measureText(w).width, act = i === n - 1;
          if (i >= n) { cx += ww + x.measureText(' ').width; return; }
          const sc = act ? .82 + .18 * eo(cl(((p * words.length) % 1) / .35, 0, 1)) : 1;
          x.save(); x.translate(cx + ww / 2, cy); x.scale(sc, sc);
          if (ks === '*' || ks.has(clean(w))) { x.fillStyle = BLUE; rr(-ww / 2 - 12, -sz * .6, ww + 24, sz * 1.18, 12); x.fill(); x.strokeStyle = '#fff'; x.lineWidth = 6; x.stroke();
            x.fillStyle = '#fff'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(w, 0, 3); }
          else textStroke(w, 0, 3, sz, '#fff', INK, .2);
          x.restore(); cx += ww + x.measureText(' ').width; }); }); },

    /* Panah tebal bergaya (merah = gaya/masalah, biru = aliran, hijau = solusi). from/to world atau layar. */
    arrow(from, to, u, color = RED, width = 34) {
      const a0 = scr(from), b0 = scr(to); if (!a0.ok || !b0.ok) return; const g = eo(cl(u / .35, 0, 1)); if (!g) return;
      // jepit ke pita aman (di bawah label tahap, di atas subtitle) supaya tidak menimpa kotak label
      const top = SAFE.y0 + 150, bot = SAFE.y1 - 230, clipP = (p, o) => { let X = p.x, Y = p.y;
        if (Y < top || Y > bot) { const ty = Y < top ? top : bot, k = (ty - o.y) / ((Y - o.y) || 1e-6); if (k > 0 && k < 1) { X = o.x + (X - o.x) * k; Y = ty; } else Y = cl(Y, top, bot); }
        return { x: cl(X, SAFE.x0, SAFE.x1 + 60), y: Y }; };
      const a = clipP(a0, b0); let b = clipP(b0, a0);
      const inR = (P_, r) => P_.x > r.x && P_.x < r.x + r.w && P_.y > r.y && P_.y < r.y + r.h;
      const hits = (A_, B_) => occ.some(r => !inR(A_, r) && segHit(r, { a: A_, b: B_, w: width + 10 }));
      if (hits(a, b)) { let q = 1; while (q > .25 && hits(a, { x: a.x + (b.x - a.x) * q, y: a.y + (b.y - a.y) * q })) q -= .04; b = { x: a.x + (b.x - a.x) * q, y: a.y + (b.y - a.y) * q }; }
      if (Math.hypot(b.x - a.x, b.y - a.y) < 70) return;
      segs.push({ a, b, w: width + 14 });
      Q(0, () => {
      const bx = a.x + (b.x - a.x) * g, by = a.y + (b.y - a.y) * g, ang = Math.atan2(by - a.y, bx - a.x), hl = width * 1.6;
      const wob = Math.sin(u * 8) * 6 * (g >= 1 ? 1 : 0), ex = bx + Math.cos(ang) * wob, ey = by + Math.sin(ang) * wob;
      x.save(); x.lineCap = 'round'; x.strokeStyle = '#fff'; x.lineWidth = width + 14;
      const sx = ex - Math.cos(ang) * hl * .8, sy = ey - Math.sin(ang) * hl * .8;
      x.beginPath(); x.moveTo(a.x, a.y); x.lineTo(sx, sy); x.stroke(); x.strokeStyle = color; x.lineWidth = width; x.stroke();
      const head = () => { x.beginPath(); x.moveTo(ex + Math.cos(ang) * 6, ey + Math.sin(ang) * 6);
        x.lineTo(ex - Math.cos(ang - .55) * hl, ey - Math.sin(ang - .55) * hl); x.lineTo(ex - Math.cos(ang + .55) * hl, ey - Math.sin(ang + .55) * hl); x.closePath(); };
      head(); x.lineJoin = 'round'; x.strokeStyle = '#fff'; x.lineWidth = 12; x.stroke(); x.fillStyle = color; x.fill(); x.restore(); }); },

    /* Chip kecil di dekat objek: kind 'bad' (✗ merah), 'good' (✓ hijau), 'info' (biru) */
    chip(text, at, u, kind = 'info', dur = 99) {
      const o = fadeIO(u, dur, .2, .2); if (!o) return; const p0 = scr(at); if (!p0.ok) return;
      Q(2, () => {
      const col = { bad: RED, good: GREEN, info: BLUE }[kind], ic = { bad: '✕ ', good: '✓ ', info: '' }[kind];
      x.font = `800 42px ${FONT}`; const s2 = ic + text, w = x.measureText(s2).width + 44;
      // cari posisi bebas: titik asal lalu geser naik/turun/kiri/kanan
      const p1 = { x: cl(p0.x, SAFE.x0 + w / 2, SAFE.x1 + 80 - w / 2), y: cl(p0.y, SAFE.y0 + 30, SAFE.y1 - 30) }; let p = null;
      for (const [dx, dy] of [[0, 0], [0, -80], [0, 80], [0, -160], [0, 160], [-220, 0], [220, 0], [-300, -100], [300, -100], [-300, 100], [300, 100], [0, -260], [0, 260], [0, -380], [0, 380]]) {
        const c = { x: cl(p1.x + dx, SAFE.x0 + w / 2, SAFE.x1 + 80 - w / 2), y: cl(p1.y + dy, SAFE.y0 + 30, SAFE.y1 - 30) };
        if (free({ x: c.x - w / 2, y: c.y - 32, w, h: 64 })) { p = c; break; } }
      if (!p) return;
      occ.push({ x: p.x - w / 2, y: p.y - 32, w, h: 64 });
      x.save(); x.globalAlpha = o; x.translate(p.x, p.y); const s = pop(u); x.scale(s, s);
      x.fillStyle = 'rgba(0,0,0,.22)'; rr(-w / 2, -24, w, 60, 30); x.fill();
      x.fillStyle = col; rr(-w / 2, -30, w, 60, 30); x.fill(); x.strokeStyle = '#fff'; x.lineWidth = 5; x.stroke();
      x.fillStyle = '#fff'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(s2, 0, 1); x.restore(); }); },

    /* Label nama part: titik di part + garis + teks KAPITAL kecil. dx,dy offset label (px). */
    label(text, at, u, dx = 120, dy = -90, dur = 99) {
      const o = fadeIO(u, dur, .25, .2); if (!o) return; const p = scr(at); if (!p.ok) return;
      if (p.x < 0 || p.x > W || p.y < 0 || p.y > H) return; // titik part di luar layar → label tidak ditampilkan
      occ.push({ x: p.x - 24, y: p.y - 24, w: 48, h: 48 }); // titik part dilindungi: chip/teks lain tidak boleh menutupinya
      Q(3, () => {
      const T = text.toUpperCase(); x.font = `900 34px ${FONT}`; const tw = x.measureText(T).width + 20;
      // kandidat arah: pilihan pemanggil dulu, lalu cermin & variasi; pilih yang muat di safe zone & tidak menabrak
      const cands = [[dx, dy], [-dx, dy], [dx, -dy], [-dx, -dy], [dx * 1.6, dy * .4], [-dx * 1.6, dy * .4], [0, dy * 1.5], [0, -dy * 1.5]];
      let pick = null;
      for (const [cx_, cy_] of cands) { const lx = p.x + cx_, ly = p.y + cy_, left = cx_ < 0;
        const r = { x: left ? lx - 10 - tw : lx, y: ly - 24, w: tw + 10, h: 48 };
        // garis penunjuk juga tidak boleh melintasi chip/teks/panah lain (abaikan 30px pertama = titik part sendiri)
        const L_ = Math.hypot(cx_, cy_), lineFree = !occ.some(o => { for (let k = 1; k <= 20; k++) { const q = k / 20; if (q * L_ < 30) continue;
          const X = p.x + cx_ * q, Y = p.y + cy_ * q; if (X > o.x && X < o.x + o.w && Y > o.y && Y < o.y + o.h) return true; } return false; });
        if (lineFree && free(r)) { pick = [cx_, cy_, r]; break; } }
      if (!pick) return; // tidak ada tempat aman → lebih baik tidak tampil daripada menabrak/terpotong
      occ.push(pick[2]);
      const g = eo(cl(u / .4, 0, 1)), lx = p.x + pick[0] * g, ly = p.y + pick[1] * g, left = pick[0] < 0;
      x.save(); x.globalAlpha = o; x.strokeStyle = INK; x.lineWidth = 4; x.beginPath(); x.moveTo(p.x, p.y); x.lineTo(lx, ly); x.stroke();
      x.fillStyle = '#fff'; x.beginPath(); x.arc(p.x, p.y, 9, 0, 7); x.fill(); x.stroke();
      x.textAlign = left ? 'right' : 'left'; x.textBaseline = 'middle';
      x.lineWidth = 9; x.strokeStyle = '#fff'; x.lineJoin = 'round'; const tx = lx + (left ? -10 : 10);
      x.strokeText(T, tx, ly); x.fillStyle = INK; x.fillText(T, tx, ly); x.restore(); }); },

    /* Onomatope besar miring (KRAAAK!, BLUP!, WUSSH!, SELAMAT!) */
    boom(text, at, u, color = '#3c6bff', dur = 1.2, size = 120) {
      const o = fadeIO(u, dur, .05, .25); if (!o) return; const p0 = scr(at);
      Q(1, () => {
      // cari tempat yang tidak menutupi wajah/HP/label/panah: titik pilihan dulu, lalu atas, bawah, tengah; kecilkan bila perlu
      const cands = [[p0.x, p0.y], [300, 560], [780, 560], [540, 500], [300, 1060], [780, 1060], [540, 1120], [300, 800], [780, 800], [540, 640], [540, 1000], [540, 760], [540, 880], [190, 520], [890, 520], [190, 1100], [890, 1100]];
      let pick = null, sz = size;
      for (let shrink = 0; shrink < 5 && !pick; shrink++, sz *= .84) {
        x.font = `italic 900 ${sz}px ${FONT}`; const tw = x.measureText(text).width * 1.05 + sz * .3, th = sz * 1.25;
        for (const [cx, cy] of cands) { const r = { x: cl(cx, SAFE.x0 + tw / 2, SAFE.x1 + 50 - tw / 2) - tw / 2, y: cy - th / 2, w: tw, h: th };
          if (free(r)) { pick = [r.x + tw / 2, cy, r]; break; } } }
      if (!pick) return; // tidak ada tempat yang tidak menutupi apa pun → tidak ditampilkan
      occ.push(pick[2]);
      const s = pop(u) * (1 + Math.max(0, u - .3) * .05), sh = u < .35 ? Math.sin(u * 90) * 8 : 0;
      x.save(); x.globalAlpha = o; x.translate(pick[0] + sh, pick[1]); x.rotate(-.08); x.scale(s, s);
      textStroke(text, 0, 0, sz, color, '#fff', .22, 'center', 900, 'italic');
      x.lineWidth = 4; x.strokeStyle = INK; x.font = `italic 900 ${sz}px ${FONT}`; x.strokeText(text, 0, 0); x.restore(); }); },

    /* Efek mundur saat percobaan gagal: layar desaturasi + garis + "◀◀ ULANG" */
    rewind(u, dur = 1.0) {
      if (u < 0 || u > dur) return; const k = Math.sin(cl(u / dur, 0, 1) * Math.PI);
      glCanvas.style.filter = `grayscale(${(k * .85).toFixed(2)}) contrast(${(1 + k * .15).toFixed(2)})`;
      x.save(); x.globalAlpha = k * .25; x.fillStyle = '#fff'; for (let yy = (u * 900) % 24; yy < H; yy += 24) x.fillRect(0, yy, W, 3); x.restore();
      Q(1, () => { x.font = `italic 900 120px ${FONT}`; const tw = x.measureText('◀◀ ULANG').width + 40; let py = null;
        for (const cy of [1100, 560, 980, 680, 820]) { const r = { x: 540 - tw / 2, y: cy - 75, w: tw, h: 150 }; if (free(r)) { py = cy; occ.push(r); break; } }
        if (py === null) return;
        x.save(); x.globalAlpha = Math.min(1, k * 2); x.translate(W / 2, py); x.rotate(-.06); x.scale(.9 + k * .1, .9 + k * .1);
        textStroke('◀◀ ULANG', 0, 0, 120, '#2f6bff', '#fff', .2, 'center', 900, 'italic'); x.restore(); }); },

    /* Emote di atas kepala karakter: '!' (kaget), '?' (bingung), 'idea' (bohlam), 'sweat' (keringat), 'love' */
    emote(type, at, u, dur = 1.4) {
      const o = fadeIO(u, dur, .1, .25); if (!o) return; const p = scr(at); if (!p.ok) return;
      if (p.y < SAFE.y0 + 140 || p.y > SAFE.y1 - 60) return; // jangan masuk area label tahap / subtitle
      occ.push({ x: p.x - 55, y: p.y - 65, w: 110, h: 125 });
      const s = pop(u), bob = Math.sin(u * 6) * 6;
      x.save(); x.globalAlpha = o; x.translate(p.x, p.y + bob); x.scale(s, s);
      if (type === 'sweat') { x.fillStyle = '#7cc6ff'; x.strokeStyle = '#fff'; x.lineWidth = 5; x.beginPath(); x.moveTo(0, -40); x.quadraticCurveTo(26, 0, 0, 18); x.quadraticCurveTo(-26, 0, 0, -40); x.fill(); x.stroke(); }
      else { x.fillStyle = '#fff'; x.strokeStyle = INK; x.lineWidth = 6; x.beginPath(); x.arc(0, -10, 48, 0, 7); x.fill(); x.stroke();
        x.beginPath(); x.moveTo(-14, 30); x.lineTo(0, 54); x.lineTo(10, 32); x.fill();
        if (type === 'idea') { x.fillStyle = '#ffd23f'; x.beginPath(); x.arc(0, -18, 22, 0, 7); x.fill(); x.stroke(); x.fillStyle = '#8a95a3'; x.fillRect(-11, 4, 22, 14); }
        else if (type === 'love') { x.fillStyle = RED; x.beginPath(); x.moveTo(0, 12); x.bezierCurveTo(-40, -20, -14, -48, 0, -26); x.bezierCurveTo(14, -48, 40, -20, 0, 12); x.fill(); }
        else textStroke(type, 0, -8, 70, type === '!' ? RED : BLUE, '#fff', .05); }
      x.restore(); },

    /* Konfeti + teks besar (dipakai di adegan "Selamat!") */
    confetti(u, seed = 3) {
      if (u < 0) return; let s = seed; const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
      const cols = ['#ffd23f', '#2f6bff', '#ff5c7a', '#1fbf5f', '#ff8a3d'];
      for (let i = 0; i < 120; i++) { const x0 = r() * W, vy = 380 + r() * 520, ph = r() * 6, c = cols[i % 5];
        const yy = -60 + vy * u + 40 * Math.sin(u * 3 + ph), xx = x0 + 70 * Math.sin(u * 2 + ph); if (yy > H) continue;
        x.save(); x.translate(xx, yy); x.rotate(u * 6 + ph); x.fillStyle = c; x.fillRect(-9, -5, 18, 10); x.restore(); } },

    /* Garis gerak/angin, panas, getar: lines(at, u, 'wind'|'heat'|'speed') */
    lines(at, u, kind = 'wind', count = 7) {
      const p = scr(at); if (!p.ok) return; x.save(); x.lineCap = 'round';
      for (let i = 0; i < count; i++) { const ph = (u * 1.6 + i / count) % 1, yy = p.y - 120 + i * 40;
        if (kind === 'heat') { x.strokeStyle = 'rgba(255,90,60,.8)'; x.lineWidth = 7; x.beginPath();
          for (let k = 0; k < 6; k++) { const xx = p.x - 90 + i * 30 + Math.sin(k * 1.4 + u * 8) * 10, y2 = p.y - k * 22 - ph * 40; k ? x.lineTo(xx, y2) : x.moveTo(xx, y2); } x.stroke(); }
        else { x.strokeStyle = kind === 'speed' ? 'rgba(255,255,255,.9)' : 'rgba(255,255,255,.75)'; x.lineWidth = 6;
          const xx = p.x - 260 + ph * 520; x.beginPath(); x.moveTo(xx, yy); x.lineTo(xx + 110, yy); x.stroke(); } }
      x.restore(); },

    /* Kilat putih pendek saat ganti adegan/momen dramatis */
    flash(u, a = .35) { if (u < 0 || u > .18) return; x.save(); x.globalAlpha = (1 - u / .18) * a; x.fillStyle = '#fff'; x.fillRect(0, 0, W, H); x.restore(); },
  };
  return FX;
}
