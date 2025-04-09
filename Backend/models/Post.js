import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true
  },
  caption: {
    type: String,
    required: true
  },
  tags: {
    type: [String],
    default: []
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
  likes: {
    type: Number,
    default: 0
  },
  upper : {
    type: String,
    required: true 
  },
  lower : {
    type: String,
    required: true 
  },

});

const Post = mongoose.model('Post', postSchema);

export default Post;
