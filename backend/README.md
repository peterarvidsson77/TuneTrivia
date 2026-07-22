# TuneTrivia — backend

Node + TypeScript-API (Fastify) mot PostgreSQL (Drizzle ORM). Implementerar
kontraktet i [`../docs/api.md`](../docs/api.md).

## Setup

```bash
cd backend
cp .env.example .env        # fyll i DATABASE_URL m.m.
npm install
npm run db:migrate          # kör migrationer mot Postgres
npm run dev                 # startar API på PORT (default 3000)
```

## Scripts

| Kommando | Gör |
|----------|-----|
| `npm run dev` | Startar API med auto-reload (tsx) |
| `npm start` | Startar API |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Kör enhetstester (vitest) |
| `npm run db:generate` | Genererar migration från `src/db/schema.ts` |
| `npm run db:migrate` | Applicerar migrationer |

## Arkitektur (lager)

```
src/
├── index.ts          ← start (listen)
├── app.ts            ← Fastify-instans, route-registrering, fel-/404-hantering
├── config.ts         ← miljövariabler validerade med zod (kastar om ogiltiga)
├── validation.ts     ← zod-schema för indata (delas begreppsmässigt med frontend)
├── lib/
│   ├── envelope.ts   ← enhetligt svarskuvert { success, data|error }
│   └── itunes.ts     ← iTunes-preview-uppslag (testbar, injicerbar fetch)
├── db/
│   ├── schema.ts     ← Drizzle-schema (high_scores) — källa för migrationer
│   └── client.ts     ← Drizzle-klient (postgres.js)
└── routes/
    ├── highscores.ts ← POST/GET /api/highscores
    ├── stats.ts      ← GET /api/stats (härledd statistik)
    └── preview.ts    ← GET /api/preview (iTunes-uppslag, cache-bar)
```

## Endpoints

| Metod | Väg | Beskrivning |
|-------|-----|-------------|
| `GET` | `/health` | Hälsokoll |
| `POST` | `/api/highscores` | Spara resultat (validerat; `total` sätts server-side från `QUESTION_COUNT`) |
| `GET` | `/api/highscores?limit=` | Topplista (`score DESC, created_at ASC`) |
| `GET` | `/api/stats` | Härledd statistik |
| `GET` | `/api/preview?q=&artist=&country=` | Resolvar iTunes-preview-URL (server-side, cache-bar) |

Alla svar i enhetligt kuvert: `{ "success": true, "data": … }` /
`{ "success": false, "error": "…" }`.

## Designval

- **`total` litas aldrig på från klienten** — sätts från `QUESTION_COUNT` (config).
- **Statistik härleds** ur `high_scores` (ingen egen tabell) — single source of truth.
- **Preview-endpoint server-side** (förbättring mot Base44 som hårdkodade URL:er):
  klienten skickar bara söksträngen, servern slår upp och cachar. URL:er ruttnar ej.
- **Ingen auth** — appen är publik (verifierat mot Base44-originalet).

## Testat

`npm run typecheck` rent · `npm test` 13/13 gröna · migration genererad ·
servern bootar och svarar (health, validering, fel-kuvert). DB-integration kräver
en körande Postgres.
