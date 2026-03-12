const AccessRequest = require('../models/AccessRequest');
const { getCollection, addToCollection, updateInCollection } = require('../utils/mockDB');
const { getIsDBConnected } = require('../config/db');

// @desc    Get all access requests
// @route   GET /api/requests
// @access  Private
const getRequests = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const userRole = req.user.role;
    const userEmail = req.user.email;

    if (!getIsDBConnected()) {
      let requests = getCollection('requests');
      if (userRole === 'patient') {
        requests = requests.filter(r => r.patientEmail === userEmail);
      } else {
        requests = requests.filter(r => r.providerEmail === userEmail);
      }
      return res.json(requests);
    }

    let filter = {};
    if (userRole === 'patient') {
      filter = { patientEmail: userEmail };
    } else {
      filter = { providerEmail: userEmail };
    }
    
    const requests = await AccessRequest.find(filter);
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create an access request
// @route   POST /api/requests
// @access  Private
const createRequest = async (req, res) => {
  try {
    const { patientEmail, patientName } = req.body;
    const requestData = {
      providerName: req.user.name,
      providerEmail: req.user.email,
      patientName,
      patientEmail,
      requestDate: new Date().toISOString().split('T')[0],
      status: 'pending',
    };

    if (!getIsDBConnected()) {
      const request = addToCollection('requests', requestData);
      
      // Add activity log for patient
      addToCollection('activity', {
        email: patientEmail,
        action: "Access Requested",
        details: `${req.user.name} requested access to your documents`,
        type: "request",
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16)
      });

      return res.status(201).json(request);
    }

    const request = await AccessRequest.create(requestData);
    
    // Log activity
    const ActivityLog = require('../models/ActivityLog');
    await ActivityLog.create({
      userId: req.user._id, // uploader/provider logic might need refinement for patient email
      action: "Access Requested",
      details: `You requested access to ${patientName}'s documents`,
      type: "request",
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16)
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update request status
// @route   PUT /api/requests/:id
// @access  Private
const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 16);

    if (!getIsDBConnected()) {
      const updated = updateInCollection('requests', req.params.id, { status });
      if (updated) {
        // Log activity for both
        addToCollection('activity', {
          email: updated.patientEmail,
          action: `Request ${status === 'approved' ? 'Approved' : 'Denied'}`,
          details: `You ${status} access for ${updated.providerName}`,
          type: status === 'approved' ? "approval" : "denial",
          timestamp
        });
        return res.json(updated);
      }
      return res.status(404).json({ message: 'Request not found' });
    }

    const request = await AccessRequest.findById(req.params.id);

    if (request) {
      request.status = status;
      const updatedRequest = await request.save();
      
      const ActivityLog = require('../models/ActivityLog');
      await ActivityLog.create({
        userId: req.user._id,
        action: `Request ${status === 'approved' ? 'Approved' : 'Denied'}`,
        details: `You ${status} access for ${updatedRequest.providerName}`,
        type: status === 'approved' ? "approval" : "denial",
        timestamp
      });

      res.json(updatedRequest);
    } else {
      res.status(404).json({ message: 'Request not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getRequests,
  createRequest,
  updateRequestStatus,
};
