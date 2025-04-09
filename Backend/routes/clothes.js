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

import express from 'express';
import { getAllClothes } from '../controllers/User/ExplorePage/GetAllClothes.js';

const router = express.Router();

// GET /api/clothes --> Fetch all clothes with signed image URLs
router.get('/', getAllClothes);

export default router;
