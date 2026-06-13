import { Router } from "express";
import {
  createPatient,
  deletePatient,
  getPatient,
  getPatientHistory,
  getPatients,
  updatePatient,
} from "../controllers/patient.controller";
import { authorize } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import {
  emptyBodySchema,
  emptyQuerySchema,
  idParamsSchema,
} from "../validators/common.validator";
import {
  createPatientRequestSchema,
  updatePatientRequestSchema,
} from "../validators/patient.validator";

const router = Router();
const idReadSchema = {
  params: idParamsSchema,
  query: emptyQuerySchema,
};

router.get("/", validate({ query: emptyQuerySchema }), getPatients);
router.get(
  "/:id/history",
  authorize("ADMIN", "DOCTOR"),
  validate(idReadSchema),
  getPatientHistory,
);
router.get("/:id", validate(idReadSchema), getPatient);
router.post(
  "/",
  authorize("ADMIN", "DOCTOR"),
  validate({ ...createPatientRequestSchema, query: emptyQuerySchema }),
  createPatient,
);
router.put(
  "/:id",
  authorize("ADMIN", "DOCTOR"),
  validate({ ...updatePatientRequestSchema, query: emptyQuerySchema }),
  updatePatient,
);
router.delete(
  "/:id",
  authorize("ADMIN"),
  validate({
    params: idParamsSchema,
    query: emptyQuerySchema,
    body: emptyBodySchema,
  }),
  deletePatient,
);

export default router;
