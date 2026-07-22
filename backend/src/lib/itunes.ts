// iTunes Search API — resolvar en preview-URL för en söksträng.
// Server-side (förbättring mot originalet som hårdkodade URL:er i klienten).

export interface ITunesTrack {
  trackName?: string;
  artistName?: string;
  previewUrl?: string;
  releaseDate?: string;
}

/** Väljer bästa preview: föredrar angiven artist, annars första med preview. */
export function pickPreview(results: ITunesTrack[], preferArtist?: string): string | null {
  const withPreview = results.filter((r) => typeof r.previewUrl === "string" && r.previewUrl.length > 0);
  if (preferArtist) {
    const needle = preferArtist.toLowerCase();
    const match = withPreview.find((r) => (r.artistName ?? "").toLowerCase().includes(needle));
    if (match?.previewUrl) return match.previewUrl;
  }
  return withPreview[0]?.previewUrl ?? null;
}

export interface ResolveOptions {
  country?: string;
  preferArtist?: string;
  fetchImpl?: typeof fetch;
}

export async function resolvePreview(query: string, opts: ResolveOptions = {}): Promise<string | null> {
  const doFetch = opts.fetchImpl ?? fetch;
  const url = new URL("https://itunes.apple.com/search");
  url.searchParams.set("term", query);
  url.searchParams.set("entity", "song");
  url.searchParams.set("limit", "5");
  if (opts.country) url.searchParams.set("country", opts.country);

  const res = await doFetch(url);
  if (!res.ok) throw new Error(`iTunes svarade ${res.status}`);
  const data = (await res.json()) as { results?: ITunesTrack[] };
  return pickPreview(data.results ?? [], opts.preferArtist);
}
