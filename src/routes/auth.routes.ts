import { Router } from "express";
import { login } from "../controllers/auth.controller";
import { validate } from "../middlewares/validate";
import { loginRequestSchema } from "../validators/auth.validator";
import { emptyQuerySchema } from "../validators/common.validator";

const router = Router();

router.post(
  "/login",
  validate({ ...loginRequestSchema, query: emptyQuerySchema }),
  login,
);

export default router;
