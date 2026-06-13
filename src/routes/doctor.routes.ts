import { Router } from "express";

import {
  createDoctor,
  getDoctors,
  getDoctor,
} from "../controllers/doctor.controller";

const router = Router();

router.post("/", createDoctor);

router.get("/", getDoctors);

router.get("/:id", getDoctor);

export default router;
