import Post from '../../models/Post.js';

export const likePost = async (req, res) => {
  const { postId } = req.params;
  const post = await Post.findById(postId);
  if (!post) return res.status(404).json({ error: 'Not found' });
  post.likes += 1;
  await post.save();
  res.json({ likes: post.likes });
};
