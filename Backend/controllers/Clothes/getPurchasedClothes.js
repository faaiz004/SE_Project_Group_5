import User    from '../../models/User.js';
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({ region: process.env.AWS_REGION });

const genSigned = (key) =>
  getSignedUrl(
    s3,
    new GetObjectCommand({ Bucket: process.env.AWS_BUCKET_NAME, Key: key }),
    { expiresIn: 3600 }
  );

const keyFromURL = (url) => {
  const i = url.indexOf('.amazonaws.com/');
  return i === -1 ? url : url.slice(i + 15);
};

export const getPurchasedClothes = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email }).populate('ownedProducts');
    if (!user) return res.status(404).json({ error: 'User not found.' });

    const clothes = await Promise.all(
      user.ownedProducts.map(async (c) => {
        const obj = c.toObject();
        obj.signedImageUrl = await genSigned(keyFromURL(obj.imageUrl));
        return {
          _id:   obj._id,
          name:  obj.name,
          upper: obj.upper,
          lower: obj.lower,
          brand: obj.brand,
          size:  obj.size,
          price: obj.price,
          signedImageUrl: obj.signedImageUrl,
        };
      })
    );

    return res.status(200).json({ clothes });         
  } catch (err) {
    console.error('Error fetching purchased clothes:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};
