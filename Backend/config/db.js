import mongoose from 'mongoose';

const connectDB = async () => {
  try {

    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);

  } catch (error) {
<<<<<<< HEAD
    console.error(`MongoDB connection error: ${error.message}`);
    console.error(`MongoDB connection error: ${error.message}`);
=======
    console.error(`❌ MongoDB connection error: ${error.message}`);
    console.error(`❌ MongoDB connection error: ${error.message}`);
>>>>>>> 8daf48a405e3121c6672ac216edd4042645795bd
    process.exit(1);
  }
};

export default connectDB;
