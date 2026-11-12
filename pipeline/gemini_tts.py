import json,sys,os,base64,urllib.request,wave
W=sys.argv[1]; key=os.environ['GEMINI_API_KEY']
d=json.load(open(f'{W}/data.json'))
text="\n\n".join(d['tts'])
body={"contents":[{"parts":[{"text":text}]}],
 "generationConfig":{"responseModalities":["AUDIO"],"speechConfig":{"voiceConfig":{"prebuiltVoiceConfig":{"voiceName":"Puck"}}}}}
req=urllib.request.Request("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent",
 data=json.dumps(body).encode(),headers={"Content-Type":"application/json","x-goog-api-key":key})
try:
    r=json.load(urllib.request.urlopen(req,timeout=300))
except urllib.error.HTTPError as e:
    print("HTTP",e.code,e.read()[:600].decode()); sys.exit(1)
part=r['candidates'][0]['content']['parts'][0]['inlineData']
pcm=base64.b64decode(part['data']); print(part['mimeType'],len(pcm))
with wave.open(f'{W}/full.wav','wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(24000); w.writeframes(pcm)
print('dur',len(pcm)/2/24000)
