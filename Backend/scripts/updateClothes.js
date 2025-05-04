import mongoose from 'mongoose';
import Clothes from '../models/clothes.js';


const connectDB = async () => {
  try {

    const conn = await mongoose.connect('mongodb+srv://mshafaytanveer67j:12345@swipe-fit.hsaprtd.mongodb.net/?retryWrites=true&w=majority&appName=Swipe-Fit');

  } catch (error) {
    process.exit(1);
  }
};

async function runMigration() {
  try {
    await connectDB();

    const deleteResult = await Clothes.deleteMany({ name: { $not: /^SF_/ } });

    const clothesItems = await Clothes.find({});

    for (const item of clothesItems) {
      const parts = item.name.split('_');
      if (parts.length < 3) {
        continue;
      }

      const code = parts[1];
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
  } finally {
    await mongoose.disconnect();
  }
}

runMigration();
