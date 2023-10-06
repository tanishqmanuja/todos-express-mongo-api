import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import status from "http-status";

import type { UserSession } from "~/sessions/sessions.schema";
import { computeResult } from "~/shared/lib/result";

import { Todo } from "./todos.model";
import { TodoDTOSchema, type TodoInsertSchema } from "./todos.schema";

class TodosController {
  async getAll(
    _req: Request,
    res: Response<{}, { session: UserSession }>,
    next: NextFunction,
  ) {
    const foundTodos = await computeResult(() =>
      Todo.find({ userId: res.locals.session.userId }).then(it =>
        it.map(todo => TodoDTOSchema.parse(todo)),
      ),
    );

    if (!foundTodos.ok) {
      return next(createHttpError.BadRequest(foundTodos.error.message));
    }

    return res.send(foundTodos.value);
  }

  async get(
    _req: Request,
    res: Response<{}, { todo: InstanceType<typeof Todo> }>,
  ) {
    const todo = TodoDTOSchema.parse(res.locals.todo);
    return res.send(todo);
  }

  async add(
    req: Request<{}, {}, TodoInsertSchema>,
    res: Response<{}, { session: UserSession }>,
    next: NextFunction,
  ) {
    const createdTodo = await computeResult(() =>
      Todo.create({ ...req.body, userId: res.locals.session.userId }).then(v =>
        TodoDTOSchema.parse(v),
      ),
    );

    if (!createdTodo.ok) {
      return next(createHttpError.BadRequest(createdTodo.error.message));
    }

    return res.status(status.CREATED).send(createdTodo.value);
  }

  async update(
    req: Request<{}, {}, Partial<TodoInsertSchema>>,
    res: Response<{}, { todo: InstanceType<typeof Todo> }>,
    next: NextFunction,
  ) {
    const updatedTodo = await computeResult(() =>
      res.locals.todo
        .set(req.body)
        .save()
        .then(v => TodoDTOSchema.parse(v)),
    );

    if (!updatedTodo.ok) {
      return next(createHttpError.BadRequest(updatedTodo.error.message));
    }

    res.send(updatedTodo.value);
  }

  async delete(
    _req: Request,
    res: Response<{}, { todo: InstanceType<typeof Todo> }>,
    next: NextFunction,
  ) {
    const deletedTodo = await computeResult(() =>
      res.locals.todo.deleteOne().then(v => TodoDTOSchema.parse(v)),
    );

    if (!deletedTodo.ok) {
      return next(createHttpError.BadRequest(deletedTodo.error.message));
    }

    res.send(deletedTodo.value);
  }
}

export default new TodosController();
