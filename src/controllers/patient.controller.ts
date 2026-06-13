import { NextFunction, Request, Response } from "express";
import * as patientService from "../services/patient.service";

export const getPatients = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    res.json(await patientService.getAllPatients());
  } catch (error) {
    next(error);
  }
};

export const getPatient = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    res.json(await patientService.getPatientById(Number(req.params.id)));
  } catch (error) {
    next(error);
  }
};

export const getPatientHistory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    res.json(await patientService.getPatientHistory(Number(req.params.id)));
  } catch (error) {
    next(error);
  }
};

export const createPatient = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    res.status(201).json(await patientService.createPatient(req.body));
  } catch (error) {
    next(error);
  }
};

export const updatePatient = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    res.json(
      await patientService.updatePatient(Number(req.params.id), req.body),
    );
  } catch (error) {
    next(error);
  }
};

export const deletePatient = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await patientService.deletePatient(Number(req.params.id));
    res.json({ message: "Patient deleted" });
  } catch (error) {
    next(error);
  }
};
