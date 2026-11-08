"""Render scene.html (Three.js) jadi frame PNG, lalu encode MP4 dengan mix.wav.

Pakai:
  python3 render.py WORKDIR shot 1.5,9,21,44,59.5   -> WORKDIR/preview/sN.png + contact.png (cek visual)
  python3 render.py WORKDIR full                     -> WORKDIR/out.mp4 (2 worker paralel, ~35-45 menit)
WORKDIR harus berisi scene.html, data.json, mix.wav, dan symlink node_modules (three@0.170.0).
"""
import asyncio, json, os, subprocess, sys, http.server, threading, functools, glob

W = os.path.abspath(sys.argv[1]); MODE = sys.argv[2]
FPS = 30; TOTAL = json.load(open(f"{W}/data.json"))["total"]; NF = int(TOTAL * FPS)
ARGS = ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist", "--hide-scrollbars"]

def serve():
    h = functools.partial(http.server.SimpleHTTPRequestHandler, directory=W)
    h.log_message = lambda *a, **k: None
    s = http.server.ThreadingHTTPServer(("127.0.0.1", 0), h)
    threading.Thread(target=s.serve_forever, daemon=True).start(); return s.server_address[1]

async def worker(port, frames, outdir):
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b = await p.chromium.launch(args=ARGS)
        pg = await b.new_page(viewport={"width": 1080, "height": 1920}, device_scale_factor=1)
        pg.on("pageerror", lambda e: print("PAGEERROR", e, flush=True))
        await pg.goto(f"http://127.0.0.1:{port}/scene.html?capture=1")
        await pg.wait_for_function("window.__ready===1", timeout=90000)
        for name, t in frames:
            f = f"{outdir}/{name}.png"
            if os.path.exists(f): continue
            await pg.evaluate("t=>window.__render(t)", t)
            await pg.screenshot(path=f + ".tmp.png"); os.replace(f + ".tmp.png", f)
        await b.close()

port = serve()
if MODE == "shot":
    ts = [float(x) for x in sys.argv[3].split(",")]
    od = f"{W}/preview"; os.makedirs(od, exist_ok=True)
    for f in glob.glob(f"{od}/*.png"): os.remove(f)
    asyncio.run(worker(port, [(f"s{i}", t) for i, t in enumerate(ts)], od))
    ins = sum([["-i", f"{od}/s{i}.png"] for i in range(len(ts))], [])
    fl = "".join(f"[{i}]scale=240:-1[v{i}];" for i in range(len(ts))) + "".join(f"[v{i}]" for i in range(len(ts))) + f"hstack={len(ts)}" if len(ts) > 1 else "scale=240:-1"
    subprocess.run(["ffmpeg", "-v", "error", "-y", *ins, "-filter_complex", fl, f"{W}/contact.png"], check=True)
    print(f"{W}/contact.png")
else:
    od = f"{W}/frames"; os.makedirs(od, exist_ok=True)
    allf = [(f"{i:05d}", i / FPS) for i in range(NF)]
    async def both(): await asyncio.gather(worker(port, allf[0::2], od), worker(port, allf[1::2], od))
    asyncio.run(both())
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-framerate", str(FPS), "-pattern_type", "glob", "-i", f"{od}/[0-9]*.png",
                    "-i", f"{W}/mix.wav", "-c:v", "libx264", "-preset", "veryfast", "-crf", "19", "-pix_fmt", "yuv420p",
                    "-profile:v", "high", "-level", "4.2", "-g", "60", "-movflags", "+faststart", "-c:a", "aac", "-b:a", "192k",
                    "-ac", "2", "-shortest", f"{W}/out.mp4"], check=True)
    print(f"{W}/out.mp4")
