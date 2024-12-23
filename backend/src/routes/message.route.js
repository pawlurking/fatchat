import express from 'express';
import { shieldRoute } from '../middleware/auth.middleware.js';
import { getUsersForSidebar, getMessages, sendMessage }from '../controllers/message.controller.js';

const router = express.Router();

router.get("/users", shieldRoute, getUsersForSidebar)
router.get("/:user2ChatID", shieldRoute, getMessages)
router.post("/send/:user2ChatID", shieldRoute, sendMessage)

export default router;