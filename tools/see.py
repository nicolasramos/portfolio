#!/usr/bin/env python3
"""Vision QA through Gemini (this agent's own model cannot see images).

Usage:
  python3 tools/see.py "question about the images" img1.png [img2.png ...]
  python3 tools/see.py --frames clip.mp4 "question"        # 6 sampled frames
"""
import base64
import json
import os
import subprocess
import sys
import tempfile
import urllib.error
import urllib.request

ENV_FILE = os.path.expanduser("~/.hermes/.env")
MODEL = os.environ.get("SEE_MODEL", "gemini-3-flash-preview")


def key():
    for line in open(ENV_FILE):
        if line.startswith("GEMINI_API_KEY="):
            return line.strip().split("=", 1)[1]
    raise SystemExit("no GEMINI_API_KEY")


def parts(paths):
    out = []
    for p in paths:
        mime = "image/png" if p.endswith(".png") else "image/jpeg"
        if p.endswith((".mp4", ".mov", ".webm")):
            d = tempfile.mkdtemp()
            subprocess.run(
                ["ffmpeg", "-y", "-loglevel", "error", "-i", p, "-vf", "fps=6/10,scale=640:-2",
                 os.path.join(d, "f%02d.jpg")],
                check=True,
            )
            out += parts(sorted(os.path.join(d, f) for f in os.listdir(d)))
            continue
        out.append({"inline_data": {"mime_type": mime, "data": base64.b64encode(open(p, "rb").read()).decode()}})
    return out


def main():
    args = sys.argv[1:]
    frames = False
    if args and args[0] == "--frames":
        frames = True
        args = args[1:]
    q = args[0]
    paths = args[1:]
    if frames:
        vids = [a for a in args if a.lower().endswith((".mp4", ".mov", ".webm"))]
        paths = vids[:1]
        q = "These are frames sampled in order from one video. " + " ".join(
            a for a in args if a not in paths
        )
    body = {
        "contents": [{"role": "user", "parts": parts(paths) + [{"text": q}]}],
        "generationConfig": {"temperature": 0.1, "maxOutputTokens": 4000,
                             "thinkingConfig": {"thinkingBudget": 0}},
    }
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent"
    def send(payload):
        rq = urllib.request.Request(
            url,
            data=json.dumps(payload).encode(),
            headers={"Content-Type": "application/json", "x-goog-api-key": key()},
        )
        return json.load(urllib.request.urlopen(rq, timeout=240))

    try:
        d = send(body)
    except urllib.error.HTTPError:
        body["generationConfig"].pop("thinkingConfig", None)
        d = send(body)
    for cand in d.get("candidates", []):
        print("".join(p.get("text", "") for p in cand["content"]["parts"]))


if __name__ == "__main__":
    main()
