import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";

import type { UserSession } from "./sessions.schema";
import { verifyToken } from "./utils/jwt";

/**
 * @description  Verifies Access Token, Sets res.locals.session
 */
export function verifySession(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return next(createHttpError.BadRequest());
  }

  const [authType, accessToken] = authHeader.split(" ");
  if (!authType || !accessToken) {
    return next(createHttpError.Unauthorized());
  }
  if (authType !== "Bearer") {
    return next(createHttpError.BadRequest("Unsupported authorization type"));
  }

  try {
    const decoded = verifyToken("access", accessToken);
    res.locals.session = {
      sessionId: decoded.jti,
      userId: decoded.sub,
    } satisfies UserSession;
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return next(createHttpError.Unauthorized("JWT expired"));
    }
    return next(createHttpError.Unauthorized());
  }

  return next();
}
