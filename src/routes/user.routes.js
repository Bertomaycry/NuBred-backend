import { Router } from "express";
import {
  handleSocialLogin,
  login,
  logout,
  register,
  completeOnboarding,
  accountCreationChecked,
} from "../controllers/user.controller.js";
import { jwtVerify } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", jwtVerify, logout);
router.post("/social-login", handleSocialLogin);
router.post("/complete-onboarding", jwtVerify, completeOnboarding);
router.post("/account-creation-skipped", jwtVerify, accountCreationChecked);

export default router;
