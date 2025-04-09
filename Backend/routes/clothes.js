
// routes/clothes.js
import express from 'express';
import { getPurchasedClothes } from '../controllers/Clothes/getPurchasedClothes.js';
import { verifyToken } from '../middleware/authMiddleware.js';


const router = express.Router();

// GET purchased clothes for a specific user (by user ID)
router.post('/purchased',verifyToken, getPurchasedClothes);

export default router;
