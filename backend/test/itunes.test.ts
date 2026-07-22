import { describe, it, expect } from "vitest";
import { pickPreview, resolvePreview, type ITunesTrack } from "../src/lib/itunes";

const tracks: ITunesTrack[] = [
  { trackName: "A", artistName: "Other", previewUrl: undefined },
  { trackName: "B", artistName: "Eläkeläiset", previewUrl: "http://x/2" },
  { trackName: "C", artistName: "Third", previewUrl: "http://x/3" },
];

describe("pickPreview", () => {
  it("föredrar angiven artist", () => {
    expect(pickPreview(tracks, "eläkeläiset")).toBe("http://x/2");
  });

  it("faller tillbaka på första med preview", () => {
    expect(pickPreview(tracks)).toBe("http://x/2");
  });

  it("returnerar null när ingen preview finns", () => {
    expect(pickPreview([{ trackName: "A", artistName: "X" }])).toBeNull();
  });
});

describe("resolvePreview", () => {
  it("bygger rätt fråga och plockar preview via injicerad fetch", async () => {
    let calledUrl = "";
    const fakeFetch = (async (input: string | URL) => {
      calledUrl = input.toString();
      return {
        ok: true,
        json: async () => ({ results: tracks }),
      } as Response;
    }) as typeof fetch;

    const url = await resolvePreview("eläkeläiset humppa", { country: "fi", fetchImpl: fakeFetch });
    expect(url).toBe("http://x/2");
    expect(calledUrl).toContain("itunes.apple.com/search");
    expect(calledUrl).toContain("country=fi");
  });

  it("kastar vid icke-ok svar", async () => {
    const fakeFetch = (async () => ({ ok: false, status: 500 }) as Response) as typeof fetch;
    await expect(resolvePreview("x", { fetchImpl: fakeFetch })).rejects.toThrow();
  });
});
