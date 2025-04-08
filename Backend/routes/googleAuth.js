// routes/googleAuth.js
import express from 'express';
import { googleAuth } from '../controllers/User/SignUpOAuth.js'; // Adjust the path as necessary

const router = express.Router();

// POST route: https://yourdomain/api/auth/google
router.post('/google', googleAuth);

export default router;
