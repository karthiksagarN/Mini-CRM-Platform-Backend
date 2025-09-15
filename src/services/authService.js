const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_EXPIRES_IN = '7d';

exports.findOrCreateFromGoogle = async (profile) => {
  const googleId = profile.id;
  const email = (profile.emails && profile.emails[0] && profile.emails[0].value) || null;
  const name = (profile.displayName) || '';

  let user = await User.findOne({ googleId });
  if (!user && email) {
    user = await User.findOne({ email });
  }

  if (user) {
    user.googleId = user.googleId || googleId;
    user.name = user.name || name;
    user.email = user.email || email;
    await user.save();
    return user;
  }

  const newUser = new User({ googleId, email, name });
  await newUser.save();
  return newUser;
};

exports.generateJWT = (user) => {
  const payload = {
    sub: user._id,
    name: user.name,
    email: user.email
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

exports.verifyJWT = (token) => {
  return jwt.verify(token, JWT_SECRET);
};
