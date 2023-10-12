import "dotenv/config";
import ms from "ms";
import { z } from "zod";

const nodeEnvSchema = z
  .enum(["development", "production"])
  .default("development");

export const isProduction =
  nodeEnvSchema.parse(process.env.NODE_ENV) === "production";

const mongoSchema = z.object({
  MONGO_DB_URI: z.string().url(),
  MONGO_DB_USER: z.string().optional(),
  MONGO_DB_PASSWORD: z.string().optional(),
  MONGO_DB_NAME: z.string().optional(),
});

const redisSchema = z.object({
  REDIS_URI: z.string().url(),
  REDIS_PASSWORD: z.string().optional(),
});

const jwtSchema = z.object({
  ACCESS_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
  ACCESS_TOKEN_TTL: z
    .string()
    .transform(v => ms(v))
    .pipe(z.number()),
  REFRESH_TOKEN_TTL: z
    .string()
    .transform(v => ms(v))
    .pipe(z.number()),
  JWT_ISSUER: z.string().optional(),
});

const envSchema = z
  .object({
    HOST: z.string().default("localhost"),
    PORT: z.coerce.number().min(1).max(65535).default(8080),
  })
  .merge(mongoSchema)
  .merge(redisSchema)
  .merge(jwtSchema);

export default envSchema.parse(process.env);
