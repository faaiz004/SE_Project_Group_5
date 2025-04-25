import express from 'express';
import { googleAuth } from '../controllers/User/SignUpOAuth.js'; 

const router = express.Router();

router.post('/google', googleAuth);

export default router;
