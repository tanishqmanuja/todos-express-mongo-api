import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";

export function notFound(_req: Request, _res: Response, next: NextFunction) {
  next(createHttpError.NotFound());
}
