// googleAuth.js (Backend route for Google authentication)

import express from 'express';
import { OAuth2Client } from 'google-auth-library';

const router = express.Router();

// Initialize Google OAuth2 client with your client ID
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// POST route to handle the token sent from the frontend
router.post('/google', async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }

  try {
    // Verify the token with Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,  // Your Google Client ID
    });

    // Get the user's info from the payload
    const payload = ticket.getPayload();
    const userId = payload.sub;  // Google user ID
    const email = payload.email;
    const name = payload.name;

    // Here, you can create or update a user in your database
    // For now, just send the user info as a response
    return res.json({ userId, email, name });

  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(400).json({ error: 'Invalid token' });
  }
});

export default router;
