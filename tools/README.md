# Generation pipeline (audiovisual PC)

Everything under `public/world/` is generated, not bought. The render box is the
audiovisual PC — ComfyUI on `192.168.1.24:8188` (RTX 5070 Ti) — and the chain is:

| Step | Script | Model | Measured |
|---|---|---|---|
| Still per stop | `gen_stills.py <id>` | JuggernautXL v10, 1344x768, 28 steps | ~13 s |
| Clip per stop | `gen_clips.py <id...>` | Wan 2.2 TI2V 5B, 1280x704, 73 f @ 24 fps, 20 steps | ~145 s |
| Scrub encode | inside `gen_clips.py` | ffmpeg, crf 22, GOP 6, BT.709, faststart + poster webp | ~4 s |

`shotlist.json` holds the image prompt, the motion prompt and the ES/EN copy for
every stop — it is the single source for the film. `comfy.py` is a 100-line API
client (`submit`/`upload`), and `see.py` answers image questions through Gemini
vision because the agent model driving this has no sight: `python3 tools/see.py
"<question>" shot.png`, or `--frames clip.mp4` to audit motion.

Reproduce from scratch: `python3 tools/gen_stills.py brief && python3
tools/gen_clips.py brief` (set `COMFY_SERVER` if the box moved).
