import { z } from "zod";
import { idParamsSchema } from "./common.validator";

const patientBodySchema = z.object({
  name: z.string().trim().min(3).max(100),
  dateOfBirth: z.iso.date().nullable().optional(),
  age: z.coerce.number().int().min(0).max(130).optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).nullable().optional(),
  phone: z.string().trim().min(10).max(20),
  email: z.email().nullable().optional(),
  address: z.string().trim().max(500).nullable().optional(),
  bloodGroup: z.string().trim().max(10).nullable().optional(),
  allergies: z.string().trim().max(1000).nullable().optional(),
  emergencyContact: z.string().trim().max(20).nullable().optional(),
});

export const createPatientRequestSchema = { body: patientBodySchema };
export const updatePatientRequestSchema = {
  params: idParamsSchema,
  body: patientBodySchema.partial().refine((value) => Object.keys(value).length, {
    message: "At least one field is required",
  }),
};
