const ActivityLog = require('../models/ActivityLog');
const { getCollection, addToCollection } = require('../utils/mockDB');
const { getIsDBConnected } = require('../config/db');

// @desc    Get all activity logs
// @route   GET /api/activity
// @access  Private
const getActivityLogs = async (req, res) => {
  try {
    const userEmail = req.user.email;
    const userId = req.user.id || req.user._id;

    if (!getIsDBConnected()) {
      const allLogs = getCollection('activity');
      // In mock mode, we look for logs associated with this user's email or userId
      const userLogs = allLogs.filter(log => log.email === userEmail || log.userId === userId);
      return res.json(userLogs);
    }

    const activityLogs = await ActivityLog.find({ 
      $or: [{ userId: req.user._id }, { email: userEmail }] 
    }).sort({ createdAt: -1 });
    
    res.json(activityLogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create an activity log
// @route   POST /api/activity
// @access  Private
const createActivityLog = async (req, res) => {
  try {
    const { action, details, type } = req.body;
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 16);

    const logData = {
      userId: req.user.id || req.user._id,
      email: req.user.email,
      action,
      details,
      type,
      timestamp: timestamp || new Date().toISOString().replace('T', ' ').slice(0, 16)
    };

    if (!getIsDBConnected()) {
      const log = addToCollection('activity', logData);
      return res.status(201).json(log);
    }

    const activityLog = await ActivityLog.create(logData);
    res.status(201).json(activityLog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getActivityLogs,
  createActivityLog,
};
