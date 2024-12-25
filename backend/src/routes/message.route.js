import express from 'express';
import { shieldRoute } from '../middleware/auth.middleware.js';
import { getUsersForSidebar, getMessages, sendMessage }from '../controllers/message.controller.js';

const router = express.Router();

router.get("/users", shieldRoute, getUsersForSidebar);
router.get("/:id", shieldRoute, getMessages);
router.post("/send/:id", shieldRoute, sendMessage);

export default router;