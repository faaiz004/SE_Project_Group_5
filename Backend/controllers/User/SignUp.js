import User from '../../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const signup = async (req, res) => {
  const JWT_SECRET = process.env.JWT_SECRET
  const SALT_ROUNDS = 10;
  try {
    const { username, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '168h' }
    );

    return res.status(201).json({
      message: 'Signup successful',
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        preferencesCompleted: newUser.preferencesCompleted 
      },
    });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
};