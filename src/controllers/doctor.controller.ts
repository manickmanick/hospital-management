import { NextFunction, Request, Response } from "express";
import * as doctorService from "../services/doctor.service";

export const createDoctor = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    res.status(201).json(await doctorService.createDoctor(req.body));
  } catch (error) {
    next(error);
  }
};

export const getDoctors = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    res.json(await doctorService.getAllDoctors());
  } catch (error) {
    next(error);
  }
};

export const getDoctor = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    res.json(await doctorService.getDoctorById(Number(req.params.id)));
  } catch (error) {
    next(error);
  }
};

export const updateDoctor = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    res.json(await doctorService.updateDoctor(Number(req.params.id), req.body));
  } catch (error) {
    next(error);
  }
};

export const deleteDoctor = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await doctorService.deleteDoctor(Number(req.params.id));
    res.json({ message: "Doctor deleted" });
  } catch (error) {
    next(error);
  }
};
