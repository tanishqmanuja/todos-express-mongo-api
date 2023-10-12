import chalk from "chalk";
import { connect } from "mongoose";
import { oraPromise } from "ora";
import { createClient } from "redis";

import env from "~/env";

export async function connectToMongoDB() {
  const promise = connect(env.MONGO_DB_URI, {
    user: env.MONGO_DB_USER,
    pass: env.MONGO_DB_PASSWORD,
    dbName: env.MONGO_DB_NAME,
  });

  return oraPromise(promise, {
    text: "Connecting to MongoDB database",
    successText: db =>
      `${chalk.gray("[Mongo]")} Connected to ${chalk.green.bold(
        db.connection.name,
      )} on ${chalk.bold(db.connection.host)}`,
    failText: `${chalk.gray("[Mongo]")} Failed to connect`,
  });
}

export async function connectToRedis() {
  const client = createClient({
    url: env.REDIS_URI,
    password: env.REDIS_PASSWORD,
  });

  const promise = client.connect().then(() => client);

  return oraPromise(promise, {
    text: "Connecting to Redis",
    successText: () =>
      `${chalk.gray("[Redis]")} Connected to ${chalk.green.bold(
        "redis",
      )} on ${chalk.bold(new URL(env.REDIS_URI).hostname)}`,
    failText: `${chalk.gray("[Redis]")} Failed to connect`,
  });
}
