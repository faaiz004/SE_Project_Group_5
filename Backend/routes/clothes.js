<<<<<<< HEAD
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
=======

// routes/clothes.js
import express from 'express';
import { getPurchasedClothes } from '../controllers/Clothes/getPurchasedClothes.js';
import { verifyToken } from '../middleware/authMiddleware.js';


const router = express.Router();

// GET purchased clothes for a specific user (by user ID)
router.post('/purchased', getPurchasedClothes);

export default router;
// import express from 'express';
// import Clothes from '../models/clothes.js';

// const router = express.Router();

// // GET endpoint to fetch all clothes items
// router.get('/', async (req, res) => {
//   try {
//     const clothes = await Clothes.find();
//     res.status(200).json(clothes);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to fetch clothes" });
//   }
// });

// export default router;

>>>>>>> 8daf48a405e3121c6672ac216edd4042645795bd
