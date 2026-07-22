import type { FastifyInstance } from "fastify";
import { resolvePreview } from "../lib/itunes";
import { fail, ok } from "../lib/envelope";

// Enkel in-memory-cache (URL:er är stabila under en session; iTunes-anrop är dyra).
const cache = new Map<string, { url: string | null; at: number }>();
const TTL_MS = 1000 * 60 * 60; // 1 timme

export async function previewRoutes(app: FastifyInstance): Promise<void> {
  // Resolvar en iTunes-preview för en söksträng (audio.query i frågebanken).
  app.get("/api/preview", async (req, reply) => {
    const query = req.query as { q?: unknown; country?: unknown; artist?: unknown };
    const q = typeof query.q === "string" ? query.q.trim() : "";
    const country = typeof query.country === "string" ? query.country : undefined;
    const artist = typeof query.artist === "string" ? query.artist : undefined;
    if (!q) return reply.code(400).send(fail("Parametern q krävs"));

    const key = `${country ?? ""}|${artist ?? ""}|${q}`;
    const cached = cache.get(key);
    if (cached && Date.now() - cached.at < TTL_MS) {
      return reply.send(ok({ query: q, previewUrl: cached.url }));
    }

    try {
      const url = await resolvePreview(q, { country, preferArtist: artist });
      cache.set(key, { url, at: Date.now() });
      return reply.send(ok({ query: q, previewUrl: url }));
    } catch {
      return reply.code(502).send(fail("Kunde inte nå iTunes"));
    }
  });
}
