# Frågebank — TuneTrivia

Temabaserad frågebank. Varje spelomgång **slumpar** ett urval frågor (per tema
eller blandat) → hög omspelbarhet. Detta ersätter idén om 50 frågor i fast ordning.

## Filer

- `index.json` — register över teman (`id`, `name`, `count`, `file`). Sanning för
  vilka teman som finns; app/backend läser detta först.
- `<tema>.json` — ett tema med sina frågor.

## Temafil-format

```json
{
  "id": "80tal",
  "name": "80-talet",
  "description": "Internationella hits från 1980-talet.",
  "questions": [ /* se nedan */ ]
}
```

## Frågeformat

```json
{
  "id": "80tal-001",
  "type": "year",
  "song": { "title": "Billie Jean", "artist": "Michael Jackson", "year": 1983 },
  "prompt": "Vilket år släpptes Michael Jacksons \"Billie Jean\"?",
  "answer": "1983",
  "options": ["1981", "1983", "1985", "1987"],
  "fact": "Visas efter svar.",
  "difficulty": 2,
  "audio": { "provider": "itunes", "query": "Michael Jackson Billie Jean" }
}
```

| Fält | Regel |
|------|-------|
| `id` | unikt, `<tema>-NNN` |
| `type` | se typer nedan |
| `song` | `{title, artist, year}` — metadata (även för ljuduppslag) |
| `prompt` | frågetexten |
| `answer` | rätt svar — **måste finnas i `options`** |
| `options` | 4 alternativ. **Appen shufflar** vid visning — lagra i valfri ordning |
| `fact` | kort fakta efter svar. **Aldrig sångtext** (copyright) |
| `difficulty` | 1 lätt · 2 medel · 3 svår |
| `audio` | endast `listen_guess`. Appen hämtar 30-sek preview via iTunes, spelar max ~5 sek |

## Frågetyper

| Typ | Fråga |
|-----|-------|
| `year` | Vilket år släpptes låten? |
| `which_artist` | Vem framför låten? |
| `one_hit_wonder` | Vem gjorde one-hit-wondern? |
| `which_film` | Från vilken film/serie kommer låten? |
| `missing_word` | Komplettera **titeln** (aldrig låttext) |
| `listen_guess` | Lyssna och gissa (kräver `audio`) |

## Hårda regler för innehåll

- **Ingen sångtext återges** — copyright. "Saknat ord" görs på **titlar**, inte
  lyrics. Fakta beskriver artist/år/film, citerar aldrig text.
- **Rätt svar måste finnas i `options`** (valideras vid bygge).
- **Fakta måste stämma** — särskilt årtal. Batch 1 är högkonfident men bör
  spot-verifieras innan produktion.
