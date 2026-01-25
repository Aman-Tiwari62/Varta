import express from 'express';
import { searchPeople, getUser } from '../controllers/user.controller.js';
const router = express.Router();

router.get('/search',searchPeople);
router.get("/people/:username", getUser);


export default router;