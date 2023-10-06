import type { NextFunction, Request, Response } from "express";
import { HttpError } from "http-errors";
import status from "http-status";
import { match } from "ts-pattern";
import { ZodError } from "zod";

import { isProduction } from "~/env";

type HandledError = {
  status: number;
} & Record<string, any>;

function handleHttpError(err: HttpError): HandledError {
  return {
    status: err.status,
    message: err.message,
  };
}

function handleZodError(err: ZodError): HandledError {
  return {
    status: status.BAD_REQUEST,
    issues: err.issues,
  };
}

export async function handleError(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  const error = match(err)
    .when(err => err instanceof HttpError, handleHttpError)
    .when(err => err instanceof ZodError, handleZodError)
    .otherwise(err => ({
      status: status.INTERNAL_SERVER_ERROR,
      message: isProduction ? "INTERNAL ERROR" : err.message,
    }));

  return res.status(error.status).send(error);
}
