import { z } from "zod";
import { idParamsSchema } from "./common.validator";

const doctorBodySchema = z.object({
  name: z.string().trim().min(3).max(100),
  specialization: z.string().trim().min(2).max(100),
  licenseNumber: z.string().trim().min(2).max(100),
  email: z.email(),
  phone: z.string().trim().min(10).max(20),
});

export const createDoctorRequestSchema = { body: doctorBodySchema };
export const updateDoctorRequestSchema = {
  params: idParamsSchema,
  body: doctorBodySchema.partial().refine((value) => Object.keys(value).length, {
    message: "At least one field is required",
  }),
};
