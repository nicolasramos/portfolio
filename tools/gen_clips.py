#!/usr/bin/env python3
"""Turn each monochrome still into a scrub-ready clip on the audiovisual PC.

For every shot id given on the command line:
  1. crop/resize media/gen/<id>.png to 1280x704 -> media/gen/<id>_start.png
  2. upload it to ComfyUI and run Wan 2.2 TI2V 5B with the shot's motion prompt
  3. download the raw clip to media/gen/<id>_raw.mp4
  4. encode it for scroll scrubbing (dense keyframes, BT.709, faststart)
     -> web/public/world/<id>.mp4  and its first frame -> web/public/world/<id>.webp

Usage: python3 tools/gen_clips.py <shot_id> [...]
"""
import json
import os
import subprocess
import sys
import time
import urllib.request

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import comfy  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GEN = os.path.join(ROOT, "media/gen")
WEB = os.path.join(ROOT, "web/public/world")
W, H, FRAMES, FPS = 1280, 704, 73, 24

NEG = ("colour, color, orange, warm tint, text, letters, watermark, logo, cuts, "
       "morphing faces, extra people, fast motion, jitter")


def start_frame(key, src=None):
    dst = os.path.join(GEN, f"{key}_start.png")
    subprocess.run(
        ["ffmpeg", "-y", "-loglevel", "error", "-i", src or os.path.join(GEN, f"{key}.png"),
         "-vf", f"scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H}",
         "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", dst],
        check=True,
    )
    return dst


def workflow(image, motion, prefix, seed):
    return {
        "1": {"class_type": "UNETLoader",
              "inputs": {"unet_name": "fastwan_ti2v_5B_bf16.safetensors", "weight_dtype": "default"}},
        "2": {"class_type": "CLIPLoader",
              "inputs": {"clip_name": "umt5_xxl_fp8_e4m3fn_scaled.safetensors", "type": "wan"}},
        "3": {"class_type": "VAELoader", "inputs": {"vae_name": "wan2.2_vae.safetensors"}},
        "4": {"class_type": "LoadImage", "inputs": {"image": image}},
        "5": {"class_type": "CLIPTextEncode", "inputs": {"text": motion, "clip": ["2", 0]}},
        "6": {"class_type": "CLIPTextEncode", "inputs": {"text": NEG, "clip": ["2", 0]}},
        "7": {"class_type": "Wan22ImageToVideoLatent",
              "inputs": {"vae": ["3", 0], "width": W, "height": H, "length": FRAMES,
                         "batch_size": 1, "start_image": ["4", 0]}},
        "8": {"class_type": "KSampler",
              "inputs": {"seed": seed, "steps": 20, "cfg": 5.0, "sampler_name": "euler",
                         "scheduler": "simple", "denoise": 1.0, "model": ["1", 0],
                         "positive": ["5", 0], "negative": ["6", 0], "latent_image": ["7", 0]}},
        "9": {"class_type": "VAEDecode", "inputs": {"samples": ["8", 0], "vae": ["3", 0]}},
        "10": {"class_type": "CreateVideo", "inputs": {"images": ["9", 0], "fps": float(FPS)}},
        "11": {"class_type": "SaveVideo",
               "inputs": {"video": ["10", 0], "filename_prefix": f"nra4450/{prefix}",
                          "format": "mp4", "codec": "h264"}},
    }


def generate(key, motion, seed):
    raw = os.path.join(GEN, f"{key}_raw.mp4")
    if os.path.exists(raw):
        print(f"{key}: raw exists, skipping generation")
        return raw
    src = start_frame(key)
    name = comfy.upload(src)
    body = json.dumps({"prompt": workflow(name, motion, f"clip_{key}", seed),
                       "client_id": "nra4450"}).encode()
    req = urllib.request.Request(comfy.SERVER + "/prompt", data=body,
                                 headers={"Content-Type": "application/json"})
    t0 = time.time()
    pid = json.load(urllib.request.urlopen(req, timeout=120))["prompt_id"]
    produced = comfy.wait(pid, 2400, "nra4450")
    for item in produced:
        comfy.fetch_output(item, GEN)
        for cand in os.listdir(GEN):
            if cand.startswith(f"clip_{key}") and cand not in (os.path.basename(src),):
                p = os.path.join(GEN, cand)
                if os.path.getsize(p) > 1000 and not cand.endswith(".png"):
                    os.replace(p, raw)
    print(f"{key}: generated in {time.time() - t0:.0f}s")
    return raw


def encode(key, raw):
    os.makedirs(WEB, exist_ok=True)
    out = os.path.join(WEB, f"{key}.mp4")
    subprocess.run(
        ["ffmpeg", "-y", "-loglevel", "error", "-i", raw, "-an",
         "-vf", "unsharp=5:5:0.6:5:5:0.0",
         "-c:v", "libx264", "-preset", "slow", "-crf", "22", "-pix_fmt", "yuv420p",
         "-g", "6", "-keyint_min", "6", "-sc_threshold", "0",
         "-color_primaries", "bt709", "-color_trc", "iec61966-2-1", "-colorspace", "bt709",
         "-color_range", "tv", "-movflags", "+faststart+write_colr", out],
        check=True,
    )
    poster = os.path.join(WEB, f"{key}.webp")
    tmp_png = os.path.join(GEN, f"{key}_poster.png")
    subprocess.run(
        ["ffmpeg", "-y", "-loglevel", "error", "-i", out, "-frames:v", "1", tmp_png],
        check=True,
    )
    # This ffmpeg build has no libwebp; ImageMagick does.
    subprocess.run(["magick", tmp_png, "-resize", "1280x", "-quality", "80", poster], check=True)
    print(f"{key}: encoded {os.path.getsize(out)/1e6:.2f} MB, poster {os.path.getsize(poster)/1e3:.0f} kB")


if __name__ == "__main__":
    shots = json.load(open(os.path.join(ROOT, "media/shotlist.json")))
    for i, key in enumerate(sys.argv[1:]):
        shot = shots[key]
        raw = generate(key, shot["motion"], 4450 + i * 7)
        encode(key, raw)
