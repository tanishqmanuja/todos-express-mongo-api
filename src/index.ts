import chalk from "chalk";
import ora from "ora";

import app from "./app";
import env, { isProduction } from "./env";
import mongo from "./shared/db/mongo";
import redis from "./shared/db/redis";

try {
  /* DB */
  await mongo.connect();
  await redis.connect();

  /* Server */
  app.listen(env.PORT, env.HOST, () => {
    ora().info(
      `${chalk.gray("[Server]")} Started at ${chalk.bold(
        `http://${env.HOST}:${env.PORT}`,
      )}`,
    );
  });
} catch (e) {
  ora().fail(`${chalk.gray("[Server]")} Failed to start}`);

  if (!isProduction) {
    console.error(e);
  }

  process.exit(1);
}

/* Handle Uncaught Exceptions */
process.on("uncaughtException", () => {
  ora().fail(`${chalk.gray("[Server]")} Uncaught Exception`);
  process.exit(1);
});

/* Graceful Shutdown on Ctrl+C */
process.on("SIGINT", () => {
  ora().info(`${chalk.gray("[Server]")} Stopped`);
  mongo.client.connection.close();
  redis.client.disconnect();
  process.exit(0);
});
