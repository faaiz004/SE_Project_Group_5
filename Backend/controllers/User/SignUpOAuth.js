// controllers/googleAuthController.js
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import User from '../../models/User.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const JWT_SECRET = process.env.JWT_SECRET || 'yoursecretkey';

export const googleAuth = async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }

  try {
    // Verify the token received from the frontend with Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const googleId = payload.sub;
    const email = payload.email;
    const name = payload.name;

    // Check if the user exists, or create a new one
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        username: name,  // Adjust as needed; you could also store googleId
        email,
        googleId,
      });
      await user.save();
    } else {
      // Optionally update user record if needed
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }
    }

    // Generate your own JWT token for further communication with your app
    const appToken = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.json({
      message: 'Google login successful',
      token: appToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Error verifying Google token:', error);
    return res.status(400).json({ error: 'Invalid token' });
  }
};
