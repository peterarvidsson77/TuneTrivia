import { buildApp } from "./app";
import { config } from "./config";

const app = buildApp();

app
  .listen({ port: config.port, host: "0.0.0.0" })
  .then((addr) => app.log.info(`TuneTrivia API lyssnar på ${addr}`))
  .catch((err) => {
    app.log.error(err);
    process.exit(1);
  });
