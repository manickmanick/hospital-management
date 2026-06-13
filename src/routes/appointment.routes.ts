import { Router } from "express";
import { validate } from "../middlewares/validate";
import {
  createAppointment,
  getAppointments,
  getAppointment,
  updateAppointmentStatus,
  deleteAppointment,
} from "../controllers/appointment.controller";
import { createAppointmentSchema } from "../validators/appointment.validator";

const router = Router();

router.post("/", validate(createAppointmentSchema), createAppointment);

router.get("/", getAppointments);

router.get("/:id", getAppointment);

router.patch("/:id/status", updateAppointmentStatus);

router.delete("/:id", deleteAppointment);

export default router;
