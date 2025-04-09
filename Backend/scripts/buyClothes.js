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


async function buyClothesForUser() {
  try {
    // Connect to the database
    await connectDB();

    // Find the user by email
    const user = await User.findOne({ email: "faaizumer9@outlook.com" });
    if (!user) {
      throw new Error('User with email "faaizumer9@outlook.com" not found.');
    }

    // --------------------------------------------------
    // Select 10 unique uppers
    const uppers = await Clothes.aggregate([
      { $match: { upper: true } },
      // Group by name to ensure uniqueness
      { $group: { _id: '$name', doc: { $first: '$$ROOT' } } },
      { $replaceRoot: { newRoot: '$doc' } },
      // Randomly sample 10 documents
      { $sample: { size: 10 } }
    ]);
    if (uppers.length < 10) {
      throw new Error('Not enough unique upper garments available to purchase.');
    }

    // --------------------------------------------------
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

    // Combine the selected garments into one array
    const purchasedClothes = [...uppers, ...lowers];

    // --------------------------------------------------
    // Update the user's ownedProducts by adding the purchased clothes' ObjectIDs
    // We concatenate the new items with any existing ownedProducts.
    user.ownedProducts = user.ownedProducts.concat(purchasedClothes.map(item => item._id));

    // Save the updated user document
    await user.save();

    // Log the purchased items for confirmation
    console.log('Purchased 20 unique clothes for user:');
    purchasedClothes.forEach(item => {
      console.log(`${item.name} - ${item.category} - ${item.size} - ID: ${item._id}`);
    });
  } catch (error) {
    console.error('Error during purchase assignment:', error.message);
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

buyClothesForUser();
