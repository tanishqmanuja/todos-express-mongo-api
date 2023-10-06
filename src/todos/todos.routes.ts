import { Router } from "express";

import { verifySession } from "~/sessions/sessions.middleware";
import { validateInput } from "~/shared/middlewares/validate-input";
import { asyncHandler } from "~/shared/utils/lib/express/handler";

import todos from "./todos.controller";
import { findTodoById } from "./todos.middleware";
import { TodoDTOSchema } from "./todos.schema";

export const router = Router();

const routesWithoutId = Router()
  .get("/", asyncHandler(todos.getAll))
  .post(
    "/",
    validateInput({
      body: TodoDTOSchema.omit({ id: true }),
    }),
    asyncHandler(todos.add),
  );

const routesWithId = Router()
  .get("/", asyncHandler(todos.get))
  .put(
    "/",
    validateInput({
      body: TodoDTOSchema.partial(),
    }),
    asyncHandler(todos.update),
  )
  .delete("/", asyncHandler(todos.delete));

router.use(verifySession);
router.use("/", routesWithoutId);
router.use("/:id", findTodoById, routesWithId);

export default router;
