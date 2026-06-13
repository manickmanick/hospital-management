import { Router } from "express";
import {
  createLabReport,
  deleteLabReport,
  getLabReportFile,
} from "../controllers/lab-report.controller";
import { authorize } from "../middlewares/auth";
import { uploadLabFile } from "../middlewares/upload";
import { validate } from "../middlewares/validate";
import {
  emptyBodySchema,
  emptyQuerySchema,
  idParamsSchema,
} from "../validators/common.validator";
import { uploadLabReportRequestSchema } from "../validators/lab-report.validator";

const router = Router();

router.post(
  "/",
  authorize("LAB", "ADMIN"),
  uploadLabFile,
  validate({
    ...uploadLabReportRequestSchema,
    query: emptyQuerySchema,
  }),
  createLabReport,
);
router.get(
  "/:id/file",
  validate({ params: idParamsSchema, query: emptyQuerySchema }),
  getLabReportFile,
);
router.delete(
  "/:id",
  authorize("ADMIN"),
  validate({
    params: idParamsSchema,
    body: emptyBodySchema,
    query: emptyQuerySchema,
  }),
  deleteLabReport,
);

export default router;
