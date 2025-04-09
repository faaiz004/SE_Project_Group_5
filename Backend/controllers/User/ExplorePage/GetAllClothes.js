import Clothes from "../../../models/clothes.js";

import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// AWS S3 Client setup
const s3 = new S3Client({ region: process.env.AWS_REGION });

// Generate a signed URL for a given S3 key
const generateSignedUrl = async (key) => {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
  });
  return await getSignedUrl(s3, command, { expiresIn: 3600 }); // URL valid for 1 hour
};

// Helper to extract the S3 key from the full URL stored in MongoDB
const extractKeyFromUrl = (url) => {
  const parts = url.split('.amazonaws.com/');
  return parts.length === 2 ? parts[1] : url;
};

// Controller to fetch all clothes with signed URLs for ExplorePage
export const getAllClothes = async (req, res) => {
  try {
    // Optionally, you can filter by category if needed using req.query.category
    const filter = req.query.category ? { category: req.query.category } : {};

    const clothesItems = await Clothes.find(filter);

    const clothesWithSignedUrls = await Promise.all(
      clothesItems.map(async (item) => {
        let signedUrl = null;
        if (item.imageUrl) {
          const key = extractKeyFromUrl(item.imageUrl);
          signedUrl = await generateSignedUrl(key);
        }
        return {
          _id: item._id,
          name: item.name,
          brand: item.brand,
          size: item.size,
          category: item.category,
          price: item.price,
          signedImageUrl: signedUrl,
          upper: item.upper,
            lower: item.lower,
        };
      })
    );

    res.status(200).json(clothesWithSignedUrls);
  } catch (error) {
    console.error("Error fetching clothes:", error);
    res.status(500).json({ error: "Server error." });
  }
};