import mongoose from 'mongoose';
import Post from '../../models/Post.js';

export const unlikePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: 'Invalid post ID.' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    // Check if user has liked the post
    const index = post.likes.findIndex(id => id.toString() === userId);
    if (index === -1) {
      return res.status(400).json({ error: 'You have not liked this post.' });
    }

    // Remove userId from likes array
    post.likes.splice(index, 1);
    await post.save();

    return res.status(200).json({
      message: 'Post unliked successfully.',
      likes: post.likes.length
    });
  } catch (error) {
    console.error('Error unliking post:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};
