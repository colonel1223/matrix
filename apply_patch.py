from pathlib import Path
import shutil

html_file = Path("index.html")
patch_file = Path("/mnt/d_

cd ~/Desktop/matrix

cat << 'PY' > apply_patch.py
from pathlib import Path
import shutil

html_file = Path("index.html")
patch_file = Path("/mnt/data/patches.txt")

if not html_file.exists():
    print("index.html not found")
    exit()

if not patch_file.exists():
    print("patches.txt not found")
    exit()

backup = Path("index_backup.html")
shutil.copy(html_file, backup)
print("Backup created")

html = html_file.read_text()
patch = patch_file.read_text()

# ---- insert researcher credit after <body>
if "researcher-credit" not in html:
    if "<body>" in html:
        start = patch.find("<!-- ═══════ RESEARCHER CREDIT")
        end = patch.find("/* ─────────────────────────────────", start)
        html = html.replace("<body>", "<body>\n" + patch[start:end])
        print("Inserted researcher credit")

# ---- insert countdown after hero section
if "cd-section" not in html:
    start = patch.find("<!-- ═══════ LIVE AGI COUNTDOWN")
    end = patch.find("/* ─────────────────────────────────", start)
    if "</section>" in html:
        html = html.replace("</section>", "</section>\n" + patch[start:end], 1)
        print("Inserted AGI countdown")

# ---- insert fermi model near end of fermi section
if "MODIFIED DRAKE EQUATION FOR AGI FILTER" not in html:
    start = patch.find("<!-- ═══════ FERMI PREDICTIVE MODELS")
    if "<div class=\"divider\"" in html:
        html = html.replace("<div class=\"divider\"", patch[start:] + "\n<div class=\"divider\"", 1)
        print("Inserted enhanced Fermi")

# ---- append JS at end of body
if "SURVIVAL CURVE CANVAS" not in html:
    start = patch.rfind("// ═══════ SURVIVAL CURVE CANVAS")
    js = "<script>\n" + patch[start:] + "\n</script>\n</body>"
    html = html.replace("</body>", js)
    print("Inserted JS")

html_file.write_text(html)
print("Patch applied")
