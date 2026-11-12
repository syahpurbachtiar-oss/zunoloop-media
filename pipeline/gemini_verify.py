import json,sys,os,base64,urllib.request,difflib,re,time
W=sys.argv[1]; key=os.environ['GEMINI_API_KEY']
S=json.load(open(f'{W}/data.json'))['tts']
norm=lambda s:re.sub(r'[^a-z0-9 ]','',s.lower())
bad=0
for i,s in enumerate(S,1):
    aud=base64.b64encode(open(f'{W}/mp3/{i:02d}.mp3','rb').read()).decode()
    body={"contents":[{"parts":[{"inline_data":{"mime_type":"audio/mp3","data":aud}},{"text":"Transkripsikan persis apa yang diucapkan (bahasa Indonesia). Balas hanya teksnya."}]}],"generationConfig":{"temperature":0}}
    req=urllib.request.Request("https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent",data=json.dumps(body).encode(),headers={"Content-Type":"application/json","x-goog-api-key":key})
    r=None
    for tr in range(8):
        try: r=json.load(urllib.request.urlopen(req,timeout=120)); break
        except Exception as e: print('retry',i,e); time.sleep(10*(tr+1))
    if r is None: print(f'{i:02d} GAGAL API  <<< CEK'); bad+=1; continue
    t=r['candidates'][0]['content']['parts'][-1]['text'].strip()
    ratio=difflib.SequenceMatcher(None,norm(t),norm(s)).ratio()
    flag='' if ratio>0.85 else '  <<< CEK'
    if flag: bad+=1
    print(f'{i:02d} {ratio:.2f}{flag}\n   got: {t[:90]}\n   exp: {s[:90]}')
print('bermasalah:',bad)
