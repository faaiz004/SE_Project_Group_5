import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: false, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  likedItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  ownedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  gender: { type: String, required: true },
});

export default mongoose.model('User', userSchema);