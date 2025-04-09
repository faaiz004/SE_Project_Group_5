import jwt from 'jsonwebtoken';
import User from '../../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'yoursecretkey';

export const submitPreferences = async (req, res) => {
  try {
    // Extract and verify token
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {

      console.log('Invalid token:', err);
      return res.status(401).json({ error: 'Invalid token' });
    }

  
    // Use decoded.id since JWT was signed with { id: user._id }
    const userId = decoded.id;

    const { gender, shirtSize, pantSize, stylePreference } = req.body;

    // Validate the necessary preference fields
    if (!gender || !shirtSize || !pantSize || !stylePreference) {
      return res.status(400).json({ error: 'Missing preference fields.' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        gender,
        shirtSize,
        pantSize,
        stylePreference,
      },
      { new: true }
    );

    return res.status(200).json({
      message: 'Preferences saved successfully',
      user: updatedUser,
    });
  } catch (err) {
    console.error('Preference submission error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};
