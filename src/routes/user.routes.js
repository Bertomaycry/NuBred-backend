import { Router } from "express";
import {
  handleSocialLogin,
  login,
  logout,
  register,
} from "../controllers/user.controller.js";
import { jwtVerify } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", jwtVerify, logout);
router.post("/social-login", handleSocialLogin);

export default router;
