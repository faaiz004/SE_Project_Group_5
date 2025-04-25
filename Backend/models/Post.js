import mongoose from 'mongoose';

// schema for the post collection
const postSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true
  },
  caption: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  clothes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Clothes'
    }
  ],
});

const Post = mongoose.model('Post', postSchema);

export default Post;
