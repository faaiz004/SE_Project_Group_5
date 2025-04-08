import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
  username: { type: String},
  email: { type: String, required: true, unique: true },
  password: { type: String, required : true },
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

  },
  stylePreference : {
    type: String,
    enum: ['modern', 'business', 'casual', 'oldmoney'],
  }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;