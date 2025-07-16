import { Router } from "express";
import {
  handleSocialLogin,
  login,
  logout,
  register,
  completeOnboarding,
  accountCreationChecked,
  banUser,
  removeBan,
  getUsers,
  updateBan,
} from "../controllers/user.controller.js";
import { jwtVerify } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.get("/users", getUsers);
router.post("/login", login);
router.post("/logout", jwtVerify, logout);
router.post("/social-login", handleSocialLogin);
router.post("/complete-onboarding", completeOnboarding);
router.post("/account-creation-skipped", accountCreationChecked);
router.post("/ban-user", banUser);
router.post("/unban", removeBan);
router.post("/update-ban", updateBan);

export default router;
