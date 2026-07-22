# API-kontrakt — TuneTrivia

Det gränssnitt frontend behöver när Base44:s SDK-anrop ersätts av vår egen
backend. Alla endpoints är REST under `/api`.

## Svarskuvert (alltid)

Varje svar har samma form (hård regel):

```json
{ "success": true,  "data": { ... } }
{ "success": false, "error": "läsbar felbeskrivning" }
```

HTTP-status speglar utfallet: `200` OK, `201` skapad, `400` valideringsfel,
`404` saknas, `500` serverfel.

---

## `POST /api/highscores`

Sparar ett lags resultat efter avslutat quiz.

**Request body**
```json
{
  "team_name": "De Flygande Bäckasinerna",
  "players": ["Anna", "Björn", "Cissi"],
  "score": 42
}
```

**Validering (server-side, innan skrivning)**

| Fält | Regel |
|------|-------|
| `team_name` | sträng, trimmad längd 1–40 |
| `players` | array med 2–4 strängar, var och en 1–30 tecken |
| `score` | heltal, `0 ≤ score ≤ total` |
| `total` | **skickas inte av klienten** — sätts server-side från config (`QUESTION_COUNT`) |

**Svar `201`**
```json
{
  "success": true,
  "data": {
    "id": 123,
    "team_name": "De Flygande Bäckasinerna",
    "players": ["Anna", "Björn", "Cissi"],
    "score": 42,
    "total": 50,
    "created_at": "2026-07-22T18:03:00Z",
    "rank": 3
  }
}
```
`rank` = lagets placering på topplistan just då (bekvämt för resultatskärmen).

**Fel `400`** → `{ "success": false, "error": "players måste vara 2–4 namn" }`

---

## `GET /api/highscores`

Topplistan. Sorterad `score DESC, created_at ASC`.

**Query** `?limit=100` (default 100, max 500)

**Svar `200`**
```json
{
  "success": true,
  "data": [
    { "rank": 1, "team_name": "…", "players": ["…"], "score": 49, "total": 50, "created_at": "…" }
  ]
}
```

---

## `GET /api/stats`

Aggregerad statistik för `/stats`-sidan. Härleds ur `high_scores`
(se [`db-schema.md`](db-schema.md)) — cachea gärna kort, men ingen egen tabell.

**Svar `200`**
```json
{
  "success": true,
  "data": {
    "total_teams": 128,
    "best_score": 49,
    "average_score": 31.4,
    "average_percent": 62.8
  }
}
```

Tom databas → nollor / `null`, inte `500`.

---

## Ej API i MVP

- **Frågebanken** — ligger i frontend (se [`db-schema.md`](db-schema.md)). Blir
  `GET /api/questions` först om den flyttas till DB.
- **`/qr`** — statisk QR mot appens URL, ingen backend.
- **Auth** — behövs inte; registrering är bara ett lagnamn, ingen inloggning.

## Verifierat mot Base44-preview (2026-07-22)

- **Leaderboard** i originalet: `GET …/entities/HighScore?sort=-score&limit=50` →
  motsvarar vår `GET /api/highscores` (sortering `score DESC`, limit 50).
- **`HighScore`-fälten** matchar vårt schema (`team_name`, `players[]`, `score`,
  `total`). En spelad omgång visade `total = 46` (banken har 50) — backend sätter
  `total` från config, så det påverkar inte kontraktet.
- **Ingen auth behövs** — appen är publik (`User/me` → 401 men fungerar ändå).
- Vi behåller **vårt** schema/fältnamn; frontend anpassas till det vid porten.
