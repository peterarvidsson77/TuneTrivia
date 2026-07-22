-- 001_high_scores.sql — TuneTrivia
-- Leaderboard-tabell. Ersätter Base44-entiteten `HighScore`.
-- Kör mot PostgreSQL. Idempotent (IF NOT EXISTS) så den går att köra om säkert.

CREATE TABLE IF NOT EXISTS high_scores (
    id          BIGSERIAL   PRIMARY KEY,
    team_name   TEXT        NOT NULL,
    players     JSONB       NOT NULL,   -- array av spelarnamn, 2–4 st
    score       INTEGER     NOT NULL,   -- antal rätt
    total       INTEGER     NOT NULL,   -- max möjliga (sätts server-side från config)
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT team_name_len  CHECK (char_length(btrim(team_name)) BETWEEN 1 AND 40),
    CONSTRAINT players_shape  CHECK (jsonb_typeof(players) = 'array'
                                     AND jsonb_array_length(players) BETWEEN 2 AND 4),
    CONSTRAINT score_range    CHECK (score >= 0 AND score <= total),
    CONSTRAINT total_positive CHECK (total > 0)
);

-- Topplista: högst poäng först, tidigast inskickad bryter lika.
CREATE INDEX IF NOT EXISTS high_scores_leaderboard_idx
    ON high_scores (score DESC, created_at ASC);
