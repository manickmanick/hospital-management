import { Router } from "express";
import {
  createAppointment,
  deleteAppointment,
  getAppointment,
  getAppointments,
  updateAppointmentStatus,
} from "../controllers/appointment.controller";
import { authorize } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import {
  createAppointmentRequestSchema,
  updateAppointmentStatusRequestSchema,
} from "../validators/appointment.validator";
import {
  emptyBodySchema,
  emptyQuerySchema,
  idParamsSchema,
} from "../validators/common.validator";

const router = Router();

router.use(authorize("ADMIN", "DOCTOR"));
router.post(
  "/",
  validate({ ...createAppointmentRequestSchema, query: emptyQuerySchema }),
  createAppointment,
);
router.get("/", validate({ query: emptyQuerySchema }), getAppointments);
router.get(
  "/:id",
  validate({ params: idParamsSchema, query: emptyQuerySchema }),
  getAppointment,
);
router.patch(
  "/:id/status",
  validate({
    ...updateAppointmentStatusRequestSchema,
    query: emptyQuerySchema,
  }),
  updateAppointmentStatus,
);
router.delete(
  "/:id",
  authorize("ADMIN"),
  validate({
    params: idParamsSchema,
    body: emptyBodySchema,
    query: emptyQuerySchema,
  }),
  deleteAppointment,
);

export default router;
