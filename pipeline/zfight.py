"""Deteksi permukaan sebidang (z-fighting) — belang kecil yang bergeser, yang lolos dari qc.py.

Pakai: python3 -I zfight.py WORKDIR [t1,t2,...]   (scene harus memakai autoNear dari kit/water.js; tanpa daftar = tiap 1 detik)
Tiap 1 detik: render frame normal lalu render ulang dengan kamera digeser 2 mm. Permukaan normal nyaris tidak berubah;
permukaan sebidang (z-fighting) berganti pola. Ubin 12×12 px (di 360×640) yang berubah besar = z-fighting.
Hasil: WORKDIR/qc/zfight_<detik>.png (gambar + kotak merah) dan exit code 1 bila ada temuan.
"""
import asyncio, io, json, os, sys, http.server, threading, functools
import numpy as np
from PIL import Image, ImageDraw
W = os.path.abspath(sys.argv[1]); TOTAL = json.load(open(f"{W}/data.json"))["total"]
ARGS = ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist", "--hide-scrollbars"]
h = functools.partial(http.server.SimpleHTTPRequestHandler, directory=W); h.log_message = lambda *a, **k: None
srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), h); threading.Thread(target=srv.serve_forever, daemon=True).start()
os.makedirs(f"{W}/qc", exist_ok=True); found = []
async def main():
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b = await p.chromium.launch(args=ARGS); pg = await b.new_page(viewport={"width": 1080, "height": 1920})
        await pg.goto(f"http://127.0.0.1:{srv.server_address[1]}/scene.html?capture=1"); await pg.wait_for_function("window.__ready===1", timeout=90000)
        ts = [float(x) for x in sys.argv[2].split(",")] if len(sys.argv) > 2 else [k + .5 for k in range(int(TOTAL))]
        for t in ts:
            shots = []
            for jit in (0, .002):
                await pg.evaluate(f"window.__jit={jit}"); await pg.evaluate("t=>window.__render(t)", t)
                shots.append(Image.open(io.BytesIO(await pg.screenshot())).convert("RGB"))
            await pg.evaluate("window.__jit=0")
            a, c = (np.asarray(s_.convert("L").resize((360, 640)), dtype=np.float32) for s_ in shots)
            d = np.abs(a - c)[:636, :360].reshape(53, 12, 30, 12).mean((1, 3))
            ys, xs = np.where(d > 22)
            if len(ys) >= 2:
                im = shots[0].copy(); dr = ImageDraw.Draw(im)
                for y, x in zip(ys, xs): dr.rectangle([x * 36, y * 36, x * 36 + 36, y * 36 + 36], outline=(255, 0, 0), width=4)
                im.resize((540, 960)).save(f"{W}/qc/zfight_{t:05.1f}.png"); found.append((round(t, 1), int(len(ys))))
        await b.close()
asyncio.run(main())
print("z-fighting:", found if found else "tidak ada")
sys.exit(1 if found else 0)
