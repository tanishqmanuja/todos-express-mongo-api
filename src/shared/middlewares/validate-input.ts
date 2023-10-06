import type { NextFunction, Request, Response } from "express";
import { type ZodSchema, z } from "zod";

type InputSchema = {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
};

export function validateInput(schema: InputSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      z.object({
        body: schema.body ?? z.any(),
        query: schema.query ?? z.any(),
        params: schema.params ?? z.any(),
      }).parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (e) {
      next(e);
    }
  };
}
