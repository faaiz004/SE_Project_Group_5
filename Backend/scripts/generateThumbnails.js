import mongoose from "mongoose";
import dotenv from "dotenv";
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import Clothes from "../models/clothes.js";  

dotenv.config();

const {
  AWS_REGION,
  AWS_BUCKET_NAME,
  MONGO_URI,
} = process.env;

if (!AWS_REGION || !AWS_BUCKET_NAME || !MONGO_URI) {
  process.exit(1);
}

const s3 = new S3Client({ region: AWS_REGION });

function extractKeyFromUrl(url) {
  const parts = url.split(".amazonaws.com/");
  return parts.length === 2 ? parts[1] : url;
}

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

async function uploadThumbnail(key, buffer, contentType) {
  const thumbKey = `thumbnails/${key}`;
  await s3.send(
    new PutObjectCommand({
      Bucket: AWS_BUCKET_NAME,
      Key: thumbKey,
      Body: buffer,
      ContentType: contentType,
    })
  );
  return thumbKey;
}

async function main() {
  await mongoose.connect(MONGO_URI);

  const clothes = await Clothes.find().lean();

  for (const item of clothes) {
    if (!item.imageUrl) continue;

    try {
      const key = extractKeyFromUrl(item.imageUrl);

      const buffer = await downloadBuffer(key);

      const ext = key.split(".").pop().toLowerCase();
      const contentType =
        ext === "png" ? "image/png" : "image/jpeg";

      const thumbKey = await uploadThumbnail(
        key,
        buffer,
        contentType
      );

      const thumbnailUrl = `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${thumbKey}`;

      await Clothes.updateOne(
        { _id: item._id },
        { $set: { imageUrl: thumbnailUrl } }
      );

    } catch (err) {
    }
  }

  await mongoose.disconnect();
}

main().catch((err) => {
  process.exit(1);
});
