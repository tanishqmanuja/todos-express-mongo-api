import jwt from "jsonwebtoken";

import env from "~/env";

import type { UserSession } from "../sessions.schema";

const ISSUER = "api.todos";

type TokenType = "access" | "refresh";

function getTokenSecret(type: TokenType) {
  return type === "access" ? env.ACCESS_TOKEN_SECRET : env.REFRESH_TOKEN_SECRET;
}
function getTokenTTL(type: TokenType) {
  return type === "access" ? env.ACCESS_TOKEN_TTL : env.REFRESH_TOKEN_TTL;
}

export function signToken(type: TokenType, { userId, sessionId }: UserSession) {
  return jwt.sign({}, getTokenSecret(type), {
    subject: userId,
    jwtid: sessionId,
    issuer: ISSUER,
    expiresIn: String(getTokenTTL(type)),
  });
}

export function verifyToken(type: TokenType, token: string) {
  const decoded = jwt.verify(token, getTokenSecret(type), {
    issuer: ISSUER,
  });

  if (!decoded || typeof decoded !== "object") {
    throw new Error(`Invalid ${type} token`);
  }

  return decoded as { sub: string; jti: string };
}
