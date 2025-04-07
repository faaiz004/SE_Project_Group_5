import express from 'express';
import multer from 'multer';
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// AWS S3 config
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route: /api/upload-image
router.post('/upload-image', upload.single('image'), async (req, res) => {
  try {
    const file = req.file;
    const s3Params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `posts/${uuidv4()}_${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    };

    const uploadResult = await s3.upload(s3Params).promise();
    res.status(200).json({ imageUrl: uploadResult.Location });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

export default router;
