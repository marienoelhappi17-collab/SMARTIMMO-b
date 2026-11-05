import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate.middleware";
import { authorize } from "../../middlewares/authorize.middleware";
import { validate } from "../../middlewares/validate.middleware";
import {
  changePasswordSchema,
  createLocataireSchema,
  loginSchema,
  refreshTokenSchema,
  registerSchema,
} from "./schemas/auth.schemas";
import {
  changePassword,
  createLocataire,
  login,
  logout,
  me,
  refresh,
  register,
} from "./auth.controller";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/refresh-token", validate(refreshTokenSchema), refresh);
router.post("/logout", authenticate, logout);
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