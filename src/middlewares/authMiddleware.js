const authService = require('../services/authService');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing Authorization' });
    }
    const token = auth.split(' ')[1];
    const payload = authService.verifyJWT(token);
    if (!payload || !payload.sub) return res.status(401).json({ error: 'Invalid token' });
    const user = await User.findById(payload.sub);
    if (!user) return res.status(401).json({ error: 'User not found' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized', detail: err.message });
  }
};
