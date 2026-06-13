import { z } from "zod";

export const createDoctorSchema = z.object({
  name: z
    .string()
    .min(3),

  specialization: z
    .string()
    .min(2),

  email: z
    .email(),

  phone: z
    .string()
    .min(10)
    .max(15)
});

export type CreateDoctorDto =
  z.infer<typeof createDoctorSchema>;