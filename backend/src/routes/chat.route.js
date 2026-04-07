// chat.routes.js
import express from "express";
import { protect } from "../middlewares/protect.middleware.js";
import { createConversation, sendMessage, getMessages, getConversations } from "../controllers/chat.controller.js";

const router = express.Router();

router.post("/conversation", protect, createConversation);
router.post("/messages", protect, sendMessage);
router.get("/messages/:conversationId", protect, getMessages);
router.get("/conversations", protect, getConversations);

export default router;
