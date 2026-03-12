const express = require('express');
const router = express.Router();
const { getDocuments, uploadDocument } = require('../controllers/documentController');
const upload = require('../middleware/upload');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getDocuments);
router.post('/', protect, upload.single('file'), uploadDocument);

module.exports = router;
