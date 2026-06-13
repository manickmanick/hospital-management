import { Router } from "express";

import patientRoutes from "./patient.routes";
import doctorRoutes from "./doctor.routes";

const router = Router();

router.use("/patients", patientRoutes);

router.use("/doctors", doctorRoutes);

export default router;