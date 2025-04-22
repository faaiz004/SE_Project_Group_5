import express from 'express';
import multer from 'multer';
import { createPost } from '../controllers/Posts/pushPosts.js';
import {getAllPosts} from '../controllers/Posts/getAllPosts.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { savePost, unsavePost, getSavedPosts } from '../controllers/Posts/savePosts.js';
import { likePost } from '../controllers/Posts/likePost.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage }); // store uploaded file in memory

// Route setup — notice `upload.single("image")` here
router.post('/create',  upload.single("image"), createPost);
router.get('/getAll', getAllPosts);
router.post('/:postId/save', verifyToken, savePost);
router.delete('/:postId/save', verifyToken, unsavePost);
router.get('/saved', verifyToken, getSavedPosts);
router.post('/:postId/like', likePost);

export default router;

