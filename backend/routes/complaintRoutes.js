const express = require('express');
const router = express.Router();
const {
  createComplaint,
  getMyComplaints,
  trackComplaint,
  getComplaintById
} = require('../controllers/complaintController');
const { protect, optionalProtect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public or logged-in report fault
router.post('/', optionalProtect, upload.single('image'), createComplaint);

// Citizen's own complaints
router.get('/my', protect, getMyComplaints);

// Public complaint tracking by ID
router.get('/track/:complaintId', trackComplaint);

// Single complaint details
router.get('/:id', getComplaintById);

module.exports = router;
