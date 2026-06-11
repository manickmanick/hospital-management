import { Request, Response } from "express";
import * as patientService from "../services/patient.service";

export const getPatients = async (
    req: Request,
    res: Response
) => {
    const patients =
        await patientService.getAllPatients();

    res.json(patients);
};

export const getPatient = async (
    req: Request,
    res: Response
) => {
    const id = Number(req.params.id);

    const patient =
        await patientService.getPatientById(id);

    res.json(patient);
};

export const createPatient = async (
    req: Request,
    res: Response
) => {
    const { name, age, phone } = req.body;

    const result =
        await patientService.createPatient(
            name,
            age,
            phone
        );

    res.status(201).json(result);
};

export const deletePatient = async (
    req: Request,
    res: Response
) => {
    const id = Number(req.params.id);

    await patientService.deletePatient(id);

    res.json({
        message: "Patient deleted"
    });
};