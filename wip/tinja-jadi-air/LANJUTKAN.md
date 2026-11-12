# tinja-jadi-air — tertahan menunggu GEMINI_API_KEY (13 Nov 2026)

Riset (research.md), naskah 19 kalimat + versi `tts` ejaan lisan (data.json, tanpa timing), shot list (shots.md) dan scene 3D (scene.html, sudah lulus QC visual di run draft 12 Nov) siap. Yang belum: SUARA Gemini (ElevenLabs tidak boleh dipakai lagi), lalu render ulang dengan timing baru.

Lanjutkan (setelah GEMINI_API_KEY terisi di environment):
```bash
W=/tmp/zl/tinja-jadi-air; mkdir -p $W/mp3; cp wip/tinja-jadi-air/{scene.html,data.json,shots.md,research.md} $W/
ln -sfn $PWD/pipeline/node_modules $W/node_modules; ln -sfn $PWD/pipeline/kit $W/kit
python3 pipeline/gemini_tts.py $W && python3 pipeline/gemini_cut.py $W && python3 pipeline/gemini_verify.py $W
python3 pipeline/build_audio.py $W 115        # tempo seragam, total ≤115 dtk
# QC 4c: contact sheet tengah tiap shot (timing berubah), lalu render penuh + sampul
python3 -I pipeline/render.py $W full && python3 -I pipeline/cover.py $W "Tinja," "jadi air minum?"
```
Video draft lama (`videos/tinja-jadi-air.mp4`) bersuara ElevenLabs — ganti dengan hasil baru sebelum dijadwalkan.
