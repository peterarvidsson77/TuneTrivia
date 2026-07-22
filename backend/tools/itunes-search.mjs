#!/usr/bin/env node
// Författarhjälp (Nivå 1): söker iTunes Search API och skriver ut kandidatspår
// med preview-URL. Byggblock för ljudfrågor (typ `listen_guess` och
// `cover_original`) — så man kan peka ut exakt rätt inspelning.
//
// Kräver Node >= 20 (global fetch). Inga npm-beroenden.
//
// Användning:
//   node itunes-search.mjs "kirka surun pyyhit"            # global sökning
//   node itunes-search.mjs "kirka" --country fi --limit 5  # finsk katalog
//   node itunes-search.mjs "a-ha take on me" --json        # ren JSON ut
//
// Tips för finska covers: sök på "<finsk artist> <finsk covertitel>" och välj
// spåret vars previewUrl faktiskt spelar covern.

const argv = process.argv.slice(2);
const flags = { country: "", limit: 5, json: false };
const terms = [];
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === "--country") flags.country = argv[++i] ?? "";
  else if (a === "--limit") flags.limit = Number(argv[++i] ?? 5);
  else if (a === "--json") flags.json = true;
  else terms.push(a);
}
const term = terms.join(" ").trim();

if (!term) {
  console.error('Ange en sökterm, t.ex.: node itunes-search.mjs "kirka surun pyyhit"');
  process.exit(1);
}

const url = new URL("https://itunes.apple.com/search");
url.searchParams.set("term", term);
url.searchParams.set("entity", "song");
url.searchParams.set("limit", String(flags.limit));
if (flags.country) url.searchParams.set("country", flags.country);

try {
  const res = await fetch(url, { headers: { "User-Agent": "TuneTrivia-authoring" } });
  if (!res.ok) throw new Error(`iTunes svarade ${res.status}`);
  const data = await res.json();
  const rows = (data.results ?? []).map((r) => ({
    trackName: r.trackName,
    artistName: r.artistName,
    year: r.releaseDate ? r.releaseDate.slice(0, 4) : null,
    previewUrl: r.previewUrl ?? null,
    trackId: r.trackId,
    collection: r.collectionName ?? null,
  }));

  if (flags.json) {
    console.log(JSON.stringify(rows, null, 2));
  } else if (rows.length === 0) {
    console.log(`Inga träffar för "${term}".`);
  } else {
    console.log(`Träffar för "${term}"${flags.country ? ` (${flags.country})` : ""}:\n`);
    rows.forEach((r, i) => {
      console.log(`${i + 1}. ${r.artistName} — ${r.trackName} (${r.year ?? "?"})`);
      console.log(`   preview: ${r.previewUrl ? "✓ " + r.previewUrl : "saknas"}`);
      console.log(`   trackId: ${r.trackId}\n`);
    });
  }
} catch (err) {
  console.error("Fel vid iTunes-sökning:", err.message);
  process.exit(2);
}
