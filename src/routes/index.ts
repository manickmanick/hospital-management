import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import appointmentRoutes from "./appointment.routes";
import authRoutes from "./auth.routes";
import doctorRoutes from "./doctor.routes";
import labReportRoutes from "./lab-report.routes";
import patientRoutes from "./patient.routes";
import prescriptionRoutes from "./prescription.routes";
import userRoutes from "./user.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use(authenticate);
router.use("/users", userRoutes);
router.use("/patients", patientRoutes);
router.use("/doctors", doctorRoutes);
router.use("/appointments", appointmentRoutes);
router.use("/prescriptions", prescriptionRoutes);
router.use("/lab-reports", labReportRoutes);

export default router;
