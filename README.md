# TuneTrivia

Ett gruppbaserat musikquiz-spel i realtid. En **värd** driver quizet på storbild,
och **lag** svarar från sina egna mobiler. Byggt för fester, pubkvällar och event
där flera lag tävlar mot varandra rond för rond.

> Läs [`CLAUDE.md`](CLAUDE.md) innan du skriver kod — den bär projektets regler,
> arbetsnivåer och versionsdisciplin.

## Ytor

| Yta | Enhet | Ansvar |
|-----|-------|--------|
| **Host** | Storbild | Visar frågor, timer och leaderboard |
| **Spelare** | Mobil | Lag svarar på frågor |
| **Admin** | Dator | Hanterar frågebanker och quiz-sessioner |

Servern är auktoritativ för speltillstånd och poäng — klienterna visar bara.

## Stack

- **Backend:** Node.js med WebSockets (realtids-push till alla klienter)
- **Databas:** PostgreSQL (prepared statements)
- **Frontend:** en vy per yta (Host / Spelare / Admin)

## Kom igång

```bash
git clone https://github.com/peterarvidsson77/TuneTrivia.git
cd TuneTrivia
cp .env.example .env      # fyll i DATABASE_URL m.m.
npm install
npm run dev
```

## Skript

| Kommando | Gör |
|----------|-----|
| `npm run dev` | Startar servern med auto-reload |
| `npm start` | Startar servern |
| `npm test` | Kör testsuiten |

## Struktur

Se filträdet i [`CLAUDE.md`](CLAUDE.md#filstruktur). Djupare referens
(DB-schema, API/events, deploy) samlas i [`docs/`](docs/).

## Versionshistorik

Aktuell version i [`version.json`](version.json), full historik i
[`changelog.json`](changelog.json).
