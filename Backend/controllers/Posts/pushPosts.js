// controllers/postController.js
import Post from '../../models/Post.js';
import User from '../../models/User.js';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from 'uuid';

<<<<<<< HEAD
=======
// AWS S3 client setup
>>>>>>> 8daf48a405e3121c6672ac216edd4042645795bd
const s3 = new S3Client({ region: process.env.AWS_REGION });

export const createPost = async (req, res) => {
  try {
<<<<<<< HEAD
    console.log("Received createPost request");
    console.log("Request body:", req.body);
    console.log("Uploaded file info:", req.file);
    
    const { caption, email } = req.body;

=======
    console.log("🔥 Received createPost request");
    console.log("📦 Request body:", req.body);
    console.log("📷 Uploaded file info:", req.file);
    
    const { caption, email } = req.body;

    // Parse the clothes field if provided (it should be a JSON string)
>>>>>>> 8daf48a405e3121c6672ac216edd4042645795bd
    let clothesArray = [];
    if (req.body.clothes) {
      try {
        clothesArray = JSON.parse(req.body.clothes);
        console.log("🛠️ Parsed clothes array:", clothesArray);
      } catch (err) {
        console.error("Error parsing clothes array:", err);
      }
    }

    if (!req.file || !caption || !email) {
<<<<<<< HEAD
      console.warn("Missing fields - image:", !req.file, "caption:", !caption, "email:", !email);
=======
      console.warn("⚠️ Missing fields - image:", !req.file, "caption:", !caption, "email:", !email);
>>>>>>> 8daf48a405e3121c6672ac216edd4042645795bd
      return res.status(400).json({ error: "Missing required fields: image, caption, or email." });
    }

    const user = await User.findOne({ email });
    if (!user) {
<<<<<<< HEAD
      console.warn("User not found with email:", email);
=======
      console.warn("❌ User not found with email:", email);
>>>>>>> 8daf48a405e3121c6672ac216edd4042645795bd
      return res.status(404).json({ error: "User not found with the provided email." });
    }

    const file = req.file;
    const extension = file.originalname.split('.').pop();
    const fileName = `posts/${uuidv4()}.${extension}`;
    console.log("📝 Uploading to S3 with key:", fileName);

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    });
    const s3Response = await s3.send(command);
<<<<<<< HEAD
    console.log("S3 upload successful:", s3Response);

    const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    console.log("Image URL:", imageUrl);
=======
    console.log("✅ S3 upload successful:", s3Response);

    const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    console.log("🌐 Image URL:", imageUrl);
>>>>>>> 8daf48a405e3121c6672ac216edd4042645795bd

    const newPost = await Post.create({
      imageUrl,
      caption,
      user: user._id,
<<<<<<< HEAD
      clothes: clothesArray, 
    });

    console.log("New post saved:", newPost);
    return res.status(201).json({ post: newPost });
  } catch (error) {
    console.error("Error creating post:", error);
=======
      clothes: clothesArray, // store the tagged clothes array
    });

    console.log("📤 New post saved:", newPost);
    return res.status(201).json({ post: newPost });
  } catch (error) {
    console.error("❌ Error creating post:", error);
>>>>>>> 8daf48a405e3121c6672ac216edd4042645795bd
    return res.status(500).json({ error: "Server error while creating post." });
  }
};
