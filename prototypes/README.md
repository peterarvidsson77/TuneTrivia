# prototypes/

Kastbara koncept-demos för att validera känsla/flöde innan riktig frontend byggs.
**Inte produktionskod** — den riktiga appen (React) portas separat.

## `quiz-player.html` — testa en hel omgång

Testsida för **hela banken**: välj tema (eller "Alla teman") och antal frågor
(5/10/15/20), spela en slumpad omgång. Hanterar alla frågetyper — textfrågor
(årtal, vem gjorde låten, saknat ord …) visas direkt; ljudfrågor (`listen_guess`,
`cover_original`) får en spela-knapp med iTunes-preview. Öppna filen direkt eller
servera mappen.

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
python prototypes/build.py      # genererar BÅDA: quiz-player.html + finskcover-player.html
```

Skalen med platshållaren `__DATA__`: `quiz-template.html` (hela banken) och
`template.html` (bara finskcover). `build.py` bäddar in frågedatan. Redigera
mallarna för UI-ändringar, aldrig de genererade filerna.
