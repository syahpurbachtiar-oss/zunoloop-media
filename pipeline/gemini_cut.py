import json,sys,subprocess,re,math
W=sys.argv[1]; NOISE=sys.argv[2] if len(sys.argv)>2 else '-38dB'; MIND=sys.argv[3] if len(sys.argv)>3 else '0.12'  # jeda kurang → coba '-32dB' '0.07'
d=json.load(open(f'{W}/data.json')); S=d['tts']; n=len(S)
out=subprocess.run(['ffmpeg','-hide_banner','-i',f'{W}/full.wav','-af',f'silencedetect=noise={NOISE}:d={MIND}','-f','null','-'],capture_output=True,text=True).stderr
st=[float(x) for x in re.findall(r'silence_start: ([\d.]+)',out)]
en=[float(x) for x in re.findall(r'silence_end: ([\d.]+)',out)]
dur=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f'{W}/full.wav']))
gaps=[(a,b) for a,b in zip(st,en) if a>0.5 and b<dur-0.2]
print(len(gaps),'kandidat gap, dur',dur)
w=[len(re.sub(r'[^\w]','',s)) for s in S]; tot=sum(w)
speech_start=0.23; speech_end=dur-0.05
cum=[0]
for x in w: cum.append(cum[-1]+x)
# DP: pick n-1 gaps increasing
G=len(gaps); INF=1e9
def segcost(a,b,k):
    exp=(speech_end-speech_start)*w[k]/tot
    d=max(b-a,0.3)
    return abs(math.log(d/exp))*3
best=[[INF]*G for _ in range(n)]; prev=[[-1]*G for _ in range(n)]
# boundary k (0..n-2) is after sentence k; gap j
for j,(a,b) in enumerate(gaps):
    best[0][j]=segcost(speech_start,(a+b)/2,0)-(b-a)*2
for k in range(1,n-1):
    for j,(a,b) in enumerate(gaps):
        for i in range(j):
            if best[k-1][i]>=INF: continue
            c=best[k-1][i]+segcost((gaps[i][0]+gaps[i][1])/2,(a+b)/2,k)-(b-a)*2
            if c<best[k][j]: best[k][j]=c; prev[k][j]=i
fin=INF;fj=-1
for j,(a,b) in enumerate(gaps):
    if best[n-2][j]>=INF: continue
    c=best[n-2][j]+segcost((a+b)/2,speech_end,n-1)
    if c<fin: fin=c;fj=j
seq=[];j=fj
for k in range(n-2,-1,-1):
    seq.append(j); j=prev[k][j]
seq=seq[::-1]
cuts=[0.0]+[(gaps[j][0]+gaps[j][1])/2 for j in seq]+[dur]
json.dump(cuts,open(f'{W}/cuts.json','w'))
import os; os.makedirs(f'{W}/seg',exist_ok=True)
for i in range(n):
    subprocess.run(['ffmpeg','-v','error','-y','-i',f'{W}/full.wav','-ss',f'{cuts[i]:.3f}','-to',f'{cuts[i+1]:.3f}','-ar','44100','-ac','1','-c:a','libmp3lame','-q:a','2',f'{W}/mp3/{i+1:02d}.mp3'],check=True)
    print(i+1,f'{cuts[i]:.2f}-{cuts[i+1]:.2f}',f'{cuts[i+1]-cuts[i]:.2f}s',S[i][:40])
