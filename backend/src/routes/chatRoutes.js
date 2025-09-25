import express from "express";
import { getChats, sendMessage } from "../controllers/chatController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:userId", protect, getChats); // get conversation
router.post("/", protect, sendMessage);   // send new message

export default router;
