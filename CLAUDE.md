# CLAUDE.md — TuneTrivia

Läs denna fil innan du skriver kod. Djupare referensmaterial finns i `docs/`.

> Den här filen är odlad, inte mallad. När du upptäcker en regel eller faller i
> en grop — skriv ner den **direkt** (Hårda regler / Gotchas / Deploy-gotchas).
> Det är den enskilt viktigaste vanan i det här dokumentet.

---

## Vad är TuneTrivia?

TuneTrivia är ett gruppbaserat musikquiz på webben. Ett lag (2–4 spelare)
registrerar sig, spelar igenom ett **slumpat urval** frågor ur en **temabaserad
frågebank** och får poäng + placering på en gemensam topplista. Tänkt för fester,
pubkvällar och event. Ingen realtid eller storbild i nuläget — varje lag kör
quizet självständigt på en enhet. Slumpad dragning per omgång ger omspelbarhet.

**Syfte/affärsmodell:** A group music quiz game where teams answer music trivia questions

> **Ursprung:** en fungerande Base44-app (React) byggd av en kompis. Vi **portar**
> den till ett eget bygge — behåll React-frontend, byt ut Base44:s BaaS mot egen
> Node + Postgres-backend. Riktig källkod väntas via GitHub-koppling. Spec att
> porta mot: [`docs/game-design.md`](docs/game-design.md).

---

## Hårda regler

Non-negotiables. Börja med de universella nedan och lägg till en rad varje gång
du upptäcker en till. Håll listan kort och brutal — om allt är en hård regel är
inget det.

**Universella (gäller varje projekt):**
- **Hemligheter/config committas aldrig** — checka in en `*.example`-fil i git,
  den riktiga filen lever bara lokalt och på servern.
- **Single source of truth — hårdkoda aldrig värden** som lever i config/DB
  (priser, gränser, URL:er, feature-flaggor). Härled alltid från källan.
- **Alla DB-queries använder prepared statements** — ingen strängkonkatenering
  i queries.
- **Enhetligt API-svarsformat** — varje endpoint svarar i samma kuvert, t.ex.
  `{ "success": true, "data": {…} }` / `{ "success": false, "error": "…" }`.
- **Säkerhetskänsliga lås sker server-side** — lita aldrig på klienten för
  auktorisering, betalning, eller tidslås. Validera i backend.
- **Varje yta/lager har eget ansvar** — blanda inte spel, publik statistik och
  backend. Ytorna är: **Quiz** (`/` — registrering → 50 frågor → resultat),
  **Stats** (`/stats` — publik topplista + statistik), **QR** (`/qr` — utskrivbar
  kod till quizet). Admin för frågebanker kan tillkomma senare.

**Projektspecifika:**
- **Leaderboard-skrivningar valideras server-side** — poängräkningen får ske i
  klienten (casual party-spel, ingen anti-fusk-modell), men backend validerar
  formatet innan en highscore sparas så topplistan inte skräpas ned.
- **Ingen sångtext i frågebanken** — copyright. "Saknat ord" görs på **titlar**,
  aldrig på låttextrader; fakta beskriver artist/år/film och citerar aldrig text.
- **Rätt svar måste finnas i `options`** — valideras vid bygge av frågebanken.

---

## Stack

- **Frontend:** React + Tailwind CSS + Vite. Framer Motion (animationer),
  lucide-react (ikoner). Portas från Base44-appen — behåll komponenterna, byt ut
  datalagret.
- **Backend:** Node.js — ersätter Base44 BaaS (databas + hosting). Enhetligt
  API-svarskuvert. **Ingen WebSocket** (spelet är inte realtid).
- **Databas:** PostgreSQL — prepared statements. Startentitet: `HighScore`
  (se [`docs/game-design.md`](docs/game-design.md)).
- **Externt API:** iTunes Search API för 30-sek låtpreviews (spelas max ~5 sek så
  låtnamnet inte avslöjas) i "Lyssna & gissa"-frågorna.
- **Config:** miljövariabler (`.env`), mall i `.env.example`. Inga hårdkodade
  URL:er/nycklar.
- **Hosting/deploy:** beslutas senare (Node-backend + statisk frontend). Base44
  skötte detta förut; vi äger det själva efter porten. Uppdatera Branch-strategi +
  Deploy-gotchas när host valts.

