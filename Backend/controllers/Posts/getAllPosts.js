import Post from '../../models/Post.js';
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

<<<<<<< HEAD
=======
// Initialize AWS S3 client
>>>>>>> 8daf48a405e3121c6672ac216edd4042645795bd
const s3 = new S3Client({ region: process.env.AWS_REGION });

// Helper to generate a signed URL for a given S3 object key
const generateSignedUrl = async (key) => {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
  });
  return await getSignedUrl(s3, command, { expiresIn: 3600 });
};

<<<<<<< HEAD
=======
// Helper to extract the S3 object key from a full image URL
>>>>>>> 8daf48a405e3121c6672ac216edd4042645795bd
const extractKeyFromUrl = (url) => {
  const parts = url.split('.amazonaws.com/');
  return parts.length === 2 ? parts[1] : url;
};

// Controller to retrieve all posts with a signed image URL
<<<<<<< HEAD
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "username email") 
      .sort({ createdAt: -1 });

=======
export const getPosts = async (req, res) => {
  try {
    // Retrieve all posts, optionally populate user data
    const posts = await Post.find()
      .populate("user", "username email") // adjust fields as needed
      .sort({ createdAt: -1 });

    // For each post, generate a signed URL for the image
>>>>>>> 8daf48a405e3121c6672ac216edd4042645795bd
    const postsWithSignedUrl = await Promise.all(
      posts.map(async (post) => {
        const postObj = post.toObject();
        if (postObj.imageUrl) {
          const key = extractKeyFromUrl(postObj.imageUrl);
          postObj.signedImageUrl = await generateSignedUrl(key);
        }
        return postObj;
      })
    );

    return res.status(200).json({ posts: postsWithSignedUrl });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return res.status(500).json({ error: "Server error retrieving posts." });
  }
};
