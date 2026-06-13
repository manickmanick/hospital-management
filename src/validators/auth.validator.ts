import { z } from "zod";

const roleSchema = z.enum(["ADMIN", "DOCTOR", "LAB"]);

export const loginRequestSchema = {
  body: z.object({
    email: z.email(),
    password: z.string().min(8).max(72),
  }),
};

export const createUserRequestSchema = {
  body: z
    .object({
      name: z.string().trim().min(2).max(100),
      email: z.email(),
      password: z.string().min(8).max(72),
      role: roleSchema,
      doctorId: z.number().int().positive().nullable().optional(),
    })
    .superRefine((value, context) => {
      if (value.role === "DOCTOR" && !value.doctorId) {
        context.addIssue({
          code: "custom",
          path: ["doctorId"],
          message: "doctorId is required for a doctor account",
        });
      }
      if (value.role !== "DOCTOR" && value.doctorId) {
        context.addIssue({
          code: "custom",
          path: ["doctorId"],
          message: "doctorId is only allowed for doctor accounts",
        });
      }
    }),
};
