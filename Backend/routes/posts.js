import express from 'express';
import multer from 'multer';
import { createPost } from '../controllers/Posts/pushPosts.js';
<<<<<<< HEAD
import {getAllPosts} from '../controllers/Posts/getAllPosts.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { likePost } from '../controllers/Posts/likePost.js';
=======
import { verifyToken } from '../middleware/authMiddleware.js';
import { getPosts } from '../controllers/Posts/getAllPosts.js';
>>>>>>> 8daf48a405e3121c6672ac216edd4042645795bd

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage }); // store uploaded file in memory
<<<<<<< HEAD

// Route setup — notice `upload.single("image")` here
router.post('/create',  upload.single("image"), createPost);
router.get('/getAll', getAllPosts);
router.post('/:postId/like', likePost);
=======

// Route setup — notice `upload.single("image")` here
router.post('/create' , upload.single("image"), createPost);
router.get('/getPosts', getPosts);


>>>>>>> 8daf48a405e3121c6672ac216edd4042645795bd

export default router;

