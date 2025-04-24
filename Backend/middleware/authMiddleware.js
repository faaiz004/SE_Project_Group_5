import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
<<<<<<< HEAD

=======
>>>>>>> 8daf48a405e3121c6672ac216edd4042645795bd
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('No token provided or invalid format.');
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
<<<<<<< HEAD

  const jwtToken = process.env.JWT_SECRET || 'yoursecretkey'

  if (!jwtToken) {
    console.error('JWT_SECRET is missing in environment variables.');
    return res.status(500).json({ error: 'Server configuration error.' });
  }

  try {
    const decoded = jwt.verify(token, jwtToken);
    req.user = { id: decoded.userId, email: decoded.email };  // Standardize
    next();
  } catch (err) {
    console.log('Token verification failed:', err.message);
    return res.status(403).json({ error: 'Invalid or expired token.' });
=======
  const jwtToken = process.env.JWT_SECRET || 'yoursecretkey'; // ensure JWT_SECRET is in your .env
  try {
    const decoded = jwt.verify(token, jwtToken); // ensure JWT_SECRET is in your .env
    req.user = decoded; // attach decoded user info to request
    next();
  } catch (err) {
    console.log('Token verification failed:', err);
    return res.status(403).json({ error: 'Invalid token.' });
>>>>>>> 8daf48a405e3121c6672ac216edd4042645795bd
  }
};
