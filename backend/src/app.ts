import Fastify, { type FastifyInstance } from "fastify";
import fastifyStatic from "@fastify/static";
import { existsSync } from "node:fs";
import { highscoreRoutes } from "./routes/highscores";
import { statsRoutes } from "./routes/stats";
import { previewRoutes } from "./routes/preview";
import { questionRoutes } from "./routes/questions";
import { config } from "./config";
import { fail, ok } from "./lib/envelope";

export function buildApp(): FastifyInstance {
  const app = Fastify({ logger: true });

  app.get("/health", async () => ok({ status: "ok" }));

  app.register(highscoreRoutes);
  app.register(statsRoutes);
  app.register(previewRoutes);
  app.register(questionRoutes);

  // Serverar spelsidan (samma origin som API:t → ingen CORS behövs).
  if (existsSync(config.publicDir)) {
    app.register(fastifyStatic, { root: config.publicDir });
  } else {
    app.log.warn(`PUBLIC_DIR saknas (${config.publicDir}) — ingen statisk spelsida serveras.`);
  }

  app.setNotFoundHandler((_req, reply) => reply.code(404).send(fail("Hittades inte")));
  app.setErrorHandler((err, _req, reply) => {
    app.log.error(err);
    reply.code(500).send(fail("Internt serverfel"));
  });

  return app;
}
