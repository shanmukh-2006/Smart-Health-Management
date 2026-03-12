const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { getCollection, addToCollection } = require('../utils/mockDB');
const { getIsDBConnected } = require('../config/db');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!getIsDBConnected()) {
      // MockDB doesn't have hooks, so we'd normally hash here, but for simplicity:
      const user = addToCollection('users', { name, email, password, role });
      return res.status(201).json({
        ...user,
        token: generateToken(user.id),
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    if (user) {
      res.status(201).json({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate a user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!getIsDBConnected()) {
      const users = getCollection('users');
      const user = users.find((u) => u.email === email);
      
      // In mock mode, we just check plain text for simplicity or assume it works
      if (user && (user.password === password)) {
        return res.json({
          id: user.id || user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: generateToken(user.id || user._id),
        });
      } else {
        return res.status(401).json({ message: 'Invalid Credentials!' });
      }
    }

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Public
const getUsers = async (req, res) => {
  try {
    if (!getIsDBConnected()) {
      return res.json(getCollection('users'));
    }
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUsers,
};
