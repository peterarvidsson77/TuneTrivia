# Roadmap — TuneTrivia

Fasplan från scaffold till produktionsredo, ägd kodbas. Grundad i de beslut som
redan tagits (`CLAUDE.md`, `game-design.md`, `db-schema.md`, `api.md`).

## Fas 0 — Fundament ✅ (klart)

Scaffold, projektminne, datamodell + migration, API-kontrakt, temabaserad
frågebank (116 frågor, 11 teman), författarhjälp (iTunes-sök), spelbara prototyper
(quiz + humppacovers), delbar text-version.

## Fas 1 — Backend (skarp) ✅ (klart)

Node + **TypeScript** + **Fastify** + **Drizzle** + **zod**. Kod i `backend/`.

- ✅ Endpoints: `POST /api/highscores`, `GET /api/highscores`, `GET /api/stats`.
- ✅ **Förbättring mot originalet:** `GET /api/preview?q=...` resolvar iTunes-preview
  server-side (cache-bar, slipper JSONP i klienten, URL:er kan inte ruttna).
- ✅ Validering med zod, enhetligt svarskuvert, fel-/404-hantering.
- ✅ `total` sätts från config (`QUESTION_COUNT`), inte klienten.
- ✅ Drizzle-schema + genererad migration; statistik härledd i SQL.
- ✅ 13 enhetstester (validering, itunes, envelope) gröna; typecheck rent; server
  bootar och svarar korrekt. DB-integration kräver körande Postgres.

Se [`../backend/README.md`](../backend/README.md).

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

## Beslut (låsta i Fas 1)

- **TypeScript:** ja, backend + frontend.
- **ORM:** Drizzle (typer + migrations).
- **Backend-ramverk:** Fastify.
- **Ingen auth** — appen är publik (verifierat mot Base44).
