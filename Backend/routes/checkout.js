// backend/routes/checkout.js

import express from 'express';
import { purchaseItems } from '../controllers/checkoutController.js';
import { verifyToken } from '../middleware/authMiddleware.js'; // Optional, for protected route

const router = express.Router();

// POST /api/checkout
router.post('/', verifyToken, purchaseItems); // or remove `verifyToken` if public

export default router;
