import { Router } from "express";

import patientRoutes from "./patient.routes";
import doctorRoutes from "./doctor.routes";
import appointmentRoutes from "./appointment.routes";

const router = Router();

router.use("/patients", patientRoutes);

router.use("/doctors", doctorRoutes);

router.use("/appointments", appointmentRoutes);

export default router;
