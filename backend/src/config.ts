import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.string().default("development"),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().min(1, "DATABASE_URL krävs"),
  QUESTION_COUNT: z.coerce.number().int().positive().default(50),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error("Ogiltig miljökonfiguration:", parsed.error.flatten().fieldErrors);
  throw new Error("Miljövariabler saknas eller är ogiltiga — se backend/.env.example");
}

export const config = {
  nodeEnv: parsed.data.NODE_ENV,
  port: parsed.data.PORT,
  databaseUrl: parsed.data.DATABASE_URL,
  questionCount: parsed.data.QUESTION_COUNT,
} as const;
