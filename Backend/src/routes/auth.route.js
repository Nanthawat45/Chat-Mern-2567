import express from 'express';
const router = express.Router();
import { signUp } from "../controllers/auth.controller.js";
import { signIn } from '../controllers/auth.controller.js';
import { signOut } from '../controllers/auth.controller.js';
import { updataProfile } from '../controllers/auth.controller.js';
import { protectedRoute } from '../middleware/auth.middleware.js';

router.post("/singUp", signUp);
router.post("/signIn", signIn);
router.post("/signOut", signOut);

router.put("/update-profile", protectedRoute, updataProfile);

export default router;