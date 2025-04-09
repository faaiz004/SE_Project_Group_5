import express from 'express';
import multer from 'multer';
import { createPost } from '../controllers/Posts/pushPosts.js';
import { getAllPosts } from '../controllers/Posts/getAllPosts.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage }); // store uploaded file in memory

// Route setup — notice `upload.single("image")` here
router.post('/create',  upload.single("image"), createPost);
router.get('/getAll', getAllPosts);


export default router;

