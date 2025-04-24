import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String },
  email: { type: String, required: true, unique: true },
<<<<<<< HEAD
  password: { type: String }, // This was optional for OAuth users
  likedItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Clothes' }],
  ownedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Clothes' }],
  savedOutfits: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  savedClothes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Clothes' }],
  gender: { type: String },
=======
  password: { type: String, required : true },
  likedItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Clothes' }],
  ownedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Clothes' }],
  gender: { type: String},
>>>>>>> 8daf48a405e3121c6672ac216edd4042645795bd
  shirtSize: {
    type: String,
    enum: ['s', 'm', 'l'],
  },
  pantSize: {
    type: String,
<<<<<<< HEAD
    enum: ['small', 'medium', 'large'],
  },
  weightClass: {
    type: String,
    enum: ['light', 'medium', 'heavy'],
=======
    enum: ['s','m','l'],

>>>>>>> 8daf48a405e3121c6672ac216edd4042645795bd
  },
  stylePreference: {
    type: String,
<<<<<<< HEAD
    enum: ['Modern', 'Old_Money', 'Smart_Casual', 'Casual_Everyday'],
  },
}, {
  timestamps: true,
=======
    enum: [
      'Modern',
      'Old_Money',
      'Smart_Casual',
      'Casual_Everyday'
    ],
  }
>>>>>>> 8daf48a405e3121c6672ac216edd4042645795bd
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
