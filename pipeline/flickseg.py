"""KISI R30 cek cepat kedap-kedip SEBELUM render penuh: render n frame berurutan dari detik t0 (kamera bergerak) lalu uji persis seperti qc.py [1c].
Pakai: python3 -I pipeline/flickseg.py WORKDIR t0 n   → "kedip lokal: 0" wajib; peta ubin bermasalah disimpan ke WORKDIR/seg.png"""
import asyncio, sys, os, io, http.server, threading, functools, numpy as np
from PIL import Image
W=os.path.abspath(sys.argv[1]); t0=float(sys.argv[2]); n=int(sys.argv[3])
ARGS=["--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist","--hide-scrollbars"]
SEED="(()=>{let a=0x2545F491;Math.random=function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}})()"
h=functools.partial(http.server.SimpleHTTPRequestHandler,directory=W); h.log_message=lambda *a,**k:None
s=http.server.ThreadingHTTPServer(("127.0.0.1",0),h); threading.Thread(target=s.serve_forever,daemon=True).start(); port=s.server_address[1]
async def main():
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b=await p.chromium.launch(args=ARGS); pg=await b.new_page(viewport={"width":1080,"height":1920}); await pg.add_init_script(SEED)
        await pg.goto(f"http://127.0.0.1:{port}/scene.html?capture=1"); await pg.wait_for_function("window.__ready===1",timeout=120000)
        G=[]
        for k in range(n):
            await pg.evaluate("t=>window.__render(t)",t0+k/30)
            G.append(np.asarray(Image.open(io.BytesIO(await pg.screenshot())).convert("L").resize((360,640),Image.BILINEAR),dtype=np.float32))
        global LAST; LAST=Image.open(io.BytesIO(await pg.screenshot())).convert('RGB'); await b.close(); return G
G=asyncio.run(main()); run=np.zeros((39,45),int); kd={}
for i in range(1,len(G)-2):
    d1,d2,d3=G[i]-G[i-1],G[i+1]-G[i],G[i+2]-G[i+1]
    if max(abs(d1).mean(),abs(d2).mean(),abs(d3).mean())>12: run[:]=0; continue
    o=(d1*d2<0)&(d2*d3<0)&(abs(d1)>10)&(abs(d2)>10)&(abs(d3)>10)&(abs(G[i+1]-G[i-1])<5)&(abs(G[i+2]-G[i])<5)
    run=np.where(o[:624].reshape(39,16,45,8).mean(axis=(1,3))>.08,run+1,0)
    if (run>=6).any(): kd[round(t0+i/30,2)]=int((run>=6).sum())
print("kedip lokal:",len(kd),list(kd.items())[:10])
from PIL import ImageDraw
hit=np.zeros((39,45),int);run=np.zeros((39,45),int)
for i in range(1,len(G)-2):
    d1,d2,d3=G[i]-G[i-1],G[i+1]-G[i],G[i+2]-G[i+1]
    o=(d1*d2<0)&(d2*d3<0)&(abs(d1)>10)&(abs(d2)>10)&(abs(d3)>10)&(abs(G[i+1]-G[i-1])<5)&(abs(G[i+2]-G[i])<5)
    run=np.where(o[:624].reshape(39,16,45,8).mean(axis=(1,3))>.08,run+1,0);hit=np.maximum(hit,run)
dr=ImageDraw.Draw(LAST)
for y,x in np.argwhere(hit>=4): dr.rectangle([x*24,y*48,x*24+23,y*48+47],outline=(255,0,0),width=4)
LAST.resize((540,960)).save(W+"/seg.png")
