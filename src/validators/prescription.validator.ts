import { z } from "zod";

export const createPrescriptionRequestSchema = {
  body: z.object({
    appointmentId: z.number().int().positive(),
    diagnosis: z.string().trim().min(2).max(2000),
    notes: z.string().trim().max(5000).nullable().optional(),
    medicines: z
      .array(
        z.object({
          medicineName: z.string().trim().min(1).max(200),
          dosage: z.string().trim().min(1).max(100),
          frequency: z.string().trim().min(1).max(100),
          duration: z.string().trim().min(1).max(100),
          instructions: z.string().trim().max(1000).nullable().optional(),
        }),
      )
      .min(1)
      .max(50),
  }),
};
