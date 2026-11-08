"""Buat sampul (tema Midnight) dan tempel sebagai frame pertama video.

Pakai: python3 -I cover.py WORKDIR "Judul," "kok bisa ...?" [VIDEO_IN] [VIDEO_OUT]
- WORKDIR berisi scene.html, data.json, node_modules (sama seperti render.py)
- Objek hero = render 3D adegan terakhir (benda utuh) dengan latar transparan
- Output: WORKDIR/cover.png dan VIDEO_OUT (default WORKDIR/final.mp4) = sampul 0.4 s + video
  (audio digeser 0.4 s). Di Buffer, set video.metadata.thumbnailOffset = 0.
"""
import asyncio, functools, http.server, json, os, shutil, subprocess, sys, threading, urllib.parse
from PIL import Image

W = os.path.abspath(sys.argv[1]); T1, T2 = sys.argv[2], sys.argv[3]
VIN = sys.argv[4] if len(sys.argv) > 4 else f"{W}/out.mp4"
VOUT = sys.argv[5] if len(sys.argv) > 5 else f"{W}/final.mp4"
COVER_SEC = 0.4
here = os.path.dirname(os.path.abspath(__file__))
shutil.copy(f"{here}/cover.html", f"{W}/cover.html")
total = json.load(open(f"{W}/data.json"))["total"]

h = functools.partial(http.server.SimpleHTTPRequestHandler, directory=W); h.log_message = lambda *a, **k: None
srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), h); threading.Thread(target=srv.serve_forever, daemon=True).start()
port = srv.server_address[1]

async def main():
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b = await p.chromium.launch(args=["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist", "--hide-scrollbars"])
        pg = await b.new_page(viewport={"width": 1080, "height": 1920}, device_scale_factor=1)
        await pg.goto(f"http://127.0.0.1:{port}/scene.html?capture=1"); await pg.wait_for_function("window.__ready===1", timeout=90000)
        await pg.add_style_tag(content="html,body,#st{background:transparent!important}#cap,#chip,#hb,#ttl,#vig,#flash{display:none!important}")
        await pg.evaluate("t=>window.__render(t)", total - 0.5)
        await pg.screenshot(path=f"{W}/hero_raw.png", omit_background=True)
        im = Image.open(f"{W}/hero_raw.png").convert("RGBA"); a = im.split()[3].point(lambda v: 0 if v < 235 else v); im.putalpha(a)
        im.crop(a.getbbox()).save(f"{W}/hero.png")
        qs = urllib.parse.urlencode({"theme": "midnight", "t1": T1, "t2": T2, "img": "hero.png", "bot": "300", "mh": "820"})
        await pg.goto(f"http://127.0.0.1:{port}/cover.html?{qs}"); await pg.wait_for_function("window.__ok===1"); await pg.wait_for_timeout(300)
        await pg.screenshot(path=f"{W}/cover.png"); await b.close()

asyncio.run(main())
ms = int(COVER_SEC * 1000)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-loop", "1", "-framerate", "30", "-t", str(COVER_SEC), "-i", f"{W}/cover.png", "-i", VIN,
    "-filter_complex", f"[0:v]scale=1080:1920,setsar=1,fps=30,format=yuv420p[c];[1:v]fps=30,setsar=1,format=yuv420p[v];"
    f"[c][v]concat=n=2:v=1:a=0[vo];[1:a]adelay={ms}|{ms}[ao]",
    "-map", "[vo]", "-map", "[ao]", "-c:v", "libx264", "-preset", "veryfast", "-crf", "19", "-profile:v", "high", "-level", "4.2",
    "-g", "60", "-movflags", "+faststart", "-c:a", "aac", "-b:a", "192k", "-ac", "2", VOUT], check=True)
print(f"{W}/cover.png\n{VOUT}")
