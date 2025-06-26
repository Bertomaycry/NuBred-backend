import express from "express";
import { jwtVerify } from "../middlewares/auth.middleware.js";
import {
  createUserProfile,
  getUserProfile,
} from "../controllers/profile.controller.js";

const router = express.Router();

router.post("/create", jwtVerify, createUserProfile);
router.get("/profile", jwtVerify, getUserProfile);

export default router;
