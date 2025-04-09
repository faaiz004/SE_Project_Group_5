
// routes/clothes.js
import express from 'express';
import { getPurchasedClothes } from '../controllers/Clothes/getPurchasedClothes.js';
import { getAllClothes } from '../controllers/User/ExplorePage/GetAllClothes.js';
import { verifyToken } from '../middleware/authMiddleware.js';


const router = express.Router();

// GET purchased clothes for a specific user (by user ID)
router.post('/purchased', getPurchasedClothes);
router.get('/getClothes', getAllClothes)

export default router;
