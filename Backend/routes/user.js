// routes/auth.js
import express from 'express';
import { signup } from '../controllers/User/SignUp.js'; // Adjust the path as necessary

const router = express.Router();

// Define the signup route
router.post('/signup', signup);

export default router;
