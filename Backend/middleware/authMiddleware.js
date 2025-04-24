import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {

  const authHeader = req.headers.authorization;
  console.log('Authorization Header:', authHeader);

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('No token provided or invalid format.');
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }



  const token = authHeader.split(' ')[1];

  const jwtToken = process.env.JWT_SECRET || 'yoursecretkey'

  console.log('JWT Token:', jwtToken);

  if (!jwtToken) {
    console.error('JWT_SECRET is missing in environment variables.');
    return res.status(403).json({ error: 'Invalid or expired token.' });
  }

  try {
    const decoded = jwt.verify(token, jwtToken);
    req.user = { id: decoded.userId, email: decoded.email };  // Standardize
    next();
  } catch (err) {
    console.log('Token verification failed:', err.message);
    return res.status(403).json({ error: 'Invalid or expired token.' });
  }
};
