import { Router } from "express";
import { createPrescription } from "../controllers/prescription.controller";
import { authorize } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { emptyQuerySchema } from "../validators/common.validator";
import { createPrescriptionRequestSchema } from "../validators/prescription.validator";

const router = Router();

router.post(
  "/",
  authorize("DOCTOR"),
  validate({
    ...createPrescriptionRequestSchema,
    query: emptyQuerySchema,
  }),
  createPrescription,
);

export default router;
