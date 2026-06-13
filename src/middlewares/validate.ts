import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";

export type RequestSchema = {
  body?: ZodType;
  params?: ZodType;
  query?: ZodType;
};

export const validate =
  (schema: RequestSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const targets = ["body", "params", "query"] as const;

    for (const target of targets) {
      const validator = schema[target];
      if (!validator) continue;

      const result = validator.safeParse(req[target]);
      if (!result.success) {
        return res.status(400).json({
          message: "Validation failed",
          errors: result.error.issues.map((issue) => ({
            field: [target, ...issue.path].join("."),
            message: issue.message,
          })),
        });
      }

      (req as any)[target] = result.data;
    }

    next();
  };
