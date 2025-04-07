// Backend/routes/googleAuth.js
import express from 'express';
import passport from 'passport';
import '../config/passport.js'; // Ensure the strategy is configured

const router = express.Router();

// Initiate Google OAuth login
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth callback URL
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/sign-in' }),
  (req, res) => {
    // Successful authentication, issue JWT and redirect to frontend
    const { token } = req.user;
    // Redirect to frontend with token as query param (or set as cookie)
    res.redirect(`http://localhost:3000/sign-in?token=${token}`);
  }
);

export default router;
