# Roadmap — TuneTrivia

Fasplan från scaffold till produktionsredo, ägd kodbas. Grundad i de beslut som
redan tagits (`CLAUDE.md`, `game-design.md`, `db-schema.md`, `api.md`).

## Fas 0 — Fundament ✅ (klart)

Scaffold, projektminne, datamodell + migration, API-kontrakt, temabaserad
frågebank (116 frågor, 11 teman), författarhjälp (iTunes-sök), spelbara prototyper
(quiz + humppacovers), delbar text-version.

## Fas 1 — Backend (skarp) ⬜

Node + **TypeScript**, implementerar `api.md` mot Postgres.

- Ramverk: Fastify (lätt, TS-vänligt) eller Express.
- DB-access: Drizzle (typer + migrations) **eller** `pg` + prepared statements.
- Endpoints: `POST /api/highscores`, `GET /api/highscores`, `GET /api/stats`.
- **Förbättring mot originalet:** `GET /api/preview?q=...` som resolvar iTunes-preview
  server-side (cache-bar, slipper JSONP i klienten, URL:er kan inte ruttna).
- Validering med zod (delas klient/server), enhetligt svarskuvert, felhantering.
- `total` sätts från config (`QUESTION_COUNT`), inte klienten.
- Enkla tester (`node --test`/vitest) för validering + scoring-format.

## Fas 2 — Frontend (skarp) ⬜

React + Vite + TypeScript + Tailwind. Portar kompisens komponenter där det går.

- Ytor: **Quiz** (`/`), **Stats** (`/stats`), **QR** (`/qr`).
- Spelflöde: registrering → slumpad omgång ur frågebanken → resultat.
- Frågetyper renderas per typ (text + ljud); ljud via backendens `/api/preview`.
- Fallback-states: laddning, nätverksfel, tom topplista.
- Frågebanken importeras från `data/questions/` (byggs in vid bundling).

## Fas 3 — Deploy & CI ⬜

- Hosting med Node + Postgres (Fly.io / Render / Hetzner).
- Miljövariabler för all config (`.env`, mall i `.env.example`).
- GitHub Actions: lint + typecheck + test + build vid PR; deploy vid merge till `main`.
- Uppdatera Branch-strategi + Deploy-gotchas i `CLAUDE.md` när valt.

## Fas 4 — Polish & innehåll ⬜

- Fler teman + fler finska covers (löpande).
- Fakta-verifiering av frågebanken (särskilt årtal).
- Ev. författar-admin (Nivå 1: iTunes-sök → JSON; se `backend/tools/`).
- Lagnamns-förslag ("Tips"-knappen).

## Beslut som styr Fas 1 (öppna)

- **TypeScript:** ja (rekommendation).
- **ORM:** Drizzle vs rå `pg`. Bekräfta innan Fas 1.
- **Ingen auth** — appen är publik (verifierat mot Base44).
