import type { FastifyInstance } from "fastify";
import { loadBank } from "../lib/questions";
import { fail, ok } from "../lib/envelope";

export async function questionRoutes(app: FastifyInstance): Promise<void> {
  // Hela frågebanken (normaliserad). Läses en gång och cachas.
  app.get("/api/questions", async (_req, reply) => {
    try {
      const bank = await loadBank();
      return reply.send(ok(bank));
    } catch (err) {
      app.log.error(err);
      return reply.code(500).send(fail("Kunde inte läsa frågebanken"));
    }
  });
}
