import "dotenv/config";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import multer from "multer";
import routes from "./routes";
import { AppError } from "./utils/app-error";

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/api", routes);

app.use((_req, _res, next) => {
  next(new AppError(404, "Route not found"));
});

app.use(
  (error: unknown, _req: Request, res: Response, _next: NextFunction) => {
    const status =
      error instanceof AppError
        ? error.status
        : error instanceof multer.MulterError
          ? 400
          : 500;
    const message =
      error instanceof Error ? error.message : "Internal server error";

    if (status >= 500) {
      console.error(error);
    }

    res.status(status).json({ message });
  },
);

export default app;
