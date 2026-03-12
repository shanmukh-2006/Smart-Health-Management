const express = require('express');
const router = express.Router();
const { getActivityLogs, createActivityLog } = require('../controllers/activityController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getActivityLogs).post(protect, createActivityLog);

module.exports = router;
