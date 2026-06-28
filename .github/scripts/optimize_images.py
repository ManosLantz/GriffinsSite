"""Downscale + recompress JPEGs that changed in a push.

Called by .github/workflows/optimize-images.yml as:
    python optimize_images.py <before_sha> <after_sha>

Only processes added/modified .jpg/.jpeg under images/. Caps the longest side at
1280px and saves progressive JPEG at quality 82 (matches the site's manual
convention). If the git diff can't be resolved (first push, force-push), it
falls back to scanning every JPEG under images/.
"""
import os
import subprocess
import sys

from PIL import Image, ImageOps

MAX_SIDE = 1280
QUALITY = 82
EXTS = (".jpg", ".jpeg")


def changed_jpegs(before, after):
    try:
        out = subprocess.check_output(
            ["git", "diff", "--name-only", "--diff-filter=AM", before, after],
            text=True,
        )
        files = [
            line.strip()
            for line in out.splitlines()
            if line.strip().lower().startswith("images/")
            and line.strip().lower().endswith(EXTS)
        ]
        if files:
            return files
    except subprocess.CalledProcessError as err:
        print("git diff failed, scanning all images/:", err)

    found = []
    for root, _dirs, names in os.walk("images"):
        for name in names:
            if name.lower().endswith(EXTS):
                found.append(os.path.join(root, name).replace("\\", "/"))
    return found


def optimize(path):
    if not os.path.exists(path):
        return  # deleted/renamed away
    try:
        im = Image.open(path)
    except Exception as err:  # noqa: BLE001 - skip anything unreadable
        print("skip (cannot open):", path, err)
        return

    before = os.path.getsize(path)
    im = ImageOps.exif_transpose(im)
    if im.mode != "RGB":
        im = im.convert("RGB")

    w, h = im.size
    if max(w, h) > MAX_SIDE:
        if w >= h:
            im = im.resize((MAX_SIDE, round(h * MAX_SIDE / w)), Image.LANCZOS)
        else:
            im = im.resize((round(w * MAX_SIDE / h), MAX_SIDE), Image.LANCZOS)

    im.save(path, "JPEG", quality=QUALITY, optimize=True, progressive=True)
    after = os.path.getsize(path)
    print(f"{path}: {before // 1024}KB -> {after // 1024}KB ({im.size[0]}x{im.size[1]})")


def main():
    before = sys.argv[1] if len(sys.argv) > 1 else ""
    after = sys.argv[2] if len(sys.argv) > 2 else "HEAD"
    # A brand-new branch reports an all-zero "before" SHA; treat as full scan.
    if set(before) == {"0"}:
        before = ""
    targets = changed_jpegs(before, after)
    if not targets:
        print("No JPEGs to process.")
        return
    for path in targets:
        optimize(path)


if __name__ == "__main__":
    main()
