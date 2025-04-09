import express from 'express';
import multer from 'multer';
import { createPost } from '../controllers/Posts/pushPosts.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage }); // store uploaded file in memory

// Route setup — notice `upload.single("image")` here
router.post('/create', verifyToken, upload.single("image"), createPost);

export default router;
