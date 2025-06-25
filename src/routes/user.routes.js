import { Router } from "express";
import { login, logout, register } from "../controllers/user.controller.js";
import { jwtVerify } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", jwtVerify, logout);

export default router;
