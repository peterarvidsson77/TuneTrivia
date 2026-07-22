#!/usr/bin/env python3
"""Genererar finskcover-player.html från data/questions/finskcover.json.
Kör: python prototypes/build.py  (från repo-roten). Data bäddas in i HTML:en."""
import json, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "data", "questions", "finskcover.json")
OUT = os.path.join(ROOT, "prototypes", "finskcover-player.html")
TPL = os.path.join(ROOT, "prototypes", "template.html")

d = json.load(open(SRC, encoding="utf-8"))
qs = [{
    "query": q["audio"]["query"],
    "cover": q["cover"]["title"],
    "coverArtist": q["cover"]["artist"],
    "answer": q["answer"],
    "options": q["options"],
    "orig": f'{q["song"]["artist"]} – {q["song"]["title"]} ({q["song"]["year"]})',
    "fact": q["fact"],
} for q in d["questions"]]

html = open(TPL, encoding="utf-8").read().replace("__DATA__", json.dumps(qs, ensure_ascii=False))
open(OUT, "w", encoding="utf-8").write(html)
print(f"Wrote {OUT} — {len(qs)} frågor inbäddade.")
