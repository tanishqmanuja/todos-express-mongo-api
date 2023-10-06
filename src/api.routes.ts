import { Router } from "express";

import sessionsRoutes from "./sessions/sessions.routes";
import todosRoutes from "./todos/todos.routes";
import usersRoutes from "./users/users.routes";

const router = Router();

router.use("/users", usersRoutes);
router.use("/sessions", sessionsRoutes);
router.use("/todos", todosRoutes);

export default router;
