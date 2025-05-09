import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import User from '../../models/User.js';

export const googleAuth = async (req, res) => {
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  const JWT_SECRET = process.env.JWT_SECRET 
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const googleId = payload.sub;
    const email = payload.email;
    const name = payload.name;

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        username: name, 
        email,
        googleId,
      });
      await user.save();
    } else {
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }
    }

    const appToken = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '168h' } 
    );

    return res.json({
      message: 'Google login successful',
      token: appToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        preferencesCompleted: user.preferencesCompleted,
      },
    });
  } catch (error) {
    return res.status(400).json({ error: 'Invalid token' });
  }
};
