"""Render scene.html (Three.js) jadi frame PNG, lalu encode MP4 dengan mix.wav.

Pakai:
  python3 render.py WORKDIR shot 1.5,9,21,44,59.5   -> WORKDIR/preview/sN.png + contact.png (cek visual)
  python3 render.py WORKDIR full                     -> WORKDIR/out.mp4 (2 worker paralel, ~35-45 menit)
  python3 render.py WORKDIR viol                     -> cek overlay semua frame tanpa render ulang (bila render full terputus)
WORKDIR harus berisi scene.html, data.json, mix.wav, dan symlink node_modules (three@0.170.0).
"""
import asyncio, json, os, subprocess, sys, http.server, threading, functools, glob

W = os.path.abspath(sys.argv[1]); MODE = sys.argv[2]
FPS = 30; TOTAL = json.load(open(f"{W}/data.json"))["total"]; NF = int(TOTAL * FPS)
# R30 (17 Nov 2026, lantai kedap-kedip): 2 worker merender frame selang-seling; bila scene memakai acak/waktu, tiap worker
# punya tekstur berbeda → frame genap ≠ ganjil → kedap-kedip. Math.random dikunci (seed tetap) di SEMUA halaman + gerbang determinisme.
SEED_JS = "(()=>{let a=0x2545F491;Math.random=function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}})()"
ARGS = ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist", "--hide-scrollbars"]

def serve():
    h = functools.partial(http.server.SimpleHTTPRequestHandler, directory=W)
    h.log_message = lambda *a, **k: None
    s = http.server.ThreadingHTTPServer(("127.0.0.1", 0), h)
    threading.Thread(target=s.serve_forever, daemon=True).start(); return s.server_address[1]

async def vworker(port, frames):  # cek overlay saja (tanpa screenshot) — dipakai bila render terputus
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b = await p.chromium.launch(args=ARGS); pg = await b.new_page(viewport={"width": 1080, "height": 1920}, device_scale_factor=1); await pg.add_init_script(SEED_JS)
        await pg.goto(f"http://127.0.0.1:{port}/scene.html?capture=1"); await pg.wait_for_function("window.__ready===1", timeout=90000)
        for name, t in frames:
            v = await pg.evaluate("t=>{window.__render(t);return window.__fxViol||[]}", t)
            if v: VIOL[name] = v
        await b.close()

async def worker(port, frames, outdir):
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b = await p.chromium.launch(args=ARGS)
        pg = await b.new_page(viewport={"width": 1080, "height": 1920}, device_scale_factor=1); await pg.add_init_script(SEED_JS)
        pg.on("pageerror", lambda e: print("PAGEERROR", e, flush=True))
        await pg.goto(f"http://127.0.0.1:{port}/scene.html?capture=1")
        await pg.wait_for_function("window.__ready===1", timeout=90000)
        for name, t in frames:
            f = f"{outdir}/{name}.png"
            if os.path.exists(f): continue
            await pg.evaluate("t=>window.__render(t)", t)
            v = await pg.evaluate("window.__fxViol||[]")
            if v: VIOL[name] = v
            await pg.screenshot(path=f + ".tmp.png"); os.replace(f + ".tmp.png", f)
        await b.close()


async def detshots(port, ts):  # satu browser baru, render daftar waktu (urutan sesuai daftar), kembalikan gambar
    import io
    from playwright.async_api import async_playwright
    from PIL import Image
    async with async_playwright() as p:
        b = await p.chromium.launch(args=ARGS); pg = await b.new_page(viewport={"width": 1080, "height": 1920}, device_scale_factor=1); await pg.add_init_script(SEED_JS)
        await pg.goto(f"http://127.0.0.1:{port}/scene.html?capture=1"); await pg.wait_for_function("window.__ready===1", timeout=120000)
        out = {}
        for t in ts:
            await pg.evaluate("t=>window.__render(t)", t); out[t] = Image.open(io.BytesIO(await pg.screenshot())).convert("RGB")
        await b.close(); return out
def determinism(port):
    """GERBANG R30: dua browser terpisah (urutan render berbeda) harus menghasilkan gambar identik di waktu yang sama."""
    import numpy as np
    ts = [round(TOTAL * k / 9, 3) for k in range(1, 9)]
    async def go(): return await asyncio.gather(detshots(port, ts), detshots(port, ts[::-1]))
    A, B = asyncio.run(go()); bad = []
    for t in ts:
        d = np.abs(np.asarray(A[t], dtype=np.int16) - np.asarray(B[t], dtype=np.int16)).max(axis=2)
        frac = float((d > 8).mean())
        if frac > .001: bad.append((t, round(frac * 100, 2)))
    json.dump({"ok": not bad, "beda": bad, "t": ts}, open(f"{W}/qc_det.json", "w"))
    return bad

port = serve(); VIOL = {}
if MODE == "viol":
    allf = [(f"{i:05d}", i / FPS) for i in range(NF)]
    async def both(): await asyncio.gather(vworker(port, allf[0::2]), vworker(port, allf[1::2]))
    asyncio.run(both()); json.dump(VIOL, open(f"{W}/qc_fx.json", "w")); print("pelanggaran overlay:", len(VIOL), "frame"); sys.exit(0)
if MODE == "shot":
    ts = [float(x) for x in sys.argv[3].split(",")]
    od = f"{W}/preview"; os.makedirs(od, exist_ok=True)
    for f in glob.glob(f"{od}/*.png"): os.remove(f)
    asyncio.run(worker(port, [(f"s{i}", t) for i, t in enumerate(ts)], od))
    ins = sum([["-i", f"{od}/s{i}.png"] for i in range(len(ts))], [])
    fl = "".join(f"[{i}]scale=240:-1[v{i}];" for i in range(len(ts))) + "".join(f"[v{i}]" for i in range(len(ts))) + f"hstack={len(ts)}" if len(ts) > 1 else "scale=240:-1"
    subprocess.run(["ffmpeg", "-v", "error", "-y", *ins, "-filter_complex", fl, f"{W}/contact.png"], check=True)
    if VIOL: print("PELANGGARAN OVERLAY:", VIOL)
    print(f"{W}/contact.png")
else:
    bad = determinism(port)
    if bad: print("GAGAL R30: render tidak deterministik (frame genap/ganjil akan kedap-kedip). Detik & % piksel beda:", bad,
                  "— hapus Math.random/Date.now/state antar-frame dari scene"); sys.exit(1)
    print("determinisme: OK (2 browser identik)")
    od = f"{W}/frames"; os.makedirs(od, exist_ok=True)
    allf = [(f"{i:05d}", i / FPS) for i in range(NF)]
    async def both(): await asyncio.gather(worker(port, allf[0::2], od), worker(port, allf[1::2], od))
    asyncio.run(both())
    json.dump(VIOL, open(f"{W}/qc_fx.json", "w"))  # dibaca qc.py
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-framerate", str(FPS), "-pattern_type", "glob", "-i", f"{od}/[0-9]*.png",
                    "-i", f"{W}/mix.wav", "-c:v", "libx264", "-preset", "veryfast", "-crf", "19", "-pix_fmt", "yuv420p",
                    "-profile:v", "high", "-level", "4.2", "-g", "60", "-movflags", "+faststart", "-c:a", "aac", "-b:a", "192k", "-ar", "48000",
                    "-ac", "2", "-shortest", f"{W}/out.mp4"], check=True)
    print(f"{W}/out.mp4")
