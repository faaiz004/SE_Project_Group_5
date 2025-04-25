// routes/auth.js
import express from 'express';
import { signup } from '../controllers/User/SignUp.js'; // Adjust the path as necessary
import { submitPreferences } from '../controllers/User/SubmitPreferences.js';
import { login } from '../controllers/User/Login.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { fetchPreferences } from '../controllers/User/FetchPrefrences.js';
import { updatePreferences } from '../controllers/User/FetchPrefrences.js';
const router = express.Router();

// Define the signup route
router.post('/signup', signup);
router.post('/submit-preferences', verifyToken, submitPreferences);
router.get('/get-preferences', verifyToken, getUserPreferences);
router.post('/update-preferences', verifyToken, updateUserPreferences);
router.post('/login', login);
router.get('/fetch-preferences', verifyToken, fetchPreferences);
router.put('/update-preferences', verifyToken, updatePreferences);


export default router;
