import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
  username: { type: String},
  email: { type: String, required: true, unique: true },
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

  },
  stylePreference : {
    type: String,
    enum: [
      'Modern',
      'Old_Money',
      'Smart_Casual',
      'Casual_Everyday'
    ],
  }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;