import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import status from "http-status";
import { mongo } from "mongoose";

import type { UserSession } from "~/sessions/sessions.schema";
import { computeResult } from "~/shared/lib/result";

import { User } from "./users.model";
import { UserDTOSchema, type UserInsertSchema } from "./users.schema";

class UsersController {
  async add(
    req: Request<{}, {}, UserInsertSchema>,
    res: Response,
    next: NextFunction,
  ) {
    const { name, email, password } = req.body;

    const createdUser = await computeResult(() =>
      User.create({ name, email, password }).then(user =>
        UserDTOSchema.parse(user),
      ),
    );

    if (!createdUser.ok) {
      if (
        createdUser.error instanceof mongo.MongoServerError &&
        createdUser.error.code === 11000
      ) {
        return next(createHttpError.Conflict("User already exists"));
      }

      return next(createHttpError.BadRequest(createdUser.error.message));
    }

    return res.status(status.CREATED).send(createdUser.value);
  }

  async get(
    _req: Request,
    res: Response<{}, { session: UserSession }>,
    next: NextFunction,
  ) {
    const foundUser = await User.findById(res.locals.session.userId);

    if (!foundUser) {
      return next(createHttpError.NotFound());
    }

    const user = UserDTOSchema.parse(foundUser);
    return res.send(user);
  }
}

export default new UsersController();
