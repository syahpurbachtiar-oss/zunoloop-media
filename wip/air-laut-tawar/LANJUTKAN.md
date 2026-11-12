# air-laut-tawar — tertahan menunggu GEMINI_API_KEY (13 Nov 2026)

Topik [P1] berikutnya (tinja-jadi-air `[-]` ditahan Ari). Riset (research.md, 13 sumber), naskah 19 kalimat + versi `tts` ejaan lisan (data.json, timing dihapus), shot list (shots.md, 39 shot) dan scene 3D (scene.html, lulus QC di draft 12–13 Nov, loop K19→K1 identik) siap. Yang belum: SUARA Gemini (draft lama `videos/air-laut-tawar.mp4` bersuara ElevenLabs — jangan dijadwalkan), lalu render ulang dengan timing baru.

Lanjutkan (setelah GEMINI_API_KEY terisi di environment):
```bash
W=/tmp/zl/air-laut-tawar; mkdir -p $W/mp3; cp wip/air-laut-tawar/{scene.html,data.json,shots.md,research.md} $W/
ln -sfn $PWD/pipeline/node_modules $W/node_modules; ln -sfn $PWD/pipeline/kit $W/kit
python3 pipeline/gemini_tts.py $W && python3 pipeline/gemini_cut.py $W && python3 pipeline/gemini_verify.py $W
python3 pipeline/build_audio.py $W 115        # tempo seragam, total ≤115 dtk
# QC 4c: contact sheet tengah tiap shot (timing berubah), lalu render penuh + sampul
python3 -I pipeline/render.py $W full && python3 -I pipeline/cover.py $W "Air laut" "jadi air minum?"
```
Judul/hook: "Warga Dubai Minum Air Laut Tiap Hari?! 🌊".
