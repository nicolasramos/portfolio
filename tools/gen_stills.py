#!/usr/bin/env python3
"""Generate one monochrome still for a shot id on the audiovisual PC (ComfyUI).

Usage: python3 tools/gen_stills.py <shot_id> [seed]
Writes media/gen/<shot_id>.png
"""
import json
import os
import sys
import urllib.request

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import comfy  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "media/gen")
NEG = ("colour, color, orange, warm tint, sepia, text, letters, watermark, logo, "
       "blurry, low quality, extra limbs, cartoon, anime")


def wf(prompt, prefix, seed):
    return {
        "1": {"class_type": "CheckpointLoaderSimple",
              "inputs": {"ckpt_name": "juggernautXL_v10.safetensors"}},
        "2": {"class_type": "CLIPTextEncode", "inputs": {"text": prompt, "clip": ["1", 1]}},
        "3": {"class_type": "CLIPTextEncode", "inputs": {"text": NEG, "clip": ["1", 1]}},
        "4": {"class_type": "EmptyLatentImage",
              "inputs": {"width": 1344, "height": 768, "batch_size": 1}},
        "5": {"class_type": "KSampler",
              "inputs": {"seed": seed, "steps": 28, "cfg": 7.0,
                         "sampler_name": "dpmpp_2m_sde", "scheduler": "karras",
                         "denoise": 1.0, "model": ["1", 0], "positive": ["2", 0],
                         "negative": ["3", 0], "latent_image": ["4", 0]}},
        "6": {"class_type": "VAEDecode", "inputs": {"samples": ["5", 0], "vae": ["1", 2]}},
        "7": {"class_type": "SaveImage",
              "inputs": {"images": ["6", 0], "filename_prefix": f"nra4450/{prefix}"}},
    }


def main():
    key = sys.argv[1]
    seed = int(sys.argv[2]) if len(sys.argv) > 2 else 4450
    shots = json.load(open(os.path.join(ROOT, "media/shotlist.json")))
    os.makedirs(OUT, exist_ok=True)
    body = json.dumps({"prompt": wf(shots[key]["img"], f"still_{key}", seed),
                       "client_id": "nra4450"}).encode()
    req = urllib.request.Request(comfy.SERVER + "/prompt", data=body,
                                 headers={"Content-Type": "application/json"})
    pid = json.load(urllib.request.urlopen(req, timeout=120))["prompt_id"]
    print(f"prompt_id={pid}", file=sys.stderr)
    produced = comfy.wait(pid, 900, "nra4450")
    for item in produced:
        dest, size = comfy.fetch_output(item, OUT)
        named = os.path.join(OUT, f"{key}.png")
        os.replace(dest, named)
        print(json.dumps({"file": named, "bytes": size}))


if __name__ == "__main__":
    main()
