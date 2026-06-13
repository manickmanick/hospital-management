import { Router } from "express";

import {
  getPatients,
  getPatient,
  createPatient,
  deletePatient,
} from "../controllers/patient.controller";
import { createPatientSchema } from "../validators/patient.validator";
import { validate } from "../middlewares/validate";
const router = Router();

router.get("/", getPatients);

router.get("/:id", getPatient);

router.post("/", validate(createPatientSchema), createPatient);

router.delete("/:id", deletePatient);

export default router;
