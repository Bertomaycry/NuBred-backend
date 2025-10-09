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
  adminLogin,
} from "../controllers/user.controller.js";
import { jwtVerify } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/admin-login", adminLogin);
router.get("/users", jwtVerify, getUsers);
router.get("/user/:_id", getSingleUser);
router.post("/login", login);
router.post("/logout", jwtVerify, logout);
router.post("/social-login", handleSocialLogin);
router.post("/complete-onboarding", completeOnboarding);
router.post("/account-creation-skipped", accountCreationChecked);
router.post("/ban-user", jwtVerify, banUser);
router.post("/unban", jwtVerify, removeBan);
router.post("/update-ban", jwtVerify, updateBan);
router.delete("/delete-user/:_id", jwtVerify, deleteUser);
router.post("/unregister/:_id", jwtVerify, unregisterUser);
router.post("/register-account", jwtVerify, registerAccount);

export default router;
