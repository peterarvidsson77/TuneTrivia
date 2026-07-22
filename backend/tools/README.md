# backend/tools — författarhjälp

Fristående Node-verktyg för att bygga frågebanken. Kräver Node ≥ 20 (global
`fetch`), inga npm-beroenden.

## `itunes-search.mjs`

Slår upp iTunes Search API och skriver ut kandidatspår med **preview-URL** — så
man kan peka ut exakt rätt inspelning till ljudfrågor (`listen_guess`,
`cover_original`).

```bash
node backend/tools/itunes-search.mjs "kirka surun pyyhit" --country fi --limit 5
node backend/tools/itunes-search.mjs "a-ha take on me" --json
```

Flaggor: `--country <kod>` (t.ex. `fi`, `se`), `--limit <n>`, `--json` (ren JSON).

**Arbetsflöde för en cover-fråga:**
1. Sök på den finska covern (`<finsk artist> <finsk covertitel>`).
2. Kontrollera att `previewUrl` faktiskt spelar covern (finns ofta dubbletter).
3. Fyll i `cover_original`-frågan: `cover`/`song`/`answer`/`options`/`fact`.
   `audio.query` sätts till samma söksträng som gav rätt spår.

> Appen gör samma live-uppslag vid speltid (vi lagrar `audio.query`, inte en
> hårdkodad URL — de ruttnar). Verktyget är för att *hitta och verifiera* spåret
> när frågan skapas.
