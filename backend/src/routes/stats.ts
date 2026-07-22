import type { FastifyInstance } from "fastify";
import { sql } from "drizzle-orm";
import { db } from "../db/client";
import { ok } from "../lib/envelope";

interface StatsRow {
  total_teams: number;
  best_score: number;
  average_score: number;
  average_percent: number;
}

export async function statsRoutes(app: FastifyInstance): Promise<void> {
  // Statistik härleds ur high_scores (ingen egen tabell — single source of truth).
  app.get("/api/stats", async (_req, reply) => {
    const rows = (await db.execute(sql`
      select
        count(*)::int as total_teams,
        coalesce(max(score), 0)::int as best_score,
        coalesce(round(avg(score)::numeric, 1), 0)::float8 as average_score,
        coalesce(round(avg(score::numeric / nullif(total, 0)) * 100, 1), 0)::float8 as average_percent
      from high_scores
    `)) as unknown as StatsRow[];

    const r = rows[0] ?? { total_teams: 0, best_score: 0, average_score: 0, average_percent: 0 };
    return reply.send(
      ok({
        total_teams: Number(r.total_teams),
        best_score: Number(r.best_score),
        average_score: Number(r.average_score),
        average_percent: Number(r.average_percent),
      }),
    );
  });
}
