import express from 'express';
import { registerEmail, verifyOtp } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/registerEmail', registerEmail)

router.post('/verifyOtp', verifyOtp)

export default router;