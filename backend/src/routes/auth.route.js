import express from 'express';
import { registerEmail, verifyOtp, fillDetails, refreshAccessToken, login } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/registerEmail', registerEmail)

router.post('/verifyOtp', verifyOtp)

router.post('/fillDetails', fillDetails)

router.post('/refresh', refreshAccessToken )

router.post('/login', login)

export default router;