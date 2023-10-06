import cookies from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";

import { handleError } from "~/shared/middlewares/handle-error.middleware";
import { notFound } from "~/shared/middlewares/not-found.middleware";
import { logger } from "~/shared/utils/logger";

import apiRoutes from "./api.routes";

const app = express();

// Access Control List (Allowed Origins)
const ACL: string[] = [
  // "http://localhost:4200", // angular dev server
];

app.use(
  cors({
    origin: ACL,
    credentials: true,
  }),
);

// Security Headers
app.use(helmet());

// Body Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Cookie Parsing
app.use(cookies());

// Logger
app.use(logger());

app.use("/api", apiRoutes);

app.use(notFound);
app.use(handleError);

export default app;
