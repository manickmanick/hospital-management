import { z } from "zod";

export const createPatientSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters"),

  age: z
    .number()
    .int()
    .positive("Age must be positive"),

  phone: z
    .string()
    .min(10)
    .max(15)
});

export type CreatePatientDto =
  z.infer<typeof createPatientSchema>;