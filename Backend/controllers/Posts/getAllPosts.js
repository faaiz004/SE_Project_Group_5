// controllers/posts/getAllPosts.js
import Post    from '../../models/Post.js';
import Clothes from '../../models/Clothes.js';      // to populate clothes
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
      .populate('user', 'email')      // only need email prefix client-side
      .populate('clothes')            // bring full clothes docs
      .sort({ createdAt: -1 });

    const result = await Promise.all(
      posts.map(async (p) => {
        const o = p.toObject();

        /* likes */
        o.likes             = o.likes.length;
        o.likedByCurrentUser = p.likes.some((id) => id.toString() === userId);

        /* post image needs signing (private) */
        if (o.imageUrl) {
          o.signedImageUrl = await sign(keyFromURL(o.imageUrl));
        }

        /* clothes: return same structure as getAllClothes (public imageUrl, no signing) */
        o.clothes = (o.clothes || []).map((c) => ({
          _id:      c._id,
          name:     c.name,
          brand:    c.brand,
          size:     c.size,
          category: c.category,
          price:    c.price,
          upper:    c.upper,
          lower:    c.lower,
          imageUrl: c.imageUrl           // already public
        }));

        return o;
      })
    );

    res.status(200).json({ posts: result });
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).json({ error: 'Server error retrieving posts.' });
  }
};
