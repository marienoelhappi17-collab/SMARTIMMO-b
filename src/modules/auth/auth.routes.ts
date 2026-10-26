import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate.middleware";
import { authorize } from "../../middlewares/authorize.middleware";
import { validate } from "../../middlewares/validate.middleware";
import {
  changePasswordSchema,
  createLocataireSchema,
  loginSchema,
  registerSchema,
} from "./schemas/auth.schemas";
import { changePassword, createLocataire, login, me, register } from "./auth.controller";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/me", authenticate, me);
router.patch("/password", authenticate, validate(changePasswordSchema), changePassword);
router.post(
  "/locataires",
  authenticate,
  authorize("BAILLEUR"),
  validate(createLocataireSchema),
  createLocataire,
);

export default router;