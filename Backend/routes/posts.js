import express from 'express';
import multer from 'multer';
import { createPost } from '../controllers/Posts/pushPosts.js';
import {getAllPosts} from '../controllers/Posts/getAllPosts.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { likePost } from '../controllers/Posts/likePost.js';
import { unlikePost } from '../controllers/Posts/unlikePost.js';
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage }); // store uploaded file in memory

// Route setup — notice `upload.single("image")` here
router.post('/create',  upload.single("image"), verifyToken, createPost);
router.get('/getAll', verifyToken, getAllPosts);
router.post('/:postId/like', verifyToken, likePost);
router.post('/:postId/unlike', verifyToken, unlikePost);

export default router;

