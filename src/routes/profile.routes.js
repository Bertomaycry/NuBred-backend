import express from "express";
import { jwtVerify } from "../middlewares/auth.middleware.js";
import {
  createUserProfile,
  getUserProfile,
  updateUserProfile,
} from "../controllers/profile.controller.js";

const router = express.Router();

router.post("/create", createUserProfile);
router.put("/update-profile", jwtVerify, updateUserProfile);
router.get("/user-profile/:_id", getUserProfile);

export default router;
