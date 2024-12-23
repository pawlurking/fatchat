import express from 'express';
import { login, logout, signup, updateProfile, checkAuth } from '../controllers/auth.controller.js';
import {shieldRoute} from '../middleware/auth.middleware.js';

const router = express.Router();

router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)
// if user wants to update profile, first check if they're in login, if yes (auth), call updateProfile
router.put("/update-profile", shieldRoute, updateProfile)
// endpoint to check if user is authenticated or not
// we call this checkAuth whenever we refresh the page
router.get("/check", shieldRoute, checkAuth)

export default router;