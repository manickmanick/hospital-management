import { z } from "zod";

export const uploadLabReportRequestSchema = {
  body: z.object({
    patientId: z.coerce.number().int().positive(),
    testName: z.string().trim().min(2).max(200),
    notes: z.string().trim().max(2000).nullable().optional(),
    storageType: z.enum(["LOCAL", "S3"]),
  }),
};
