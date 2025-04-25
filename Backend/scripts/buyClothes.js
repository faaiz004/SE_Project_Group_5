import mongoose from 'mongoose';
import Clothes from '../models/clothes.js';
import User from '../models/User.js';

const connectDB = async () => {
  try {

    const conn = await mongoose.connect('mongodb+srv://mshafaytanveer67j:12345@swipe-fit.hsaprtd.mongodb.net/?retryWrites=true&w=majority&appName=Swipe-Fit');
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);

  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};


// Function to buy clothes for a user
async function buyClothesForUser() {
  try {
    await connectDB();

    // Find the user by email
    const user = await User.findOne({ email: "saram.hassan1412@gmail.com" });
    if (!user) {
      throw new Error('User with email "faaizumer9@outlook.com" not found.');
    }

    // Select 10 unique uppers
    const uppers = await Clothes.aggregate([
      { $match: { upper: true } },
      { $group: { _id: '$name', doc: { $first: '$$ROOT' } } },
      { $replaceRoot: { newRoot: '$doc' } },
      { $sample: { size: 10 } }
    ]);
    if (uppers.length < 10) {
      throw new Error('Not enough unique upper garments available to purchase.');
    }

    // Select 10 unique lowers
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

    // Update the user's ownedProducts by adding the purchased clothes' ObjectIDs
    // We concatenate the new items with any existing ownedProducts.
    user.ownedProducts = user.ownedProducts.concat(purchasedClothes.map(item => item._id));

    await user.save();

    // Log the purchased items for confirmation
    purchasedClothes.forEach(item => {
    });
  } catch (error) {
    console.error('Error during purchase assignment:', error.message);
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
  }
}

buyClothesForUser();
