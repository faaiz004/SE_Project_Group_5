import User   from '../../models/User.js';
import Post   from '../../models/Post.js';

export const savePost = async (req, res) => {
  const userId = req.user.id;
  const { postId } = req.params;
  await User.findByIdAndUpdate(userId,
    { $addToSet: { savedOutfits: postId }},
    { new: true }
  );
  res.json({ success: true });
};

export const unsavePost = async (req, res) => {
  const userId = req.user.id;
  const { postId } = req.params;
  await User.findByIdAndUpdate(userId,
    { $pull: { savedOutfits: postId }},
    { new: true }
  );
  res.json({ success: true });
};

export const getSavedPosts = async (req, res) => {
  const user = await User.findById(req.user.id)
    .populate({
      path: 'savedOutfits',
      populate: { path: 'user', select: 'username' }
    });
  res.json({ posts: user.savedOutfits });
};
