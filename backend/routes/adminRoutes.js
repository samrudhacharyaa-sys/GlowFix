const express = require('express');
const router = express.Router();
const {
  getAllComplaints,
  updateComplaintStatus,
  getUsers,
  getDashboardStats
} = require('../controllers/adminController');
const { protect, requireAdmin } = require('../middleware/auth');

// All admin routes require authentication and admin role
router.use(protect, requireAdmin);

router.get('/complaints', getAllComplaints);
router.put('/complaints/:id/status', updateComplaintStatus);
router.get('/users', getUsers);
router.get('/stats', getDashboardStats);

module.exports = router;
