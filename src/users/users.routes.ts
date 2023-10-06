import { Router } from "express";

import { verifySession } from "~/sessions/sessions.middleware";
import { validateInput } from "~/shared/middlewares/validate-input";
import { asyncHandler } from "~/shared/utils/lib/express/handler";

import users from "./users.controller";
import { UserInsertDTOSchema } from "./users.schema";

export const router = Router();

router.get("/", verifySession, asyncHandler(users.get));
router.post(
  "/",
  validateInput({
    body: UserInsertDTOSchema,
  }),
  asyncHandler(users.add),
);

export default router;
