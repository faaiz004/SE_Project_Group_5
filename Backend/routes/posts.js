import express from 'express';
import Post from '../models/Post.js'; // Make sure Post.js also uses ES module syntax

const router = express.Router();

// Route: /api/create-post
router.post("/create-post", async (req, res) => {
  try {
    const { imageUrl, caption, tags } = req.body;
    const newPost = new Post({ imageUrl, caption, tags });
    await newPost.save();
    res.status(200).json({ message: "Post saved!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save post" });
  }
});

// Route: /api/get-posts
router.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

export default router;
