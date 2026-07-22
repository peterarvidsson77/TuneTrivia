# TuneTrivia — spel-spec (port-mål)

> **Källa:** andrahandsbeskrivning av en fungerande Base44-app som en kompis
> byggt. Riktig källkod väntas via GitHub-koppling. **Stäm av detta dokument mot
> koden när den kommer** — det som står här är vad vi tror appen gör, inte
> verifierat mot implementationen.

## Flöde

Appen har fyra faser: **Intro → Registrering → Spel → Resultat**.

1. **Intro** — startskärm med logga, "Starta Quiz"-knapp, länkar till QR och stats.
2. **Registrering** — lagnamn (klickbara förslags-chips + "Tips"-knapp) + 2–4
   spelarnamn. Minst 2 spelare krävs.
3. **Spel** — 50 frågor i **fast ordning** (samma för alla lag). Varje fråga visar
   två badges (årtionde + frågetyp) och en kort fakta efter svar.
4. **Resultat** — poäng, laginfo och topplista. Poängen sparas till databasen.

## Frågor

- **50 totalt**, fast ordning:
  - **40 textfrågor** först — blandade årtionden (70-tal → 2020-tal), blandade typer.
  - **10 "Lyssna & gissa"** sist.
- **Frågetyper:**
  - **Gissa årtal** — vilket år släpptes låten?
  - **Saknat ord** — vilket ord saknas i textraden?
  - **Ort i texten** — vilken stad/plats nämns i låten?
  - **One hit wonder** — vilken artist/grupp ligger bakom låten?
  - **Lyssna & gissa** — spela ljud och gissa låt/artist.
- **Ljud:** iTunes Search API ger 30-sek previews. Spelas **max ~5 sek** så
  låtnamnet inte avslöjas. Animerad spelare med equalizer-staplar.

## Sidor / routes

| Route | Innehåll |
|-------|----------|
| `/` | Quizet (Intro → Registrering → Spel → Resultat) |
| `/stats` | Liveuppdaterad topplista + statistik (antal lag, bästa poäng, snittpoäng, snitt-%) |
| `/qr` | Utskriftsvänlig QR-kod som leder till quizet |

## Datamodell

**`HighScore`** (Base44-entitet — mappas till Postgres-tabell vid porten):

| Fält | Typ | Not |
|------|-----|-----|
| `team_name` | string | Lagnamn |
| `players` | array | Spelarnamn (2–4) |
| `score` | number | Antal rätt |
| `total` | number | Max möjliga (50) |

## Design

- Mörkt tema (`#0a0118`), fuchsia/indigo-gradienter.
- Glassmorphism-kort med blur.
- Framer Motion-animationer vid frågeövergångar.
- Responsivt (mobil + desktop).

## Teknik (original, Base44)

React + Tailwind + Vite · Base44 BaaS (databas/auth/hosting) · Framer Motion ·
iTunes Search API · lucide-react.

## Öppna frågor att lösa vid porten

- Var lagras frågedata (frontend-konstant vs DB)? Base44-versionen verkar ha den i
  frontend.
- Sker poängräkningen i klienten? (Troligen ja — casual party-spel.)
- Behövs auth alls? Registrering är bara ett lagnamn, ingen inloggning syns.
- Hur genereras "Tips"-förslagen för lagnamn?
