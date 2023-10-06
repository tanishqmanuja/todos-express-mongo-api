import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";

import { Todo } from "./todos.model";

/**
 * @description Sets res.locals.todo
 */
export async function findTodoById(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) {
  const { id } = req.params;

  const foundTodo = await Todo.findById(id);
  if (!foundTodo) {
    return next(createHttpError.NotFound());
  }

  res.locals.todo = foundTodo;

  next();
}
