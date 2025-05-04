import mongoose from 'mongoose';
import Clothes from '../models/clothes.js';
import User from '../models/User.js';

const connectDB = async () => {
  try {

    const conn = await mongoose.connect('mongodb+srv://mshafaytanveer67j:12345@swipe-fit.hsaprtd.mongodb.net/?retryWrites=true&w=majority&appName=Swipe-Fit');

  } catch (error) {
    process.exit(1);
  }
};

async function buyClothesForUser() {
  try {
    await connectDB();

    const user = await User.findOne({ email: "saram.hassan1412@gmail.com" });
    if (!user) {
      throw new Error('User with email "faaizumer9@outlook.com" not found.');
    }

    const uppers = await Clothes.aggregate([
      { $match: { upper: true } },
      { $group: { _id: '$name', doc: { $first: '$$ROOT' } } },
      { $replaceRoot: { newRoot: '$doc' } },
      { $sample: { size: 10 } }
    ]);
    if (uppers.length < 10) {
      throw new Error('Not enough unique upper garments available to purchase.');
    }

    const lowers = await Clothes.aggregate([
      { $match: { lower: true } },
      { $group: { _id: '$name', doc: { $first: '$$ROOT' } } },
      { $replaceRoot: { newRoot: '$doc' } },
      { $sample: { size: 10 } }
    ]);
    if (lowers.length < 10) {
      throw new Error('Not enough unique lower garments available to purchase.');
    }

    const purchasedClothes = [...uppers, ...lowers];
    user.ownedProducts = user.ownedProducts.concat(purchasedClothes.map(item => item._id));

    await user.save();

    purchasedClothes.forEach(item => {
    });
  } catch (error) {
  } finally {
    await mongoose.disconnect();
  }
}

buyClothesForUser();
