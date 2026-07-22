# Deploy-guide — TuneTrivia

Deployar API + spelsida som **en** container (backenden serverar spelsidan → en
enda delbar URL, ingen CORS). Rekommenderad host: **Render** (managed Postgres +
blueprint). Docker-baserad, så Fly.io/Railway/VPS fungerar också.

## Vad som körs

En web-service (Docker, se [`../Dockerfile`](../Dockerfile)) + en Postgres. Servern
läser frågebanken från `data/questions/` och serverar spelsidan från
`backend/public/`.

Miljövariabler: `DATABASE_URL` (från databasen), `QUESTION_COUNT` (default 50),
`PORT` (sätts av hosten), `NODE_ENV=production`.

## Render (rekommenderat)

1. Skapa konto på render.com och koppla ditt GitHub-konto.
2. **New → Blueprint**, välj repot `peterarvidsson77/TuneTrivia`. Render läser
   [`../render.yaml`](../render.yaml) och skapar **web-service + Postgres**.
3. Klicka **Apply**. Render bygger imagen, skapar databasen, kör migrationer
   (`preDeployCommand: npm run db:migrate`) och startar tjänsten.
4. När statusen är *Live*: öppna URL:en (t.ex. `https://tunetrivia.onrender.com`).
   Det är den delbara spellänken.

> Free-tjänsten somnar vid inaktivitet och tar ~30 sek att vakna första anropet.
> Free-databasen har en tidsgräns — uppgradera planen för permanent drift.

## Fly.io (alternativ)

```bash
flyctl launch --no-deploy          # skapar fly.toml från Dockerfile
flyctl postgres create             # skapa Postgres, attach:
flyctl postgres attach <db-namn>   # sätter DATABASE_URL
flyctl deploy
flyctl ssh console -C "sh -c 'cd /app/backend && npm run db:migrate'"
```

## Testa lokalt med Docker

```bash
docker build -t tunetrivia .
docker run -p 3000:3000 -e DATABASE_URL="postgres://…" -e QUESTION_COUNT=50 tunetrivia
# öppna http://localhost:3000
```

## Efter deploy

- Rök-testa: `GET /health` → `{ "success": true, ... }`, öppna `/` och spela en runda.
- **Uppdatera `CLAUDE.md`** (Branch-strategi + Deploy-gotchas) med den faktiska
  deploy-triggern och eventuella gropar.
- CI (typecheck + test) körs via [`../.github/workflows/ci.yml`](../.github/workflows/ci.yml).

## Migrationer

Genereras från Drizzle-schemat och appliceras vid deploy. Lokalt/manuellt:

```bash
cd backend
npm run db:generate   # vid schemaändring
npm run db:migrate    # applicera mot DATABASE_URL
```
