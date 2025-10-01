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
  deleteUser,
  getSingleUser,
  unregisterUser,
  registerAccount,
} from "../controllers/user.controller.js";
import { jwtVerify } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.get("/users", getUsers);
router.get("/user/:_id", getSingleUser);
router.post("/login", login);
router.post("/logout", jwtVerify, logout);
router.post("/social-login", handleSocialLogin);
router.post("/complete-onboarding", completeOnboarding);
router.post("/account-creation-skipped", accountCreationChecked);
router.post("/ban-user", banUser);
router.post("/unban", removeBan);
router.post("/update-ban", updateBan);
router.delete("/delete-user/:_id", deleteUser);
router.post("/unregister/:_id", unregisterUser);
router.post("/register-account/:_id", registerAccount);

export default router;
