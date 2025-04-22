import express from 'express';
import { getPurchasedClothes } from '../controllers/Clothes/getPurchasedClothes.js';
import { getAllClothes } from '../controllers/User/ExplorePage/GetAllClothes.js';
import { getSavedClothes, saveClothes, unsaveClothes } from '../controllers/Clothes/saveClothes.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Existing Routes
router.post('/purchased', getPurchasedClothes);
router.get('/getClothes', getAllClothes);

// New Routes (Protected with verifyToken)
router.post('/saveClothes/:clothesId', verifyToken, saveClothes);
router.delete('/unsaveClothes/:clothesId', verifyToken, unsaveClothes);
router.get('/savedClothes', verifyToken, getSavedClothes);

export default router;
