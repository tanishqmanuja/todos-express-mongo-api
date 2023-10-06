import type { NextFunction, Request, Response } from "express";

export function asyncHandler(responseHandler: Function) {
  return async function theHandler(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      await responseHandler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}
