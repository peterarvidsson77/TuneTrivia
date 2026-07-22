#!/usr/bin/env python3
"""Genererar prototyperna från data/questions/. Kör: python prototypes/build.py (från repo-roten).
Data bäddas in i HTML:en så filerna kan öppnas direkt."""
import json, os, glob

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
QDIR = os.path.join(ROOT, "data", "questions")
PDIR = os.path.join(ROOT, "prototypes")

LABELS = {
    "year": "Gissa årtal", "which_artist": "Vem gjorde låten", "one_hit_wonder": "One-hit wonder",
    "which_film": "Film & TV", "missing_word": "Saknat ord", "listen_guess": "Lyssna & gissa",
    "cover_original": "Cover → original",
}
AUDIO_TYPES = {"listen_guess", "cover_original"}


def render(tpl_name, out_name, data):
    tpl = open(os.path.join(PDIR, tpl_name), encoding="utf-8").read()
    html = tpl.replace("__DATA__", json.dumps(data, ensure_ascii=False))
    open(os.path.join(PDIR, out_name), "w", encoding="utf-8").write(html)
    print(f"Wrote {out_name}")


# ---- finskcover-player.html (bara cover-temat) ----
fc = json.load(open(os.path.join(QDIR, "finskcover.json"), encoding="utf-8"))
fc_data = [{
    "query": q["audio"]["query"], "cover": q["cover"]["title"], "coverArtist": q["cover"]["artist"],
    "answer": q["answer"], "options": q["options"],
    "orig": f'{q["song"]["artist"]} – {q["song"]["title"]} ({q["song"]["year"]})', "fact": q["fact"],
} for q in fc["questions"]]
render("template.html", "finskcover-player.html", fc_data)

# ---- quiz-player.html (hela banken, alla teman) ----
themes, questions = [], []
for p in sorted(glob.glob(os.path.join(QDIR, "*.json"))):
    if os.path.basename(p) == "index.json":
        continue
    d = json.load(open(p, encoding="utf-8"))
    themes.append({"id": d["id"], "name": d["name"], "count": len(d["questions"])})
    for q in d["questions"]:
        s = q["song"]
        norm = {
            "themeId": d["id"], "theme": d["name"], "type": q["type"],
            "typeLabel": LABELS.get(q["type"], q["type"]),
            "prompt": q["prompt"], "options": q["options"], "answer": q["answer"],
            "fact": q["fact"],
            "reveal": f'{s["artist"]} – {s["title"]} ({s["year"]})',
            "audio": q["audio"]["query"] if q["type"] in AUDIO_TYPES and "audio" in q else None,
            "cover": (f'{q["cover"]["artist"]} – {q["cover"]["title"]}' if q["type"] == "cover_original" and "cover" in q else None),
        }
        questions.append(norm)
render("quiz-template.html", "quiz-player.html", {"themes": themes, "questions": questions})
print(f"Totalt {len(questions)} frågor i {len(themes)} teman inbäddade i quiz-player.html.")
