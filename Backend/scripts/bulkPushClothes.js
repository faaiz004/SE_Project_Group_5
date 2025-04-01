import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import Clothes from '../models/clothes.js';

dotenv.config();

// Compute __dirname for ES modules
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Set up the S3 client using credentials and region from your .env file
const s3 = new S3Client({
  region: process.env.AWS_REGION, // e.g., 'ap-southeast-2'
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Array of clothes data with proper relative paths to your image assets.
const clothesData = [
  {
    name: "Formal Suit",
    brand: "Armani",
    size: "M",
    category: "Formal",
    price: 299.99,
    imagePath: path.join(__dirname, '../assets/ExplorePage/testimage1.png'),
  },
  {
    name: "Formal Shirt",
    brand: "Hugo Boss",
    size: "L",
    category: "Formal",
    price: 79.99,
    imagePath: path.join(__dirname, '../assets/ExplorePage/testimage2.png'),
  },
  {
    name: "Vintage Jacket",
    brand: "Levi's",
    size: "M",
    category: "Vintage",
    price: 129.99,
    imagePath: path.join(__dirname, '../assets/ExplorePage/testimage3.png'),
  },
  {
    name: "Vintage Jeans",
    brand: "Wrangler",
    size: "L",
    category: "Vintage",
    price: 89.99,
    imagePath: path.join(__dirname, '../assets/ExplorePage/testimage4.png'),
  },
  {
    name: "Formal Suit (1)",
    brand: "Armani",
    size: "S",
    category: "Formal",
    price: 279.99,
    imagePath: path.join(__dirname, '../assets/ExplorePage/testimage1.png'),
  },
  {
    name: "Formal Shirt (1)",
    brand: "Hugo Boss",
    size: "M",
    category: "Formal",
    price: 74.99,
    imagePath: path.join(__dirname, '../assets/ExplorePage/testimage2.png'),
  },
  {
    name: "Vintage Jacket (1)",
    brand: "Levi's",
    size: "L",
    category: "Vintage",
    price: 139.99,
    imagePath: path.join(__dirname, '../assets/ExplorePage/testimage3.png'),
  },
  {
    name: "Vintage Jeans (1)",
    brand: "Wrangler",
    size: "S",
    category: "Vintage",
    price: 84.99,
    imagePath: path.join(__dirname, '../assets/ExplorePage/testimage4.png'),
  },
  {
    name: "Formal Suit (2)",
    brand: "Armani",
    size: "XL",
    category: "Formal",
    price: 289.99,
    imagePath: path.join(__dirname, '../assets/ExplorePage/testimage1.png'),
  },
  {
    name: "Formal Shirt (2)",
    brand: "Hugo Boss",
    size: "M",
    category: "Formal",
    price: 69.99,
    imagePath: path.join(__dirname, '../assets/ExplorePage/testimage2.png'),
  },
  {
    name: "Vintage Jacket (2)",
    brand: "Levi's",
    size: "M",
    category: "Vintage",
    price: 124.99,
    imagePath: path.join(__dirname, '../assets/ExplorePage/testimage3.png'),
  },
  {
    name: "Vintage Jeans (2)",
    brand: "Wrangler",
    size: "XL",
    category: "Vintage",
    price: 94.99,
    imagePath: path.join(__dirname, '../assets/ExplorePage/testimage4.png'),
  },
  {
    name: "Formal Suit (3)",
    brand: "Armani",
    size: "M",
    category: "Formal",
    price: 305.99,
    imagePath: path.join(__dirname, '../assets/ExplorePage/testimage1.png'),
  },
  {
    name: "Formal Shirt (3)",
    brand: "Hugo Boss",
    size: "S",
    category: "Formal",
    price: 89.99,
    imagePath: path.join(__dirname, '../assets/ExplorePage/testimage2.png'),
  },
  {
    name: "Vintage Jacket (3)",
    brand: "Levi's",
    size: "L",
    category: "Vintage",
    price: 134.99,
    imagePath: path.join(__dirname, '../assets/ExplorePage/testimage3.png'),
  },
  {
    name: "Vintage Jeans (3)",
    brand: "Wrangler",
    size: "M",
    category: "Vintage",
    price: 99.99,
    imagePath: path.join(__dirname, '../assets/ExplorePage/testimage4.png'),
  }
];

// Helper function: Upload a local image file to AWS S3
const uploadImageToS3 = async (filePath) => {
  try {
    // Read the file as a Buffer
    const fileBuffer = fs.readFileSync(filePath);
    const fileExtension = path.extname(filePath);
    // Generate a unique S3 key for the file
    const key = `clothes/${uuidv4()}${fileExtension}`;

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME, // Your S3 bucket name
      Key: key,
      Body: fileBuffer,
      ContentType: 'image/png', // Adjust if you have different file types
    //   ACL: 'public-read', // Make the file publicly accessible
    };

    // Upload the file to S3
    await s3.send(new PutObjectCommand(params));

    // Construct and return the public URL of the uploaded image
    return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  } catch (error) {
    console.error("Error uploading image to S3:", error);
    throw error;
  }
};

// Main function to bulk push clothes data
const bulkPushClothes = async () => {
  try {
    // Connect to MongoDB (options no longer needed in Mongoose v6+)
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Process each clothing item
    const clothesToInsert = [];
    for (const item of clothesData) {
      // Upload image and get the public URL from S3
      const imageUrl = await uploadImageToS3(item.imagePath);
      
      // Create a clothing item object matching the Clothes model
      const newClothes = {
        name: item.name,
        brand: item.brand,
        size: item.size,
        category: item.category,
        price: item.price,
        imageUrl: imageUrl,
      };
      clothesToInsert.push(newClothes);
    }

    // Bulk insert the clothing items into MongoDB
    const insertedDocs = await Clothes.insertMany(clothesToInsert);
    console.log("✅ Bulk insert successful:", insertedDocs);
    process.exit(0);
  } catch (error) {
    console.error("❌ Bulk insert error:", error);
    process.exit(1);
  }
};

bulkPushClothes();
