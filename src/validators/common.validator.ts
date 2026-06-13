import { z } from "zod";

export const idParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const emptyQuerySchema = z.object({}).strict();
export const emptyBodySchema = z.object({}).strict();
