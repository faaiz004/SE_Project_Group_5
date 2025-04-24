// routes/auth.js
import express from 'express';
import { signup } from '../controllers/User/SignUp.js'; // Adjust the path as necessary
import { submitPreferences } from '../controllers/User/SubmitPreferences.js';
import { login } from '../controllers/User/Login.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Define the signup route
router.post('/signup', signup);
router.post('/submit-preferences', verifyToken, submitPreferences);
router.post('/login', login);



export default router;
