import express from 'express';
import { getPurchasedClothes } from '../controllers/Clothes/getPurchasedClothes.js';
import { getAllClothes } from '../controllers/User/ExplorePage/GetAllClothes.js';
import { getSavedClothes, saveClothes, unsaveClothes } from '../controllers/Clothes/saveClothes.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { purchaseClothes } from '../controllers/Clothes/purchaseClothes.js';

const router = express.Router();

// Existing Routes
router.post('/purchased', verifyToken, getPurchasedClothes);
router.get('/getClothes', verifyToken, getAllClothes);

// New Routes (Protected with verifyToken)
router.post('/saveClothes/:clothesId', verifyToken, saveClothes);
router.delete('/unsaveClothes/:clothesId', verifyToken, unsaveClothes);
router.get('/savedClothes', verifyToken, getSavedClothes);
router.post('/purchase', verifyToken, purchaseClothes);

export default router;
