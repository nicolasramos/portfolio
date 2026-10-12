#!/usr/bin/env python3
"""Minimal ComfyUI API client for the audiovisual PC (192.168.1.24:8188).

Usage:
  python3 tools/comfy.py submit workflow.json [--out DIR] [--timeout 1800]
  python3 tools/comfy.py upload FILE
"""
import argparse
import json
import mimetypes
import os
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

SERVER = os.environ.get("COMFY_SERVER", "http://192.168.1.24:8188")


def _req(path, data=None, boundary=None, raw=False):
    url = SERVER + path
    headers = {}
    body = None
    if data is not None:
        body = data if raw else json.dumps(data).encode()
        if not raw:
            headers["Content-Type"] = "application/json"
    req = urllib.request.Request(url, data=body, headers=headers)
    return urllib.request.urlopen(req, timeout=180)


def upload(path):
    fn = os.path.basename(path)
    ctype = mimetypes.guess_type(fn)[0] or "application/octet-stream"
    boundary = "----comfypy"
    with open(path, "rb") as fh:
        content = fh.read()
    payload = (
        f"--{boundary}\r\nContent-Disposition: form-data; name=\"image\"; "
        f"filename=\"{fn}\"\r\nContent-Type: {ctype}\r\n\r\n"
    ).encode() + content + f"\r\n--{boundary}--\r\n".encode()
    req = urllib.request.Request(
        SERVER + "/upload/image",
        data=payload,
        headers={"Content-Type": f"multipart/form-data; boundary={boundary}"},
    )
    out = json.load(urllib.request.urlopen(req, timeout=300))
    return out.get("name", fn)


def wait(prompt_id, timeout, client_id):
    start = time.time()
    while time.time() - start < timeout:
        try:
            hist = json.load(urllib.request.urlopen(f"{SERVER}/history/{prompt_id}", timeout=60))
        except Exception as exc:  # noqa: BLE001
            print(f"poll error: {exc}", file=sys.stderr)
            time.sleep(5)
            continue
        if prompt_id in hist:
            entry = hist[prompt_id]
            status = entry.get("status", {})
            if status.get("status_str") == "error":
                print(json.dumps(entry, indent=2)[:4000], file=sys.stderr)
                raise SystemExit("workflow errored")
            files = []
            for node in entry.get("outputs", {}).values():
                for key in ("images", "videos", "gifs"):
                    for item in node.get(key, []) or []:
                        files.append(item)
            if files:
                return files
        time.sleep(3)
    raise SystemExit(f"timeout after {timeout}s")


def fetch_output(item, outdir):
    qs = urllib.parse.urlencode(
        {"type": item.get("type", "output"), "subfolder": item.get("subfolder", ""), "filename": item["filename"]}
    )
    data = urllib.request.urlopen(f"{SERVER}/view?{qs}", timeout=300).read()
    os.makedirs(outdir, exist_ok=True)
    dest = os.path.join(outdir, item["filename"])
    with open(dest, "wb") as fh:
        fh.write(data)
    return dest, len(data)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("cmd", choices=["submit", "upload"])
    ap.add_argument("arg")
    ap.add_argument("--out", default="media/gen")
    ap.add_argument("--timeout", type=int, default=1800)
    args = ap.parse_args()

    if args.cmd == "upload":
        print(upload(args.arg))
        return

    wf = json.load(open(args.arg))
    out = json.load(
        urllib.request.urlopen(
            urllib.request.Request(
                SERVER + "/prompt",
                data=json.dumps({"prompt": wf, "client_id": "nra4450"}).encode(),
                headers={"Content-Type": "application/json"},
            ),
            timeout=120,
        )
    )
    if "prompt_id" not in out:
        print(json.dumps(out)[:3000], file=sys.stderr)
        raise SystemExit("submit rejected")
    pid = out["prompt_id"]
    print(f"prompt_id={pid}", file=sys.stderr)
    files = wait(pid, args.timeout, "nra4450")
    saved = []
    for item in files:
        dest, size = fetch_output(item, args.out)
        saved.append({"file": dest, "bytes": size})
    print(json.dumps(saved, indent=2))


if __name__ == "__main__":
    main()
