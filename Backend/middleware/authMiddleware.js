import jwt from 'jsonwebtoken';


// Verify token
export const verifyToken = (req, res, next) => {

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }



  const token = authHeader.split(' ')[1];

  const jwtToken = process.env.JWT_SECRET 


  if (!jwtToken) {
    console.error('JWT_SECRET is missing in environment variables.');
    return res.status(403).json({ error: 'Invalid or expired token.' });
  }

  try {
    const decoded = jwt.verify(token, jwtToken);
    req.user = { id: decoded.userId, email: decoded.email };  // Standardize
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token.' });
  }
};
