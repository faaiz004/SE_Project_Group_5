import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('No token provided or invalid format.');
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  const jwtToken = process.env.JWT_SECRET || 'yoursecretkey'; 
  try {
    const decoded = jwt.verify(token, jwtToken); 
    req.user = decoded; 
    next();
  } catch (err) {
    console.log('Token verification failed:', err);
    return res.status(403).json({ error: 'Invalid token.' });
  }
};
