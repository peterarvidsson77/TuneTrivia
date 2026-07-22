---
name: learning-capture
description: Fångar en lärdom, regel eller fallgrop som dök upp under arbetet och
  skriver in den i projektets CLAUDE.md i rätt sektion (Hårda regler / Gotchas /
  Deploy-gotchas) — så att framtida sessioner inte upprepar misstaget. Använd när
  något brände handen, när ett icke-uppenbart beslut togs, när en regel uppstod,
  eller när användaren ber om att "skriva ner det här", "fånga lärdomen",
  "lägg till i gotchas", eller "kom ihåg detta till nästa gång".
---

# Learning Capture → CLAUDE.md

Den viktigaste vanan i ett projekt är att skriva ner regeln i samma stund den
uppstår. Den här skillen gör det till en handling istället för en god intention:
den destillerar lärdomen till **en rad** och lägger den i rätt CLAUDE.md-sektion.

Till skillnad från generella learning-capture-verktyg skapar den **ingen lös
fil** — den skriver till projektets faktiska minne (`CLAUDE.md`), som är det
enda som varje framtida session garanterat läser.

## När den ska användas

Trigga på dessa moment:
- **Bränd hand** — något failade på ett icke-uppenbart sätt (deploy hängde, en
  parser bröt, ett verktyg betedde sig oväntat).
- **Icke-uppenbart beslut** — ni valde A över B av ett skäl som inte syns i koden.
- **Ny non-negotiable** — en regel som måste gälla varje gång framåt.
- **Upprepat mönster** — samma sak gjordes manuellt två gånger.

Trigga **inte** på: triviala fakta som syns direkt i koden, engångsdetaljer utan
återanvändning, eller saker som redan står i CLAUDE.md.

**ROI-grind:** fånga bara om lärdomen sannolikt sparar tid/fel vid återbesök —
en varning framtida-du faktiskt skulle snubbla på igen. Är den uppenbar nästa
gång ändå? Släpp den. (Gäller en *procedur* snarare än en regel? Se
`.claude/skills/SKILLS.md` — det kan vara en egen skill istället.)

## Steg

### 1. Klassa lärdomen → välj sektion
| Lärdomstyp | Sektion i CLAUDE.md |
|------------|---------------------|
| "Detta MÅSTE/får ALDRIG ske" (non-negotiable) | **Hårda regler** |
| Icke-uppenbart kod-/runtime-beteende, fälla i en funktion/lib | **Gotchas** |
| Deploy/CI/infra-grop, manuellt steg CI inte gör | **Deploy-gotchas** |
| Återanvändbar arbetsprocedur (inte en regel) | överväg en egen skill istället |

### 2. Destillera till EN rad
Format: *vad som gäller / vad som händer* + *varför / vad man gör istället*.
Tight nog att skannas på en sekund. Inte en dagbok — en varningsskylt.

- ✅ `funktionX() skriver över Y via JS — kontrollera den om Z verkar försvinna.`
- ✅ `SQL-migrationer körs INTE av deploy — kör manuellt efter merge, annars failar prod-testerna.`
- ❌ En paragraf som återberättar hela felsökningssessionen.

### 3. Kolla redundans
Sök i CLAUDE.md innan du skriver — finns regeln redan, skärp den befintliga
raden istället för att lägga en dubblett.
```bash
grep -in '«nyckelord ur lärdomen»' CLAUDE.md
```

### 4. Skriv in raden
Lägg den under rätt rubrik i `CLAUDE.md`. Behåll sektionens stil (punktlista).
För en **Hård regel**: lägg under "Projektspecifika", inte bland de universella.

### 5. Bekräfta — kort
Rapportera till användaren: vilken rad, vilken sektion, en mening om varför.
Bumpa **inte** version och rör inte changelog för en ren CLAUDE.md-anteckning
(det är dokumentation, inte kod) — om inte användaren ändå har en kodändring i
samma session som ska bumpas.

## Princip

CLAUDE.md ska vara *odlad*, inte *mallad*. Tomma Gotchas/Deploy-sektioner är
features — de bjuder in till att fyllas. Den här skillen är hur de fylls: en
rad i taget, i samma stund handen bränns.
