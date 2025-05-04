import express from 'express';
import { purchaseItems } from '../controllers/checkoutController.js';
import { verifyToken } from '../middleware/authMiddleware.js'; 

const router = express.Router();


router.post('/', verifyToken, purchaseItems); 

export default router;
