// controllers/authController.js
import User from '../../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'yoursecretkey';
const SALT_ROUNDS = 10;

export const signup = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      gender,
      shirtSize,
      pantSize,
      weightClass,
      stylePreference,
    } = req.body;

    // Check if all required fields are present
    if (!email || !password || !gender || !shirtSize || !pantSize || !weightClass || !stylePreference) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      gender,
      shirtSize,
      pantSize,
      weightClass,
      stylePreference,
    });

    await newUser.save();

    // Generate JWT
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Send response with token
    return res.status(201).json({
      message: 'Signup successful',
      token, // You will store this in sessionStorage on the frontend
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};
