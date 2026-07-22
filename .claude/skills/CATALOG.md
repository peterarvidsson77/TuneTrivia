# Skill-katalog — hämta vid behov

Skills som **inte** ingår i projekt-baslinjen men är värda att känna till och kan
hämtas in när behovet är konkret. Bakas medvetet *inte* in i templaten — varje
alltid-laddad skill kostar kontext och kan trigga vid fel tillfälle. Lägg till en
**när** projektet visar att den behövs, inte "för säkerhets skull".

Se `SKILLS.md` → "Tre hem för en skill" för vilket lager som är vilket.

## Hur du hämtar in en

Källorna nedan pekar mot Nate Jones Open Skills-samling. Kopiera in den enskilda
skill-mappen där den hör hemma:

```bash
# Domän-paket → in i projektet (alltid-på för just det här repot)
git clone --depth 1 https://github.com/Exploration-labs/Nates-Substack-Skills /tmp/nates
cp -r /tmp/nates/<skill-namn> .claude/skills/

# Operatörs-personligt → in i din egen globala mapp (reser med dig, alla projekt)
cp -r /tmp/nates/<skill-namn> ~/.claude/skills/
```

Granska alltid `SKILL.md` innan du litar på en importerad skill — det är ett
personligt bibliotek, inte en standard. Skärp `description` om triggerfraserna
inte passar ditt projekt.

---

## Lager 2 — operatörs-personligt (→ `~/.claude/skills/`)

Följer dig, inte projektet. Hör hemma i din globala mapp.

| Skill | Vad den gör | Hämta när |
|-------|-------------|-----------|
| `requirements-elicitation` | Strukturerad kravinsamling — gör en luddig uppgift till en bunden assignment | Du brottas återkommande med oklart scopade uppgifter (Plan-läge + `AskUserQuestion` täcker det mesta först) |
| `resume-builder` | CV-mallar och -byggande | Aldrig projektberoende — ren personlig nytta |
| `job-search-strategist` | Karriär-/jobbsöksplanering | Personligt |
| `pitch-deck-builder` | Pitch-deck-ramverk | Du ska pitcha ett projekt (engångs, ad hoc) |
| `vibe-coding` | Snabb iterativ arbetsstil | Du föredrar den arbetsstilen — preferens, inte projektkrav |

## Lager 3a — domän-villkorade (→ projektets `.claude/skills/`)

Hämta bara om projektet *är* den sorten.

| Skill | Vad den gör | Hämta när projektet… |
|-------|-------------|----------------------|
| `xlsx-editor` | XLSX-filmanipulation | …läser/skriver Excel-filer |
| `complex-excel-builder` | Avancerade Excel-formler/visualiseringar | …genererar kalkylark som output |
| `prompting-pattern-library` | Bibliotek av prompt-mönster | …bygger LLM-features (för Claude: se även `claude-api`-skillen) |
| `prompt-optimization-analyzer` | Hittar token-slöseri i prompts | …har prompts i drift som ska trimmas |
| `ai-vendor-evaluation` | Ramverk för att välja AI-leverantör | …står inför ett leverantörsval (engångsbeslut) |
| `agentic-development` | Guidning för att bygga med AI-agenter | …vill ha referensmaterial — överväg `docs/` istället för en skill |

## Lager 3b — skill-dev-verktyg (→ projektets `.claude/skills/`)

Verktyg för att underhålla ett *stort* skill-bibliotek. Meningslösa i ett färskt
repo med ~1 skill — hämta in **när biblioteket vuxit förbi ~15 skills**, inte
före. (Deras *princip* är redan destillerad i `SKILLS.md`.)

| Skill | Vad den gör |
|-------|-------------|
| `skill-doc-generator` | Auto-genererar README-dokumentation för skills |
| `skill-gap-analyzer` | Hittar täckningsluckor och redundans mellan skills |
| `skill-dependency-mapper` | Visualiserar beroenden/workflows mellan skills |
| `skill-testing-framework` | Unit-/integrations-/regressionstest av skills |
| `skill-security-analyzer` | Sårbarhets- och säkerhetsanalys av skills |
| `skill-performance-profiler` | Token-konsumtion och användningsanalys |
| `skill-debugging-assistant` | Felsöker trigger-/parameterproblem |
| `token-budget-advisor` | Chunkar upp komplexa workflows mot token-budget |

---

> **Redan inne (lager 1, projekt-baslinje):** `learning-capture` — Nates original
> förbättrad så den skriver till CLAUDE.md istället för en lös fil. Ligger aktiv i
> `learning-capture/SKILL.md`, behöver inte hämtas.

**Källa:** [Exploration-labs/Nates-Substack-Skills](https://github.com/Exploration-labs/Nates-Substack-Skills)
(Nate Jones Open Skills). Beskrivningarna ovan är destillerade — verifiera mot
respektive `SKILL.md` före användning.
