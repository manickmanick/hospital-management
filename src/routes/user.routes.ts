import { Router } from "express";
import {
  createUser,
  deleteUser,
  getUsers,
} from "../controllers/auth.controller";
import { authorize } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { createUserRequestSchema } from "../validators/auth.validator";
import {
  emptyBodySchema,
  emptyQuerySchema,
  idParamsSchema,
} from "../validators/common.validator";

const router = Router();

router.use(authorize("ADMIN"));
router.get(
  "/",
  validate({ query: emptyQuerySchema }),
  getUsers,
);
router.post(
  "/",
  validate({ ...createUserRequestSchema, query: emptyQuerySchema }),
  createUser,
);
router.delete(
  "/:id",
  validate({
    params: idParamsSchema,
    body: emptyBodySchema,
    query: emptyQuerySchema,
  }),
  deleteUser,
);

export default router;
