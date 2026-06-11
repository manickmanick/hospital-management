import { Router } from "express";

import {
    getPatients,
    getPatient,
    createPatient,
    deletePatient
} from "../controllers/patient.controller";

const router = Router();

router.get("/", getPatients);

router.get("/:id", getPatient);

router.post("/", createPatient);

router.delete("/:id", deletePatient);

export default router;