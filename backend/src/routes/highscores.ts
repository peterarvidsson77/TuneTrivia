import type { FastifyInstance } from "fastify";
import { and, asc, count, desc, eq, gt, lt, or } from "drizzle-orm";
import { db } from "../db/client";
import { highScores } from "../db/schema";
import { highscoreInput } from "../validation";
import { config } from "../config";
import { fail, ok } from "../lib/envelope";

export async function highscoreRoutes(app: FastifyInstance): Promise<void> {
  // Spara ett lags resultat.
  app.post("/api/highscores", async (req, reply) => {
    const parsed = highscoreInput.safeParse(req.body);
    if (!parsed.success) {
      return reply.code(400).send(fail(parsed.error.issues[0]?.message ?? "Ogiltig indata"));
    }
    const { team_name, players, score } = parsed.data;
    const total = config.questionCount;
    if (score > total) {
      return reply.code(400).send(fail(`score får inte överstiga ${total}`));
    }

    const inserted = await db
      .insert(highScores)
      .values({ teamName: team_name, players, score, total })
      .returning();
    const row = inserted[0];
    if (!row) return reply.code(500).send(fail("Kunde inte spara resultatet"));

    // Placering: antal lag före detta (högre poäng, eller lika poäng men tidigare).
    const ranking = await db
      .select({ better: count() })
      .from(highScores)
      .where(
        or(
          gt(highScores.score, row.score),
          and(eq(highScores.score, row.score), lt(highScores.createdAt, row.createdAt)),
        ),
      );
    const rank = Number(ranking[0]?.better ?? 0) + 1;

    return reply.code(201).send(
      ok({
        id: row.id,
        team_name: row.teamName,
        players: row.players,
        score: row.score,
        total: row.total,
        created_at: row.createdAt,
        rank,
      }),
    );
  });

  // Topplistan.
  app.get("/api/highscores", async (req, reply) => {
    const raw = Number((req.query as { limit?: unknown })?.limit ?? 100);
    const limit = Math.min(Math.max(Number.isFinite(raw) ? raw : 100, 1), 500);

    const rows = await db
      .select()
      .from(highScores)
      .orderBy(desc(highScores.score), asc(highScores.createdAt))
      .limit(limit);

    const data = rows.map((r, idx) => ({
      rank: idx + 1,
      team_name: r.teamName,
      players: r.players,
      score: r.score,
      total: r.total,
      created_at: r.createdAt,
    }));
    return reply.send(ok(data));
  });
}
