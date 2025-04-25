import mongoose from 'mongoose';
import Clothes from '../models/clothes.js';


const connectDB = async () => {
  try {

    const conn = await mongoose.connect('mongodb+srv://mshafaytanveer67j:12345@swipe-fit.hsaprtd.mongodb.net/?retryWrites=true&w=majority&appName=Swipe-Fit');
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);

  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};


// Function to run the migration
async function runMigration() {
  try {
    await connectDB();

    // 1. Delete documents whose name does not start with "SF_"
    const deleteResult = await Clothes.deleteMany({ name: { $not: /^SF_/ } });

    // 2. Fetch all remaining documents.
    const clothesItems = await Clothes.find({});

    for (const item of clothesItems) {
      // Expecting names of the form "SF_<code>_<someNumber>"
      const parts = item.name.split('_');
      if (parts.length < 3) {
        console.warn(`Skipping unexpected name format: ${item.name}`);
        continue;
      }

      const code = parts[1];
      // Determine if it's a lower garment.
      if (['JN', 'PT', 'SR'].includes(code)) {
        item.lower = true;
        item.upper = false;
      } else {
        item.upper = true;
        item.lower = false;
      }


      if (item.size === 'XS') {
        item.size = 'S';
      } else if (item.size === 'XL' || item.size === 'XXL') {
        item.size = 'L';
      }

      await item.save();
    }

  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    // Disconnect from the database.
    await mongoose.disconnect();
  }
}

runMigration();
