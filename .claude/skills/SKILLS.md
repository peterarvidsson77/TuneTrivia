# Skill-författarguide

Hur du skapar och underhåller skills i det här projektet. Destillerat ur
beprövade mönster (bl.a. Nate Jones Open Skills) — men medvetet bantat: en
disciplin, inte ett bibliotek.

## Grundregeln: börja med en

Varje aktiv skill kostar kontext och kan trigga vid fel tillfälle. Ett nytt
projekt börjar med **en** skill (`learning-capture`) och växer egna först när ett
mönster bevisat sig. Motstå frestelsen att importera 20 skills "för säkerhets
skull" — det är dokumentation som brusar.

## Tre hem för en skill — var hör den hemma?

Innan du skapar eller importerar en skill: avgör vilket *lager* den tillhör. De
flesta nyttiga skills hör **inte** hemma i projektet — de är antingen personliga
eller villkorade på vad projektet blir.

| Lager | Lever i | Vad som hör hit |
|-------|---------|-----------------|
| **Projekt-baslinje** | det här repots `.claude/skills/` (alltid-på) | Bara det varje projekt behöver från dag ett, återkommande. I praktiken: `learning-capture`. |
| **Operatörs-personligt** (reser med *dig*) | `~/.claude/skills/` | Saker som följer dig över alla projekt — CV, pitch, arbetsstil, scoping-vanor. Inte projektberoende. |
| **Domän-paket** (hämtas vid behov) | läggs i projektets `.claude/skills/` *när* projektet visar sig vara den sorten | Excel-tooling, prompt-bibliotek, skill-dev-verktyg. Se `CATALOG.md`. |

Regeln: **projekt-baslinjen är smal med flit.** Är du osäker vilket lager —
det är nästan aldrig baslinjen. Operatörs-grejer → `~/.claude/`. Domän-grejer →
hämta in när behovet är konkret, inte "för säkerhets skull".

## Skill vs CLAUDE.md-regel — välj rätt hem

| Lärdomen är… | Hör hemma i… |
|--------------|--------------|
| En regel/fakta som gäller alltid | **CLAUDE.md** (Hårda regler / Gotchas) |
| En *procedur* som körs på begäran ("gör X åt mig") | **En skill** |
| En engångsdetalj utan återanvändning | Ingenstans — släpp den |

CLAUDE.md läses *varje* session (alltid-på). En skill laddas *on-demand* när dess
`description` matchar. Regler → CLAUDE.md. Handlingar → skill.

## ROI-grinden — skapa bara om det lönar sig

Skapa en ny skill bara när **alla tre** stämmer:
1. **Hög återanvändning** — proceduren kommer köras många gånger framåt, inte
   en gång.
2. **Icke-trivial** — den kapslar in steg/beslut som annars måste återupptäckas
   varje gång.
3. **Ingen dubblett** — täcks inte redan av en befintlig skill eller en inbyggd
   (`/init`, `/code-review`, `session-start-hook`, …).

Tveksam? Skriv en CLAUDE.md-rad istället. Det är billigare att uppgradera en rad
till en skill senare än att bära en skill som sällan triggar.

## SKILL.md-anatomi

```
.claude/skills/<skill-namn>/
├── SKILL.md            ← obligatorisk: frontmatter + instruktioner
├── references/         ← valfritt: längre underlag skillen läser vid behov
└── assets/             ← valfritt: mallar, skript, exempel-filer
```

`SKILL.md` har YAML-frontmatter och en kort instruktionskropp:

```markdown
---
name: skill-namn
description: Vad den gör OCH när den ska triggas — skriv triggers i klartext
  ("använd när användaren ber om X, Y, eller efter Z"). Beskrivningen är det
  enda som avgör om skillen laddas, så var konkret om triggerfraserna.
---

# Rubrik

En–två meningar om vad skillen löser och varför.

## Steg
Numrerade, konkreta steg. Kör saker, fråga bara när det inte går att härleda.
```

## Författar-checklista

- [ ] `description` namnger **både** funktion och **triggerfraser** — annars
      laddas skillen aldrig vid rätt tillfälle.
- [ ] Skillen *gör* något (procedur), den är inte en regel förklädd till skill.
- [ ] Stegen är konkreta och körbara — inte allmänna råd.
- [ ] Tungt referensmaterial ligger i `references/`, inte inbakat i `SKILL.md`
      (håller alltid-laddade delen liten).
- [ ] Passerar ROI-grinden ovan.
- [ ] Ingen överlapp med befintlig skill eller inbyggt kommando.

## Underhåll

- När en skills workflow ändras — uppdatera dess `SKILL.md` i samma session.
- En skill som inte triggat på länge: överväg att ta bort den eller skärpa dess
  `description`. Död skill är brus.
- Skill-idéer som visar sig vara *regler* flyttas till CLAUDE.md.
