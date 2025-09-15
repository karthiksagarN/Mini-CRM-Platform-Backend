const express = require('express');
const passport = require('passport');
const authController = require('../controllers/authController');

const router = express.Router();

// Route to initiate Google authentication
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// The callback route after Google has authenticated the user
router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: '/api/auth/failure',
  }),
  authController.handleGoogleCallback
);

// Route for failed authentication
router.get('/failure', (req, res) => {
  res.status(401).json({ error: 'Authentication Failed' });
});

module.exports = router;
