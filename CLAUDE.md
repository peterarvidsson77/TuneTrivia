# CLAUDE.md — TuneTrivia

Läs denna fil innan du skriver kod. Djupare referensmaterial finns i `docs/`.

> Den här filen är odlad, inte mallad. När du upptäcker en regel eller faller i
> en grop — skriv ner den **direkt** (Hårda regler / Gotchas / Deploy-gotchas).
> Det är den enskilt viktigaste vanan i det här dokumentet.

---

## Vad är TuneTrivia?

TuneTrivia är ett gruppbaserat musikquiz-spel i realtid: en värd driver quizet på
storbild och lag svarar från sina egna mobiler. Tänkt för fester, pubkvällar och
event där flera lag tävlar mot varandra rond för rond.

**Syfte/affärsmodell:** A group music quiz game where teams answer music trivia questions

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
- **Varje yta/lager har eget ansvar** — blanda inte publik logik, app-logik och
  admin. Ytorna är: **Host** (storbild — frågor, timer, leaderboard), **Spelare**
  (mobil lag-vy — svara på frågor), **Admin** (hantera frågebanker och sessioner).

**Projektspecifika:**
- **Servern är auktoritativ för speltillstånd och poäng** — klienten visar bara.
  Rätt svar, rondlås och poängräkning avgörs server-side, aldrig i browsern.

---

## Stack

- **Backend:** Node.js med WebSockets för realtid (rondstart, svar,
  leaderboard-push till alla klienter samtidigt).
- **Databas:** PostgreSQL — alltid via prepared statements / parametriserade queries.
- **Frontend:** en vy per yta (Host, Spelare, Admin). Ramverk beslutas per yta
  vid behov; börja lätt (vanilla) tills något tvingar fram mer.
- **Config:** miljövariabler (`.env`), mall i `.env.example`. Inga hårdkodade
  URL:er/nycklar.
- **Hosting/deploy:** beslutas när första deployen görs (kräver Node-kompatibel
  host, ej rent statiskt webbhotell). Uppdatera Branch-strategi + Deploy-gotchas
  när den valts.

---

## Filstruktur

Växer allt eftersom vi skapar det. Nuvarande + planerad baslinje:

```
TuneTrivia/
├── CLAUDE.md            ← denna fil (orientering)
├── README.md
├── version.json         ← nuvarande version (ersätts vid varje bump)
├── changelog.json       ← versionshistorik (växer uppåt)
├── package.json         ← Node-projekt, scripts (npm test, npm start)
├── .env.example         ← config-mall (riktig .env committas aldrig)
├── .gitignore
├── src/                 ← (planeras) server + de tre ytorna
│   ├── server/          ← WebSocket-server, spel-logik, DB-lager
│   ├── host/            ← Host-ytan (storbild)
│   ├── player/          ← Spelar-ytan (mobil)
│   └── admin/           ← Admin-ytan (frågebanker, sessioner)
├── docs/                ← djupare referens (DB-schema, API/events, deploy)
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
- **WebSocket-meddelanden:** typade event `{ "type": "...", "payload": {…} }`.
  Servern är auktoritativ för speltillstånd och poäng.
- **Config via miljövariabler** (`.env`, mall i `.env.example`) — inga hårdkodade
  URL:er/nycklar.
- **i18n / språk:** beslutas när UI byggs.

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
| DB-schema | `docs/db-schema.md` (planeras) |
| API- & WebSocket-events | `docs/api.md` (planeras) |
| Deploy-guide | `docs/deploy.md` (planeras) |
