import mongoose from 'mongoose';
import Post from '../../models/Post.js';

export const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: 'Invalid post ID.' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    const alreadyLiked = post.likes.some(id => id.toString() === userId);

    if (alreadyLiked) {
      return res.status(400).json({ error: 'You have already liked this post.' });
    }

    post.likes.push(userId);
    await post.save();

    return res.status(200).json({
      message: 'Post liked successfully.',
      likes: post.likes.length
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error.' });
  }
};
