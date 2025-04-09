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



async function runMigration() {
  try {
    // Use your existing connection function to connect to MongoDB
    await connectDB();

    // 1. Delete documents whose name does not start with "SF_"
    const deleteResult = await Clothes.deleteMany({ name: { $not: /^SF_/ } });
    console.log(`Deleted ${deleteResult.deletedCount} documents that did not match the naming pattern.`);

    // 2. Fetch all remaining documents.
    const clothesItems = await Clothes.find({});
    console.log(`Found ${clothesItems.length} documents to process.`);

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
        // Lower garment: set the lower flag to true and upper to false.
        item.lower = true;
        item.upper = false;

        // Optionally update the category field based on the code.
        // if (code === 'JN') {
        //   item.category = 'Jeans';
        // } else if (code === 'PT') {
        //   item.category = 'Pants';
        // } else if (code === 'SR') {
        //   item.category = 'Shorts';
        // }
      } else {
        // Otherwise, it's an upper garment.
        item.upper = true;
        item.lower = false;
      }

      // 3. Adjust the size to only S, M, or L.
      // Convert "XS" -> "S", and "XL" or "XXL" -> "L".
      if (item.size === 'XS') {
        item.size = 'S';
      } else if (item.size === 'XL' || item.size === 'XXL') {
        item.size = 'L';
      }

      // Save the updated document.
      await item.save();
    }

    console.log('Migration complete');
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    // Disconnect from the database.
    await mongoose.disconnect();
  }
}

runMigration();
