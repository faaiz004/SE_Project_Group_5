import express from 'express';
import { getPurchasedClothes } from '../controllers/Clothes/getPurchasedClothes.js';
import { getAllClothes } from '../controllers/User/ExplorePage/GetAllClothes.js';
import { getSavedClothes, saveClothes, unsaveClothes } from '../controllers/Clothes/saveClothes.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { purchaseClothes } from '../controllers/Clothes/purchaseClothes.js';
import { sampleClothes } from '../controllers/Clothes/getClothesForPreferences.js';


const router = express.Router();

router.get('/sample', async (req, res) => {
    try {
      const { categories, gender, count, upper } = req.query;
  
      const data = await sampleClothes({   
        categories,
        gender,
        count: Number(count),
        upper: upper === 'true' ? true : upper === 'false' ? false : undefined
      });
  
      res.json(data);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
router.post('/purchased', verifyToken, getPurchasedClothes);
router.get('/getClothes', verifyToken, getAllClothes);


router.post('/saveClothes/:clothesId', verifyToken, saveClothes);
router.delete('/unsaveClothes/:clothesId', verifyToken, unsaveClothes);
router.get('/savedClothes', verifyToken, getSavedClothes);
router.post('/purchase', verifyToken, purchaseClothes);

export default router;
