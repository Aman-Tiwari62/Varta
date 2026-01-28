// chat.routes.js
import express from "express";
import { protect } from "../middlewares/protect.middleware.js";
import { createConversation, sendMessage, getMessages } from "../controllers/chat.controller.js";

const router = express.Router();

router.post("/conversation", protect, createConversation);
router.post("/messages", protect, sendMessage);
router.get("/messages/:conversationId", protect, getMessages);

export default router;
