import Fastify, { type FastifyInstance } from "fastify";
import { highscoreRoutes } from "./routes/highscores";
import { statsRoutes } from "./routes/stats";
import { previewRoutes } from "./routes/preview";
import { fail, ok } from "./lib/envelope";

export function buildApp(): FastifyInstance {
  const app = Fastify({ logger: true });

  app.get("/health", async () => ok({ status: "ok" }));

  app.register(highscoreRoutes);
  app.register(statsRoutes);
  app.register(previewRoutes);

  app.setNotFoundHandler((_req, reply) => reply.code(404).send(fail("Hittades inte")));
  app.setErrorHandler((err, _req, reply) => {
    app.log.error(err);
    reply.code(500).send(fail("Internt serverfel"));
  });

  return app;
}
