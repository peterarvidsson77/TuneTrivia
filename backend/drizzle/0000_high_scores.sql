CREATE TABLE "high_scores" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"team_name" text NOT NULL,
	"players" jsonb NOT NULL,
	"score" integer NOT NULL,
	"total" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "score_range" CHECK ("high_scores"."score" >= 0 AND "high_scores"."score" <= "high_scores"."total"),
	CONSTRAINT "total_positive" CHECK ("high_scores"."total" > 0),
	CONSTRAINT "team_name_len" CHECK (char_length(btrim("high_scores"."team_name")) between 1 and 40),
	CONSTRAINT "players_shape" CHECK (jsonb_typeof("high_scores"."players") = 'array' and jsonb_array_length("high_scores"."players") between 2 and 4)
);
--> statement-breakpoint
CREATE INDEX "high_scores_leaderboard_idx" ON "high_scores" USING btree ("score","created_at");