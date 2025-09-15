// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const User = require('../models/User');
// const authService = require('../services/authService');

// const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
// const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
// const CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL;

// if (CLIENT_ID && CLIENT_SECRET) {
//   passport.use(
//     new GoogleStrategy(
//       {
//         clientID: CLIENT_ID,
//         clientSecret: CLIENT_SECRET,
//         callbackURL: CALLBACK_URL
//       },
//       async (accessToken, refreshToken, profile, done) => {
//         try {
//           const user = await authService.findOrCreateFromGoogle(profile);
//           return done(null, user);
//         } catch (err) {
//           return done(err, null);
//         }
//       }
//     )
//   );
// }

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const authService = require('../services/authService');
const User = require('../models/User');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback', // Must match Google Console URI
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await authService.findOrCreateFromGoogle(profile);
        return done(null, user); // The user object is attached to req.user
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
