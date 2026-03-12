const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getIsDBConnected } = require('../config/db');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');

      // Get user from token
      if (getIsDBConnected()) {
        req.user = await User.findById(decoded.id).select('-password');
      } else {
        // Mock fallback: assume user exists if token is valid
        // In real app, we'd look up in mockDB
        const { getCollection } = require('../utils/mockDB');
        const users = getCollection('users');
        req.user = users.find(u => u.id === decoded.id || u._id === decoded.id);
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
