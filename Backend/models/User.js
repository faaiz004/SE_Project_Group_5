import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // This was optional for OAuth users
  likedItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Clothes' }],
  ownedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Clothes' }],
  savedOutfits: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  savedClothes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Clothes' }],
  gender: { type: String },
  shirtSize: {
    type: String,
    enum: ['small', 'medium', 'large'],
  },
  pantSize: {
    type: String,
    enum: ['small', 'medium', 'large'],
  },
  weightClass: {
    type: String,
    enum: ['light', 'medium', 'heavy'],
  },
  stylePreference: {
    type: String,
    enum: ['Modern', 'Old_Money', 'Smart_Casual', 'Casual_Everyday'],
  },
}, {
  timestamps: true,
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
