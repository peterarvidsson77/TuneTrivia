import { z } from "zod";

// Validering av inkommande highscore. `total` skickas INTE av klienten —
// backend sätter den från config (QUESTION_COUNT).
export const highscoreInput = z.object({
  team_name: z.string().trim().min(1, "Lagnamn krävs").max(40, "Lagnamn får vara högst 40 tecken"),
  players: z
    .array(z.string().trim().min(1, "Tomt spelarnamn").max(30, "Spelarnamn får vara högst 30 tecken"))
    .min(2, "Ett lag måste ha minst 2 spelare")
    .max(4, "Ett lag får ha högst 4 spelare"),
  score: z.number({ invalid_type_error: "score måste vara ett tal" }).int("score måste vara ett heltal").min(0, "score kan inte vara negativt"),
});

export type HighscoreInput = z.infer<typeof highscoreInput>;