---

## Filstruktur

Firmar upp när kompisens kod kommer via GitHub. Planerad baslinje:

```
TuneTrivia/
├── CLAUDE.md            ← denna fil (orientering)
├── README.md
├── version.json         ← nuvarande version (ersätts vid varje bump)
├── changelog.json       ← versionshistorik (växer uppåt)
├── package.json         ← Node-projekt, scripts
├── .env.example         ← config-mall (riktig .env committas aldrig)
├── .gitignore
├── frontend/            ← (planeras) React + Vite-app (portas från Base44)
├── backend/             ← Node-API + Postgres (migrations/), tools/ (författarhjälp)
├── data/questions/      ← temabaserad frågebank (JSON per tema + index.json)
├── prototypes/          ← kastbara koncept-demos (ej produktionskod)
├── docs/                ← game-design.md, db-schema, api, deploy
└── tests/               ← testsuite (npm test)
```

---

## Projektminne — en kanonisk karta, inte index överallt

Plain text i repot (denna fil + `docs/`) är det enda minneslagret som porterar
överallt och överlever restriktioner — skills porterar inte till alla klienter,
MCP/externa kunskapsbaser blockeras av jobbkonton. **Repo-filer är därför
kanoniska; allt annat (MCP, externa KB) är valfria speglar, aldrig parallella
sanningar.**

Hur projektet dokumenteras och navigeras:

| Behov | Lösning | Drift-skydd |
|-------|---------|-------------|
| Orientera i projektet | **Denna fil** — filträdet + "Djupare referens" | Ett ställe att hålla aktuellt |
| Förklara en *icke-uppenbar* mapp | `README.md` i *just den* mappen — bara där varför-den-finns inte syns i filnamnen | Få, medvetna |
| Ett register med verklig sanning | Semantisk katalog (JSON/MD) | En sanity-check/test som failar vid drift |

**Lägg inte en `index.md` i varje mapp.** Det duplicerar `ls`, skapar en drift-
punkt per mapp, och löser ett navigationsproblem agenten inte har (den har Glob/
Grep/Read). Skriv en mapp-not bara där den bär semantik filnamnen saknar — annars
räcker filträdet ovan. Dokumentation som glider ifrån koden är värre än ingen.

---

## Arbetsnivåer (N0/N1/N2)

Varje arbete faller i en av tre nivåer baserat på risk och scope. Nivån avgör hur
mycket ceremoni som krävs — så att en CSS-pixeljustering inte kostar lika mycket
som en ny endpoint. **Default till N1 vid tvekan.**

| Nivå | Exempel | Versionsbump | Changelog | Tester |
|------|---------|--------------|-----------|--------|
| **N0** — Micro | CSS/färg/padding/typo, kommentar, ren dokfix utan kodlogik | z+1 patch | ✓ en kort rad | Visuell verifiering räcker — kör inga testsuiter |
| **N1** — Small | Liten bugg utan logikändring, ny i18n-nyckel, minor refactor inom en fil | z+1 patch | ✓ en post | `npm test -- <berörd testfil/mönster>` + 1–3 nya asserts vid regressionsrisk |
| **N2** — Större | Ny feature, ny endpoint, schemaändring, migration, refactor över flera filer | enligt scope (y+1 feature, z+1 tillägg) | ✓ full post | `npm test` (hela suiten) + nya asserts i berörda områden |

**Eskalera till N2** när arbetet: lägger till endpoints/kolumner/migrationer/
cron-jobb · påverkar mer än ett område (frontend + backend + DB) · har
regressionsrisk utanför filen · tar mer än ~10 min att verifiera.

**Reducera till N0** bara när arbetet är: ren visuell justering · typo/kommentar/
dok utan kodlogik · helt isolerat. Mekanisk regel: om ändringen tvingar dig att
röra befintliga asserts i tester → det är minst N1.

---

## Versionshantering

Semantisk versionering — `version.json` uppdateras i **varje** session.

| Förändring | Exempel |
|---|---|
| Liten fix, buggfix, justering | `1.0.0` → `1.0.1` (öka z) |
| Ny feature, större ändring | `1.0.0` → `1.1.0` (öka y, nollställ z) |
| Bryta bakåtkompatibilitet | `1.0.0` → `2.0.0` (öka x) |

