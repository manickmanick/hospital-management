import { Request, Response } from "express";
import * as appointmentService from "../services/appointment.service";

export const createAppointment = async (req: Request, res: Response) => {
  const { patientId, doctorId, appointmentDate } = req.body;
  console.log("req.body -> ", req.body);

  const result = await appointmentService.createAppointment(
    patientId,
    doctorId,
    appointmentDate,
  );

  res.status(201).json(result);
};

export const getAppointments = async (req: Request, res: Response) => {
  const appointments = await appointmentService.getAllAppointments();

  res.json(appointments);
};

export const getAppointment = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const appointment = await appointmentService.getAppointmentById(id);

  res.json(appointment);
};

export const updateAppointmentStatus = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const { status } = req.body;

  const result = await appointmentService.updateAppointmentStatus(id, status);

  res.json(result);
};

export const deleteAppointment = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  await appointmentService.deleteAppointment(id);

  res.json({
    message: "Appointment deleted",
  });
};
