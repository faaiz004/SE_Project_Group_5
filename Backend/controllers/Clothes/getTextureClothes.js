import Texture from '../../models/textures.js';
import Clothes from '../../models/clothes.js'; 
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({ region: process.env.AWS_REGION });

const generateSignedUrl = async (key) => {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
  });

  const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
  return signedUrl;
};

const extractKeyFromUrl = (url) => {
  const parts = url.split('.amazonaws.com/');
  return parts.length === 2 ? parts[1] : url;
};

export const getTextureByName = async (req, res) => {
  try {
    const { name } = req.params;

    const texture = await Texture.findOne({ name });
    if (!texture) {
      return res.status(404).json({ error: 'Texture not found.' });
    }

    const clothingName = name.replace(/_texture$/, '');
    const clothingItem = await Clothes.findOne({ name: clothingName });
    const key = extractKeyFromUrl(texture.imageUrl);
    const signedImageUrl = await generateSignedUrl(key);

    return res.status(200).json({
      _id: texture._id,
      name: texture.name,
      category: texture.category,
      signedUrl: signedImageUrl,
      upper: clothingItem.upper,
    });
  } catch (err) {
    console.error('Error fetching texture by name:', err);
    return res.status(500).json({ error: 'Server error.' });
  }
};
