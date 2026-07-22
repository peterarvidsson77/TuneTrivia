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
3. **Spel** — ett **slumpat urval** frågor dras ur den temabaserade frågebanken
   (per valt tema eller blandat). Varje fråga visar tema + frågetyp och en kort
   fakta efter svar. Ny dragning varje omgång → hög omspelbarhet.
4. **Resultat** — poäng, laginfo och topplista. Poängen sparas till databasen.

## Frågor — temabaserad bank, slumpad dragning

> **Ändrat från Base44-originalet:** kompisens app hade 50 fasta frågor i samma
> ordning. Vi går över till en **stor temabaserad frågebank** som appen **slumpar**
> ur varje omgång (inspirerat av användarens eget spel Melody Pursuit, där varje
> tema är en kurerad spellista). Ger variation och omspelbarhet.

- **Teman** (kategorier) — t.ex. 80-talet, One-hit wonders, Svenska hits, Film & TV,
  Melodifestivalen. Växer löpande. Register i `data/questions/index.json`.
- **Spelomgång** — dra N slumpade frågor (per valt tema eller blandat), shuffla
  ordning och svarsalternativ.
- **Frågetyper:**
  - **Gissa årtal** (`year`) — vilket år släpptes låten?
  - **Vem gjorde låten** (`which_artist`) — vilken artist/grupp?
  - **One-hit wonder** (`one_hit_wonder`) — vem låg bakom hiten?
  - **Film & TV** (`which_film`) — från vilken film/serie?
  - **Saknat ord** (`missing_word`) — komplettera **titeln** (aldrig låttext).
  - **Lyssna & gissa** (`listen_guess`) — spela ljud och gissa.
- **Ljud:** iTunes Search API ger 30-sek previews. Spelas **max ~5 sek** så
  låtnamnet inte avslöjas. Animerad spelare med equalizer-staplar.
- **Copyright:** ingen sångtext återges någonstans — se `data/questions/README.md`.

Frågebankens format och regler: [`../data/questions/README.md`](../data/questions/README.md).

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
lucide-react.

## Verifierat mot preview (2026-07-22)

Preview: `preview--savvy-beat-quiz-pro.base44.app`. Frågorna ligger **hårdkodade i
JS-bundeln** (ingen questions-entitet anropas). Bekräftade fynd:

- **Hans frågeschema:** `{ decade, type, question, options[], correct, fact, audio? }`
  där `correct` är ett **index** i `options`. 50 frågor, indelade per **årtionde**.
  Typer: `year` (21), `words` (14), `lyssna` (10), `onehit` (3), `plats` (2).
- **`words`/`plats` återger låttext** — copyright. Vi kopierar dem inte; vår
  bank gör "Saknat ord" på **titlar** (se `data/questions/README.md`).
- **`lyssna` har `audio` = hårdkodad iTunes-preview-URL.** Vi gör istället
  **live-uppslag**: lagra låt+artist, hämta preview via iTunes Search API vid
  speltid (URL:er ruttnar annars).
- **Leaderboard-API:** `GET …/entities/HighScore?sort=-score&limit=50` — matchar
  vår [`api.md`](api.md). Statistiksidan visade riktig data (total **46** i en
  spelad omgång trots 50 i banken — dubbelkolla hur många som faktiskt spelas).
- **Auth:** `User/me` ger 401 men appen funkar publikt → ingen auth behövs.

## Beslut för porten

- **Frågeschema:** vi behåller **vårt rikare schema** (`theme`/`song`/`answer`/
  `difficulty`, egna typnamn) — inte hans. Hans frågekomponenter **anpassas** till
  vårt format vid porten (alltså inte en ren data-swap på frågesidan; däremot är
  leaderboard/stats en ren backend-swap).
- **Frågedata:** i frontend (som hos honom), inte DB. Se `data/questions/`.
- **Poängräkning:** i klienten (casual), leaderboard-skrivning valideras server-side.

## Kvar att lösa

- Hur genereras "Tips"-förslagen för lagnamn? (inte kritiskt)
- Antal frågor per spelad omgång (bankens 50 vs observerade 46) — bekräfta.
