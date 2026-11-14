# biogas-sapi — tertahan menunggu GEMINI_API_KEY (15 Nov 2026, run otomatis)

Siap: `research.md` (tabel fakta + kolom lokasi + fakta visual), `data.json` (20 kalimat/274 kata, `tts` ejaan lisan, chips/problems/stageKeys/keys; tanpa timing), `shots.md`.
BELUM: `scene.html` (dibangun setelah timing suara ada; rangkai dari `pipeline/kit/assets.js`, contoh `pipeline/examples/copenhill/`, wajib autoNear + checkCast R24), suara Gemini, render, KISI.
Belum yakin: fakta lokasi baru dari 1 media (Mongabay 2021); halaman ITERA soal Desa Wawasan gagal dibaca → cek ulang bila memungkinkan.

Lanjutkan (setelah GEMINI_API_KEY terisi di environment):
```bash
W=/tmp/zl/biogas-sapi; mkdir -p $W/mp3; cp wip/biogas-sapi/{data.json,shots.md,research.md} $W/
ln -sfn $PWD/pipeline/node_modules $W/node_modules; ln -sfn $PWD/pipeline/kit $W/kit
python3 pipeline/gemini_tts.py $W && python3 pipeline/gemini_cut.py $W && python3 pipeline/gemini_verify.py $W
python3 pipeline/build_audio.py $W 115
# bangun scene.html → lint_scene.py → pratinjau 4c → render full → cover.py "Kotoran Sapi," "kok jadi api?" → qc.py → zfight.py → cek mata
```
