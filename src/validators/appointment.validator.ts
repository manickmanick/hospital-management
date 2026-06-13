import { z } from "zod";

export const createAppointmentSchema = z.object({
  patientId: z.number().int().positive(),

  doctorId: z.number().int().positive(),

  appointmentDate: z.string().datetime(),
});

export type CreateAppointmentDto = z.infer<typeof createAppointmentSchema>;
