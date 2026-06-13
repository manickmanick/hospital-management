import { Router } from "express";
import { createDoctorSchema } from "../validators/doctor.validator";
import { validate } from "../middlewares/validate";

import {
  createDoctor,
  getDoctors,
  getDoctor,
} from "../controllers/doctor.controller";

const router = Router();

router.post("/", validate(createDoctorSchema), createDoctor);

router.get("/", getDoctors);

router.get("/:id", getDoctor);

export default router;
