import express from "express";
import { getAllChat, saveChatHistory } from "../controllers/chat-history.controller";
import { jwtVerify } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/save-history", saveChatHistory);
router.get("/get-chat", jwtVerify, getAllChat);

export default router;
