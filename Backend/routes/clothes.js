
// routes/clothes.js
import express from 'express';
import { getPurchasedClothes } from '../controllers/Clothes/getPurchasedClothes.js';
import { verifyToken } from '../middleware/authMiddleware.js';


const router = express.Router();

// GET purchased clothes for a specific user (by user ID)
<<<<<<< HEAD
router.post('/purchased',getPurchasedClothes);
=======
router.post('/purchased', getPurchasedClothes);
>>>>>>> 9ad6564 (updated prefrences + login + posts)

export default router;
