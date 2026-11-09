// ZunoLoop FX kit — overlay 2D gaya "bedah" (label tahap, caption karaoke, panah, chip ✗/✓,
// label part, onomatope, ULANG, emote, konfeti). Semua digambar ulang per frame (deterministik untuk render).
// Pakai:
//   import {makeFX} from './kit/fx.js';
//   const FX=makeFX(THREE, document.getElementById('st'), cam, renderer.domElement);
//   di render(t): FX.begin(); ...panggil efek...; FX.end();   (setelah R.render)
// Posisi bisa world (THREE.Vector3/array [x,y,z]) atau layar {x,y} (px, kanvas 1080x1920).

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

  const FX = {
    canvas: cv, project: scr,
    begin() { x.clearRect(0, 0, W, H); glCanvas.style.filter = ''; },
    end() {},

    /* Label tahap pojok kiri atas: baris kecil "• MASALAH: ..." + judul tebal, kata kunci di kotak biru. u = detik sejak adegan mulai */
    stage(problem, title, key, u, dur = 99) {
      const o = fadeIO(u, dur, .2, .2); if (!o) return; x.save(); x.globalAlpha = o;
      const X = 46, Y = 236;
      if (problem) { x.font = `800 30px ${FONT}`; x.textAlign = 'left'; x.textBaseline = 'middle';
        x.fillStyle = 'rgba(11,27,51,.85)'; x.fillText('• ' + problem.toUpperCase(), X, Y); }
      const sz = 60, s = eo(cl(u / .3, 0, 1)), dx = (1 - s) * -40; x.translate(dx, 0);
      x.font = `900 ${sz}px ${FONT}`; let cx = X; const ty = Y + 62;
      const parts = key && title.includes(key) ? title.split(key) : [title];
      const seg = (txt, boxed) => { if (!txt) return; const w = x.measureText(txt).width;
        if (boxed) { x.fillStyle = BLUE; rr(cx - 10, ty - sz * .62, w + 20, sz * 1.18, 10); x.fill(); x.strokeStyle = '#fff'; x.lineWidth = 5; x.stroke();
          x.fillStyle = '#fff'; x.fillText(txt, cx, ty + 2); }
        else { x.lineWidth = 12; x.strokeStyle = '#fff'; x.lineJoin = 'round'; x.strokeText(txt, cx, ty + 2); x.fillStyle = INK; x.fillText(txt, cx, ty + 2); }
        cx += w + (boxed ? 22 : 0); };
      x.textAlign = 'left'; x.textBaseline = 'middle';
      if (parts.length > 1) { seg(parts[0], false); seg(key, true); seg(parts.slice(1).join(key), false); } else seg(title, false);
      x.restore(); },

    /* Caption karaoke: kata muncul satu-satu (p = 0..1 progres kalimat), kata kunci dikotak biru, kata aktif pop. Max 2 baris, jendela bergeser. */
    karaoke(text, key, p, y = 1460) {
      const words = text.split(/\s+/).filter(Boolean); if (!words.length) return;
      const n = Math.min(words.length, Math.max(1, Math.ceil(cl(p, 0, 1) * words.length + .001))); const sz = 84; x.font = `900 ${sz}px ${FONT}`;
      const lines = []; let cur = [], lw = 0; const maxW = 900;
      words.forEach((w, i) => { const ww = x.measureText(w + ' ').width; if (lw + ww > maxW && cur.length) { lines.push(cur); cur = []; lw = 0; } cur.push(i); lw += ww; });
      if (cur.length) lines.push(cur);
      let li = lines.findIndex(L => L.includes(n - 1)); const show = lines.slice(Math.max(0, li - 1), li + 1);
      const keyset = new Set((key || '').toLowerCase().split(/\s+/));
      show.forEach((L, r) => { const ws = L.map(i => words[i]); const tw = x.measureText(ws.join(' ')).width; let cx = W / 2 - tw / 2; const cy = y + r * (sz * 1.15) - (show.length - 1) * sz * .57;
        L.forEach(i => { const w = words[i], ww = x.measureText(w).width, vis = i < n, act = i === n - 1;
          const clean = w.toLowerCase().replace(/[^a-z0-9à-ÿ\-]/gi, '');
          const sc = act ? .82 + .18 * eo(cl(((p * words.length) % 1) / .35, 0, 1)) : 1;
          x.save(); x.translate(cx + ww / 2, cy); x.scale(sc, sc); x.globalAlpha = vis ? 1 : .32;
          if (vis && keyset.has(clean)) { x.fillStyle = BLUE; rr(-ww / 2 - 12, -sz * .6, ww + 24, sz * 1.18, 12); x.fill(); x.strokeStyle = '#fff'; x.lineWidth = 6; x.stroke();
            x.fillStyle = '#fff'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(w, 0, 3); }
          else textStroke(w, 0, 3, sz, '#fff', INK, .2);
          x.restore(); cx += ww + x.measureText(' ').width; }); }); },

    /* Panah tebal bergaya (merah = gaya/masalah, biru = aliran, hijau = solusi). from/to world atau layar. */
    arrow(from, to, u, color = RED, width = 34) {
      const a = scr(from), b = scr(to); if (!a.ok || !b.ok) return; const g = eo(cl(u / .35, 0, 1)); if (!g) return;
      const bx = a.x + (b.x - a.x) * g, by = a.y + (b.y - a.y) * g, ang = Math.atan2(by - a.y, bx - a.x), hl = width * 1.6;
      const wob = Math.sin(u * 8) * 6 * (g >= 1 ? 1 : 0), ex = bx + Math.cos(ang) * wob, ey = by + Math.sin(ang) * wob;
      x.save(); x.lineCap = 'round'; x.strokeStyle = '#fff'; x.lineWidth = width + 14;
      const sx = ex - Math.cos(ang) * hl * .8, sy = ey - Math.sin(ang) * hl * .8;
      x.beginPath(); x.moveTo(a.x, a.y); x.lineTo(sx, sy); x.stroke(); x.strokeStyle = color; x.lineWidth = width; x.stroke();
      const head = () => { x.beginPath(); x.moveTo(ex + Math.cos(ang) * 6, ey + Math.sin(ang) * 6);
        x.lineTo(ex - Math.cos(ang - .55) * hl, ey - Math.sin(ang - .55) * hl); x.lineTo(ex - Math.cos(ang + .55) * hl, ey - Math.sin(ang + .55) * hl); x.closePath(); };
      head(); x.lineJoin = 'round'; x.strokeStyle = '#fff'; x.lineWidth = 12; x.stroke(); x.fillStyle = color; x.fill(); x.restore(); },

    /* Chip kecil di dekat objek: kind 'bad' (✗ merah), 'good' (✓ hijau), 'info' (biru) */
    chip(text, at, u, kind = 'info', dur = 99) {
      const o = fadeIO(u, dur, .2, .2); if (!o) return; const p = scr(at); if (!p.ok) return;
      const col = { bad: RED, good: GREEN, info: BLUE }[kind], ic = { bad: '✕ ', good: '✓ ', info: '' }[kind];
      x.save(); x.globalAlpha = o; x.translate(p.x, p.y); const s = pop(u); x.scale(s, s);
      x.font = `800 42px ${FONT}`; const s2 = ic + text, w = x.measureText(s2).width + 44;
      x.fillStyle = 'rgba(0,0,0,.22)'; rr(-w / 2, -24, w, 60, 30); x.fill();
      x.fillStyle = col; rr(-w / 2, -30, w, 60, 30); x.fill(); x.strokeStyle = '#fff'; x.lineWidth = 5; x.stroke();
      x.fillStyle = '#fff'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(s2, 0, 1); x.restore(); },

    /* Label nama part: titik di part + garis + teks KAPITAL kecil. dx,dy offset label (px). */
    label(text, at, u, dx = 120, dy = -90, dur = 99) {
      const o = fadeIO(u, dur, .25, .2); if (!o) return; const p = scr(at); if (!p.ok) return;
      const g = eo(cl(u / .4, 0, 1)), lx = p.x + dx * g, ly = p.y + dy * g;
      x.save(); x.globalAlpha = o; x.strokeStyle = INK; x.lineWidth = 4; x.beginPath(); x.moveTo(p.x, p.y); x.lineTo(lx, ly); x.stroke();
      x.fillStyle = '#fff'; x.beginPath(); x.arc(p.x, p.y, 9, 0, 7); x.fill(); x.stroke();
      x.font = `900 34px ${FONT}`; x.textAlign = dx >= 0 ? 'left' : 'right'; x.textBaseline = 'middle';
      x.lineWidth = 9; x.strokeStyle = '#fff'; x.lineJoin = 'round'; const tx = lx + (dx >= 0 ? 10 : -10);
      x.strokeText(text.toUpperCase(), tx, ly); x.fillStyle = INK; x.fillText(text.toUpperCase(), tx, ly); x.restore(); },

    /* Onomatope besar miring (KRAAAK!, BLUP!, WUSSH!, SELAMAT!) */
    boom(text, at, u, color = '#3c6bff', dur = 1.2, size = 120) {
      const o = fadeIO(u, dur, .05, .25); if (!o) return; const p = scr(at);
      const s = pop(u) * (1 + Math.max(0, u - .3) * .05), sh = u < .35 ? Math.sin(u * 90) * 8 : 0;
      x.save(); x.globalAlpha = o; x.translate(p.x + sh, p.y); x.rotate(-.12); x.scale(s, s);
      textStroke(text, 0, 0, size, color, '#fff', .22, 'center', 900, 'italic');
      x.lineWidth = 4; x.strokeStyle = INK; x.font = `italic 900 ${size}px ${FONT}`; x.strokeText(text, 0, 0); x.restore(); },

    /* Efek mundur saat percobaan gagal: layar desaturasi + garis + "◀◀ ULANG" */
    rewind(u, dur = 1.0) {
      if (u < 0 || u > dur) return; const k = Math.sin(cl(u / dur, 0, 1) * Math.PI);
      glCanvas.style.filter = `grayscale(${(k * .85).toFixed(2)}) contrast(${(1 + k * .15).toFixed(2)})`;
      x.save(); x.globalAlpha = k * .25; x.fillStyle = '#fff'; for (let yy = (u * 900) % 24; yy < H; yy += 24) x.fillRect(0, yy, W, 3); x.restore();
      x.save(); x.globalAlpha = Math.min(1, k * 2); x.translate(W / 2, 900); x.rotate(-.1); x.scale(.9 + k * .1, .9 + k * .1);
      textStroke('◀◀ ULANG', 0, 0, 130, '#2f6bff', '#fff', .2, 'center', 900, 'italic'); x.restore(); },

    /* Emote di atas kepala karakter: '!' (kaget), '?' (bingung), 'idea' (bohlam), 'sweat' (keringat), 'love' */
    emote(type, at, u, dur = 1.4) {
      const o = fadeIO(u, dur, .1, .25); if (!o) return; const p = scr(at); if (!p.ok) return;
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
