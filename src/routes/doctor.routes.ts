import { Router } from "express";
import {
  createDoctor,
  deleteDoctor,
  getDoctor,
  getDoctors,
  updateDoctor,
} from "../controllers/doctor.controller";
import { authorize } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import {
  emptyBodySchema,
  emptyQuerySchema,
  idParamsSchema,
} from "../validators/common.validator";
import {
  createDoctorRequestSchema,
  updateDoctorRequestSchema,
} from "../validators/doctor.validator";

const router = Router();

router.get("/", validate({ query: emptyQuerySchema }), getDoctors);
router.get(
  "/:id",
  validate({ params: idParamsSchema, query: emptyQuerySchema }),
  getDoctor,
);
router.post(
  "/",
  authorize("ADMIN"),
  validate({ ...createDoctorRequestSchema, query: emptyQuerySchema }),
  createDoctor,
);
router.put(
  "/:id",
  authorize("ADMIN"),
  validate({ ...updateDoctorRequestSchema, query: emptyQuerySchema }),
  updateDoctor,
);
router.delete(
  "/:id",
  authorize("ADMIN"),
  validate({
    params: idParamsSchema,
    body: emptyBodySchema,
    query: emptyQuerySchema,
  }),
  deleteDoctor,
);

export default router;