**Två filer — olika roller:**
- **`version.json`** = bara *nuvarande* version. Ersätts helt vid varje bump.
- **`changelog.json`** = historik (kumulativ). Nya versioner läggs **överst** i
  `versions`-arrayen — befintliga rader rörs aldrig.

**Hårda regler för versionsbumpning:**
- **Aldrig skriva över en gammal version** — även om en prompt anger ett lägre
  eller redan använt nummer. Verifiera mot nuvarande `version.json` *och* senaste
  posten i `changelog.json` före bump.
- **Varje bump = tre samtidiga uppdateringar:** `version.json` (ersätts),
  `changelog.json` (ny post överst), och commit-meddelandet (refererar versionen).
- **Allt arbete dokumenteras i `changelog.json`** — även små UI-justeringar.
- **Glömt en tidigare session?** Backfilla från git-commits *innan* du bumpar.

---

## Test-disciplin

- **Granska och uppdatera tester i samma session som koden** (gäller N1 och N2) —
  nya endpoints och features ska ha testfall *innan* commit.
- **Kör tester** — `npm test` (hela suiten) för N2, `npm test -- <mönster>`
  (delmängd) för N1, visuell verifiering för rena N0-fixar. Efter deploy:
  smoke-test mot den deployade miljön när host är vald (fyll i exakt kommando då).
- **Verifiera output, inte bara att suiten är grön.** En grön suite betyder att
  *suiten* passerar — inte att *din ändring* gör det den var tänkt att göra.
  Spot-checka faktiskt beteende (rätt värde i svaret, elementet renderas,
  migrationens kolumn finns) innan du säger "klart".

---

## Branch-strategi

```
main      → produktion/trunk
feature/* → kortlivade feature-branches, merge → main
hotfix/*  → akuta produktionsfixar → main
```

**Deploy-trigger:** beslutas när första hosten väljs. Intilldess sker deploy
manuellt från `main`. Fyll i den faktiska triggern (t.ex. 'auto-deploy via CI vid
push till main') här när CI/host är på plats.

**Starta alltid ny feature:**
```bash
git checkout main && git pull origin main
git checkout -b feature/namn-på-feature
```

---

## Nyckelkonventioner

Växer efterhand. Startpunkter:
- **Enhetligt API-svarskuvert:** `{ "success": true, "data": {…} }` /
  `{ "success": false, "error": "…" }` (se Hårda regler).
- **Routes:** `/` (quiz), `/stats` (publik topplista + statistik), `/qr` (QR-kod).
- **Frågedata:** 50 frågor i fast ordning — 40 textfrågor (blandade årtionden
  70-tal→2020-tal) följt av 10 "Lyssna & gissa". Frågetyper: Gissa årtal, Saknat
  ord, Ort i texten, One hit wonder, Lyssna & gissa. Varje fråga har en kort fakta
  som visas efter svar. Detaljer i [`docs/game-design.md`](docs/game-design.md).
- **Config via miljövariabler** (`.env`, mall i `.env.example`) — inga hårdkodade
  URL:er/nycklar.
- **Språk:** appen är på svenska.

---

## Gotchas

> Börja TOM (ta bort exempelraden, behåll rubriken). En rad per bränd hand.
> Den dyrbaraste sektionen i filen — och den kan bara skrivas av framtiden.
> `learning-capture`-skillen lägger rader här åt dig.

---

## Deploy-gotchas

> Börja TOM. Intjänad ärrvävnad: deploy-verktyg som hänger, parsers som bryter,
> manuella steg som CI inte gör. Skriv ner varje grop direkt efter att du
> klättrat upp ur den.

---

## Djupare referens

Fylls i allt eftersom vi skapar det.

| Ämne | Fil |
|------|-----|
| Roadmap (fasplan till produktion) | [`docs/roadmap.md`](docs/roadmap.md) |
| Spel-spec (frågor, faser, entiteter) | [`docs/game-design.md`](docs/game-design.md) |
| Frågebank (teman, format, regler) | [`data/questions/README.md`](data/questions/README.md) |
| DB-schema | [`docs/db-schema.md`](docs/db-schema.md) |
| API-endpoints | [`docs/api.md`](docs/api.md) |
| Deploy-guide | `docs/deploy.md` (planeras) |
