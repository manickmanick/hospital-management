import { Request, Response } from "express";
import * as doctorService from "../services/doctor.service";


export const createDoctor = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      name,
      specialization,
      email,
      phone
    } = req.body;

    const result =
      await doctorService.createDoctor(
        name,
        specialization,
        email,
        phone
      );

    res.status(201).json({
      message: "Doctor created",
      result
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong"
    });
  }
};

export const getDoctors = async (
  req: Request,
  res: Response
) => {
  const doctors =
    await doctorService.getAllDoctors();

  res.json(doctors);
};

export const getDoctor = async (
  req: Request,
  res: Response
) => {
  const id = Number(req.params.id);

  const doctor =
    await doctorService.getDoctorById(id);

  res.json(doctor);
};