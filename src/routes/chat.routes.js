import express from "express";
import { getAllChat, saveChatHistory } from "../controllers/chat-history.controller.js";
import { jwtVerify } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/save-history", jwtVerify, saveChatHistory);
router.get("/get-chat", jwtVerify, getAllChat);

export default router;
