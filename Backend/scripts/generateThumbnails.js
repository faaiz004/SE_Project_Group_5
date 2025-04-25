// scripts/generateClothesThumbnails.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import Clothes from "../models/clothes.js";  // adjust path if needed

dotenv.config();

const {
  AWS_REGION,
  AWS_BUCKET_NAME,
  MONGO_URI,
} = process.env;

if (!AWS_REGION || !AWS_BUCKET_NAME || !MONGO_URI) {
  console.error("Missing AWS_REGION, AWS_BUCKET_NAME or MONGO_URI in .env");
  process.exit(1);
}

const s3 = new S3Client({ region: AWS_REGION });

// Extract S3 key from a full URL
function extractKeyFromUrl(url) {
  const parts = url.split(".amazonaws.com/");
  return parts.length === 2 ? parts[1] : url;
}

// Download an object from S3 into a Buffer
async function downloadBuffer(key) {
  const { Body } = await s3.send(
    new GetObjectCommand({ Bucket: AWS_BUCKET_NAME, Key: key })
  );
  return new Promise((resolve, reject) => {
    const chunks = [];
    Body.on("data", (chunk) => chunks.push(chunk));
    Body.on("end", () => resolve(Buffer.concat(chunks)));
    Body.on("error", reject);
  });
}

// Upload a Buffer to S3 under thumbnails/, using bucket policy for public-read
async function uploadThumbnail(key, buffer, contentType) {
  const thumbKey = `thumbnails/${key}`;
  await s3.send(
    new PutObjectCommand({
      Bucket: AWS_BUCKET_NAME,
      Key: thumbKey,
      Body: buffer,
      ContentType: contentType,
      // no ACL needed; bucket policy grants public-read on thumbnails/*
    })
  );
  return thumbKey;
}

async function main() {
  await mongoose.connect(MONGO_URI);
  console.log("🟢 Connected to MongoDB");

  const clothes = await Clothes.find().lean();
  console.log(`🔍 Found ${clothes.length} clothes documents`);

  for (const item of clothes) {
    if (!item.imageUrl) continue;

    try {
      const key = extractKeyFromUrl(item.imageUrl);
      console.log(`→ Processing ${item._id} (key: ${key})`);

      // Download original image (no resizing)
      const buffer = await downloadBuffer(key);

      // Infer Content-Type
      const ext = key.split(".").pop().toLowerCase();
      const contentType =
        ext === "png" ? "image/png" : "image/jpeg";

      // Upload original buffer to thumbnails/ folder
      const thumbKey = await uploadThumbnail(
        key,
        buffer,
        contentType
      );

      // Build public URL
      const thumbnailUrl = `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${thumbKey}`;

      // Update the Clothes document
      await Clothes.updateOne(
        { _id: item._id },
        { $set: { imageUrl: thumbnailUrl } }
      );

      console.log(
        `✅ Updated ${item._id} → ${thumbnailUrl}`
      );
    } catch (err) {
      console.error(
        `❌ Failed ${item._id}: ${err.message}`
      );
    }
  }

  await mongoose.disconnect();
  console.log("🔴 Disconnected from MongoDB");
}

main().catch((err) => {
  console.error("💥 Fatal error:", err);
  process.exit(1);
});
