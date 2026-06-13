import { NextFunction, Request, Response } from "express";
import * as appointmentService from "../services/appointment.service";

export const createAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    res
      .status(201)
      .json(await appointmentService.createAppointment(req.body, req.user!));
  } catch (error) {
    next(error);
  }
};

export const getAppointments = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    res.json(await appointmentService.getAllAppointments(req.user!));
  } catch (error) {
    next(error);
  }
};

export const getAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    res.json(
      await appointmentService.getAppointmentById(
        Number(req.params.id),
        req.user!,
      ),
    );
  } catch (error) {
    next(error);
  }
};

export const updateAppointmentStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    res.json(
      await appointmentService.updateAppointmentStatus(
        Number(req.params.id),
        req.body.status,
        req.user!,
      ),
    );
  } catch (error) {
    next(error);
  }
};

export const deleteAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await appointmentService.deleteAppointment(Number(req.params.id));
    res.json({ message: "Appointment deleted" });
  } catch (error) {
    next(error);
  }
};
