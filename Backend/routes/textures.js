
import express from 'express';
import { getTextureByName } from '../controllers/Clothes/getTextureClothes.js';

const router = express.Router();

router.get('/:name', getTextureByName);

export default router;
