const Document = require('../models/Document');
const AccessRequest = require('../models/AccessRequest');
const { getCollection, addToCollection } = require('../utils/mockDB');
const { getIsDBConnected } = require('../config/db');

// @desc    Get all documents
// @route   GET /api/documents
// @access  Private
const getDocuments = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const userRole = req.user.role;

    if (!getIsDBConnected()) {
      let docs = getCollection('documents');
      
      if (userRole === 'patient') {
        // Patient sees their own docs
        docs = docs.filter(d => d.userId === userId);
      } else {
        // Provider sees docs of patients who approved them
        const requests = getCollection('requests');
        const approvedPatients = requests
          .filter(r => r.providerEmail === req.user.email && r.status === 'approved')
          .map(r => r.patientEmail);
        
        docs = docs.filter(d => approvedPatients.includes(d.uploaderEmail));
      }
      return res.json(docs);
    }

    let filter = {};
    if (userRole === 'patient') {
      filter = { userId };
    } else {
      // Find all approved requests for this provider
      const approvedRequests = await AccessRequest.find({
        providerEmail: req.user.email,
        status: 'approved'
      });
      const patientEmails = approvedRequests.map(r => r.patientEmail);
      filter = { uploaderEmail: { $in: patientEmails } };
    }

    const documents = await Document.find(filter);
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload a document
// @route   POST /api/documents
// @access  Private
const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { fileName: originalName, type: providedType } = req.body;
    const fileName = originalName || req.file.originalname;
    const fileSize = (req.file.size / (1024 * 1024)).toFixed(2) + ' MB';
    const fileType = providedType || (req.file.mimetype.includes('pdf') ? 'PDF' : 'Medical Image');
    const uploadDate = new Date().toISOString().split('T')[0];
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 16);
    
    // Construct the file data
    const fileData = {
      userId: req.user.id || req.user._id,
      uploaderName: req.user.name,
      uploaderEmail: req.user.email,
      fileName,
      size: fileSize,
      type: fileType,
      uploadDate,
      url: req.file.path // Cloudinary returns the full URL in path
    };

    if (!getIsDBConnected()) {
      const document = addToCollection('documents', fileData);
      
      // Add to activity log
      addToCollection('activity', {
        userId: req.user.id || req.user._id,
        email: req.user.email,
        action: "Document Uploaded",
        details: `${fileName} was uploaded to your records`,
        type: "upload",
        timestamp
      });
      
      return res.status(201).json(document);
    }
    
    const document = await Document.create(fileData);
    
    const ActivityLog = require('../models/ActivityLog');
    await ActivityLog.create({
      userId: req.user._id,
      action: "Document Uploaded",
      details: `${fileName} was uploaded to your records`,
      type: "upload",
      timestamp
    });
    
    res.status(201).json(document);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDocuments,
  uploadDocument,
};
