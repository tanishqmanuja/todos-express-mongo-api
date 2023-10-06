import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { v4 as uuidv4 } from "uuid";

import env from "~/env";
import redis from "~/shared/db/redis";
import { compare } from "~/shared/lib/scrypt";
import { User } from "~/users/users.model";

import type { UserAuthSchema } from "./sessions.schema";
import { signToken, verifyToken } from "./utils/jwt";

class SessionsController {
  async create(
    req: Request<{}, {}, UserAuthSchema>,
    res: Response,
    next: NextFunction,
  ) {
    const { email, password } = req.body;
    const foundUser = await User.findOne({ email });

    if (!foundUser) {
      return next(createHttpError.NotFound());
    }

    const isPasswordValid = await compare(password, foundUser.password);

    if (!isPasswordValid) {
      return next(createHttpError.Unauthorized());
    }

    const sessionId = uuidv4();

    const accessToken = signToken("access", {
      userId: foundUser.id,
      sessionId,
    });
    const refreshToken = signToken("access", {
      userId: foundUser.id,
      sessionId,
    });

    await redis.client.set(`${foundUser.id}:${sessionId}`, refreshToken, {
      EX: env.REFRESH_TOKEN_TTL,
    });

    return res
      .cookie("X-JWT-REFRESH", refreshToken, {
        secure: true,
        httpOnly: true,
        maxAge: env.REFRESH_TOKEN_TTL,
      })
      .send({ accessToken });
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const refreshToken: string | undefined = req.cookies["X-JWT-REFRESH"];

    if (!refreshToken) {
      return next(createHttpError.BadRequest());
    }

    const decoded = verifyToken("refresh", refreshToken);
    const userId = decoded.sub;
    const sessionId = decoded.jti;

    const issuedRefreshToken = await redis.client.get(`${userId}:${sessionId}`);

    if (issuedRefreshToken !== refreshToken) {
      await redis.client.del(`${userId}:${sessionId}`);
      res.clearCookie("X-JWT-REFRESH");
      return next(createHttpError.Unauthorized());
    }

    const newAccessToken = signToken("access", { userId, sessionId });
    const newRefreshToken = signToken("refresh", { userId, sessionId });

    await redis.client.set(`${userId}:${sessionId}`, newRefreshToken, {
      EX: env.REFRESH_TOKEN_TTL,
    });

    return res
      .cookie("X-JWT-REFRESH", newRefreshToken, {
        secure: true,
        httpOnly: true,
        maxAge: env.REFRESH_TOKEN_TTL,
      })
      .send({ accessToken: newAccessToken });
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const refreshToken: string | undefined = req.cookies["X-JWT-REFRESH"];

    if (!refreshToken) {
      return next(createHttpError.BadRequest());
    }

    const decoded = verifyToken("refresh", refreshToken);
    const userId = decoded.sub;
    const sessionId = decoded.jti;

    await redis.client.del(`${userId}:${sessionId}`);

    res.clearCookie("X-JWT-REFRESH").sendStatus(204);
  }
}

export default new SessionsController();
