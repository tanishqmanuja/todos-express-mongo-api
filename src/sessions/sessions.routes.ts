import { Router } from "express";

import { validateInput } from "~/shared/middlewares/validate-input";
import { asyncHandler } from "~/shared/utils/lib/express/handler";

import sessions from "./sessions.controller";
import { UserAuthDTOSchema } from "./sessions.schema";

export const router = Router();

router.post(
  "/",
  validateInput({
    body: UserAuthDTOSchema,
  }),
  asyncHandler(sessions.create),
);
router.put("/", asyncHandler(sessions.update));
router.delete("/", asyncHandler(sessions.delete));

export default router;
