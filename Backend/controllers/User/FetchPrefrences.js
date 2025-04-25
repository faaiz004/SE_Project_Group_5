import jwt from 'jsonwebtoken';
import User from '../../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'yoursecretkey';

export const fetchPreferences = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }
    const token = authHeader.split(' ')[1];
    let decoded;
    try { decoded = jwt.verify(token, JWT_SECRET); }
    catch (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // select stylePreference as well
    const user = await User
      .findById(decoded.userId)
      .select('gender shirtSize pantSize stylePreference');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({
      message: 'Preferences fetched successfully',
      preferences: {
        gender:          user.gender,
        shirtSize:       user.shirtSize,
        pantSize:        user.pantSize,
        stylePreference: user.stylePreference
      }
    });
  } catch (err) {
    console.error('Fetch preferences error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

export const updatePreferences = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }
    const token = authHeader.split(' ')[1];
    let decoded;
    try { decoded = jwt.verify(token, JWT_SECRET); }
    catch (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { gender, shirtSize, pantSize, stylePreference } = req.body;
    if (!gender || !shirtSize || !pantSize || !stylePreference) {
      return res.status(400).json({ error: 'Missing preference fields.' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      decoded.userId,
      { gender, shirtSize, pantSize, stylePreference },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({
      message: 'Preferences updated successfully',
      preferences: {
        gender:          updatedUser.gender,
        shirtSize:       updatedUser.shirtSize,
        pantSize:        updatedUser.pantSize,
        stylePreference: updatedUser.stylePreference
      }
    });
  } catch (err) {
    console.error('Update preferences error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};