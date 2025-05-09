import Post from '../../models/Post.js';
import User from '../../models/User.js';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from 'uuid';

const s3 = new S3Client({ region: process.env.AWS_REGION });

export const createPost = async (req, res) => {
  try {

    
    const { caption, email } = req.body;

    let clothesArray = [];
    if (req.body.clothes) {
      try {
        clothesArray = JSON.parse(req.body.clothes);
      } catch (err) {
      }
    }

    if (!req.file || !caption || !email) {
      return res.status(400).json({ error: "Missing required fields: image, caption, or email." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found with the provided email." });
    }

    const file = req.file;
    const extension = file.originalname.split('.').pop();
    const fileName = `posts/${uuidv4()}.${extension}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    });
    const s3Response = await s3.send(command);

    const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

    const newPost = await Post.create({
      imageUrl,
      caption,
      user: user._id,
      clothes: clothesArray, 
    });

    return res.status(201).json({ post: newPost });
  } catch (error) {
    return res.status(500).json({ error: "Server error while creating post." });
  }
};
