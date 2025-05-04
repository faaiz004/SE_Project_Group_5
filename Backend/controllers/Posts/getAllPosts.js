import Post    from '../../models/Post.js';
import Clothes from '../../models/clothes.js';      
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3 = new S3Client({ region: process.env.AWS_REGION });
const sign = (key) =>
  getSignedUrl(
    s3,
    new GetObjectCommand({ Bucket: process.env.AWS_BUCKET_NAME, Key: key }),
    { expiresIn: 3600 }
  );
const keyFromURL = (url) => {
  const i = url.indexOf('.amazonaws.com/');
  return i === -1 ? url : url.slice(i + 15);
};

export const getAllPosts = async (req, res) => {
  try {
    const userId = req.user.id;

    const posts = await Post.find()
      .populate('user', 'email')      
      .populate('clothes')            
      .sort({ createdAt: -1 });

    const result = await Promise.all(
      posts.map(async (p) => {
        const o = p.toObject();

        o.likes             = o.likes.length;
        o.likedByCurrentUser = p.likes.some((id) => id.toString() === userId);

        if (o.imageUrl) {
          o.signedImageUrl = await sign(keyFromURL(o.imageUrl));
        }

        o.clothes = (o.clothes || []).map((c) => ({
          _id:      c._id,
          name:     c.name,
          brand:    c.brand,
          size:     c.size,
          category: c.category,
          price:    c.price,
          upper:    c.upper,
          lower:    c.lower,
          imageUrl: c.imageUrl           
        }));

        return o;
      })
    );

    res.status(200).json({ posts: result });
  } catch (err) {
    res.status(500).json({ error: 'Server error retrieving posts.' });
  }
};
