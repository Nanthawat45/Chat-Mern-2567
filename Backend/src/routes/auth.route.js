import express from 'express';
const router = express.Router();
import { signUp } from "../controllers/auth.controller.js";
import { signIn } from '../controllers/auth.controller.js';
import { signOut } from '../controllers/auth.controller.js';
import { updataProfile } from '../controllers/auth.controller.js';
import { protectedRoute } from '../middleware/auth.middleware.js';

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/signout", signOut);

router.put("/update-profile", protectedRoute, updataProfile);

export default router;