import { sql } from "drizzle-orm";
import { bigserial, check, index, integer, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";

// Leaderboard-tabell. Ersätter Base44-entiteten HighScore.
export const highScores = pgTable(
  "high_scores",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    teamName: text("team_name").notNull(),
    players: jsonb("players").$type<string[]>().notNull(),
    score: integer("score").notNull(),
    total: integer("total").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    // Topplistans sorteringsordning: högst poäng först, tidigast inskickad bryter lika.
    index("high_scores_leaderboard_idx").on(t.score, t.createdAt),
    check("score_range", sql`${t.score} >= 0 AND ${t.score} <= ${t.total}`),
    check("total_positive", sql`${t.total} > 0`),
    check("team_name_len", sql`char_length(btrim(${t.teamName})) between 1 and 40`),
    check(
      "players_shape",
      sql`jsonb_typeof(${t.players}) = 'array' and jsonb_array_length(${t.players}) between 2 and 4`,
    ),
  ],
);

export type HighScoreRow = typeof highScores.$inferSelect;
export type NewHighScore = typeof highScores.$inferInsert;
