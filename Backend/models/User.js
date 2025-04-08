import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
  username: { type: String},
  email: { type: String, required: true, unique: true },
<<<<<<< HEAD
  password: { type: String},
  likedItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Clothes' }],
  ownedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Clothes' }],
  gender: { type: String},
  shirtSize: {
    type: String,
    enum: ['s', 'm', 'l'],
  },
  pantSize: {
    type: String,
    enum: ['s','m','l'],
=======
  password: { type: String },
  likedItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  ownedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  gender: { type: String},
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
>>>>>>> c24c37e (Complete auth integration)

  },
  stylePreference : {
    type: String,
<<<<<<< HEAD
    enum: [
      'Modern',
      'Old_Money',
      'Smart_Casual',
      'Casual_Everyday'
    ],
=======
    enum: ['modern', 'business', 'casual', 'oldmoney'],
>>>>>>> c24c37e (Complete auth integration)
  }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;