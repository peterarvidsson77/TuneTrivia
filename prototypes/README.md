# prototypes/

Kastbara koncept-demos för att validera känsla/flöde innan riktig frontend byggs.
**Inte produktionskod** — den riktiga appen (React) portas separat.

## `finskcover-player.html`

Spelbar demo av `cover_original`-flödet för temat Finska humppacovers: spela en
humppacover i 5 sekunder, gissa originalet, se facit + fakta. Slumpar 10 frågor
per omgång ur banken.

- **Kör den:** öppna filen direkt i en webbläsare (data är inbäddad), eller
  servera mappen: `python -m http.server` och gå till
  `/prototypes/finskcover-player.html`.
- **Ljud:** slår upp iTunes-preview **live** via JSONP på `audio.query` (samma
  mekanism som riktiga appen ska använda) och spelar max 5 sek.
- **Kräver internet** (iTunes-uppslaget).

## Regenerera

HTML:en genereras från frågebanken så den inte driver isär:

```bash
python prototypes/build.py      # läser data/questions/finskcover.json → finskcover-player.html
```

`template.html` är skalet med platshållaren `__DATA__`; `build.py` bäddar in
frågedatan. Redigera `template.html` för UI-ändringar, aldrig den genererade filen.
