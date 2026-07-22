# DB-schema — TuneTrivia (PostgreSQL)

Ersätter Base44:s datalager. **Källa:** Drizzle-schemat i
[`backend/src/db/schema.ts`](../backend/src/db/schema.ts). Migrationer genereras
därifrån till `backend/drizzle/` (`npm run db:generate`) och appliceras med
`npm run db:migrate`.

## Vad som ligger i DB — och inte

| Data | Var | Varför |
|------|-----|--------|
| **Highscores / topplista** | DB (`high_scores`) | Delas mellan lag, måste persistera |
| **Statistik** (antal lag, bästa/snitt-poäng, snitt-%) | **Härleds** ur `high_scores` | Single source of truth — aldrig en egen kolumn |
| **Frågebanken** (50 frågor) | Frontend (konstant/JSON) i MVP | Samma för alla, ändras sällan, ingen anti-fusk-modell. Kan flyttas till DB senare vid behov av admin-yta |

## Tabell: `high_scores`

| Kolumn | Typ | Not |
|--------|-----|-----|
| `id` | `BIGSERIAL` PK | |
| `team_name` | `TEXT` | 1–40 tecken (trimmat) |
| `players` | `JSONB` | Array av spelarnamn, **2–4** st |
| `score` | `INTEGER` | Antal rätt, `0..total` |
| `total` | `INTEGER` | Max möjliga. **Sätts server-side** från config (`QUESTION_COUNT`), inte från klienten |
| `created_at` | `TIMESTAMPTZ` | Default `now()` |

**Constraints** (i schemat, genererade till migrationen):
`team_name` 1–40 tecken · `players` är array med 2–4 element · `0 ≤ score ≤ total`
· `total > 0`. Constraints är sista skyddsnätet — huvudvalideringen sker i
backend med zod (se [`api.md`](api.md)).

**Index:** btree på `(score, created_at)` — stödjer topplistans fråga
(`ORDER BY score DESC, created_at ASC`).

## Statistik härleds (inga egna kolumner)

```sql
SELECT
    count(*)                                        AS total_teams,
    max(score)                                      AS best_score,
    round(avg(score)::numeric, 1)                   AS average_score,
    round(avg(score::numeric / total) * 100, 1)     AS average_percent
FROM high_scores;
```

## Öppet / framtid

- Frågebank i DB (kräver admin-yta) — inte i MVP.
- Ev. `sessions`/`events`-tabell om spelmodellen senare blir realtid/flera lag
  samtidigt. Inte nu.
