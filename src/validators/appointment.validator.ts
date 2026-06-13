import { z } from "zod";
import { idParamsSchema } from "./common.validator";

export const appointmentStatusSchema = z.enum([
  "SCHEDULED",
  "COMPLETED",
  "CANCELLED",
]);

export const createAppointmentRequestSchema = {
  body: z.object({
    patientId: z.number().int().positive(),
    doctorId: z.number().int().positive(),
    appointmentDate: z.iso.datetime({ offset: true }),
    reason: z.string().trim().max(1000).nullable().optional(),
  }),
};

export const updateAppointmentStatusRequestSchema = {
  params: idParamsSchema,
  body: z.object({ status: appointmentStatusSchema }),
};
