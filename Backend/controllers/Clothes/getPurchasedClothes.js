
import User from '../../models/User.js';
import Clothes from '../../models/clothes.js';
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// AWS S3 Client setup
const s3 = new S3Client({ region: process.env.AWS_REGION });

const generateSignedUrl = async (key) => {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
  });
  return await getSignedUrl(s3, command, { expiresIn: 3600 });
};

// Helper to extract key from full S3 URL
const extractKeyFromUrl = (url) => {
  const parts = url.split('.amazonaws.com/');
  return parts.length === 2 ? parts[1] : url;
};

// Get purchased clothes by email
export const getPurchasedClothes = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email }).populate('ownedProducts');
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const purchasedClothes = user.ownedProducts;

    const clothesWithSignedUrls = await Promise.all(
      purchasedClothes.map(async (item) => {
        const clothing = item.toObject();
        if (clothing.imageUrl) {
          const key = extractKeyFromUrl(clothing.imageUrl);
          clothing.signedImageUrl = await generateSignedUrl(key);
        }
        return {
          _id: clothing._id,
          name: clothing.name,
          signedImageUrl: clothing.signedImageUrl || null,
        };
      })
    );

    return res.status(200).json({ clothes: clothesWithSignedUrls });
  } catch (error) {
    console.error('Error fetching purchased clothes:', error);
    return res.status(500).json({ error: 'Server error.' });
  }
};
