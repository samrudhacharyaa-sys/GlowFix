const Complaint = require('../models/Complaint');
const User = require('../models/User');

// @desc    Get all complaints with search and filter
// @route   GET /api/admin/complaints
// @access  Private (Admin)
exports.getAllComplaints = async (req, res) => {
  try {
    const { search, status, faultType, sortBy = 'createdAt', order = 'desc' } = req.query;

    const query = {};

    // Status filter
    if (status && status !== 'All') {
      query.status = status;
    }

    // Fault type filter
    if (faultType && faultType !== 'All') {
      query.faultType = faultType;
    }

    // Search keyword
    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { complaintId: regex },
        { streetLightId: regex },
        { location: regex },
        { citizenName: regex },
        { citizenEmail: regex },
        { description: regex }
      ];
    }

    const sortOption = {};
    sortOption[sortBy] = order === 'asc' ? 1 : -1;

    const complaints = await Complaint.find(query)
      .populate('userId', 'name email')
      .sort(sortOption);

    return res.status(200).json({
      success: true,
      count: complaints.length,
      complaints
    });
  } catch (err) {
    console.error('Admin Get Complaints Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving complaints.'
    });
  }
};

// @desc    Update complaint status & admin notes
// @route   PUT /api/admin/complaints/:id/status
// @access  Private (Admin)
exports.updateComplaintStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const { id } = req.params;

    const validStatuses = ['Pending', 'In Progress', 'Resolved'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${validStatuses.join(', ')}`
      });
    }

    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found.'
      });
    }

    complaint.status = status;
    if (adminNotes !== undefined) {
      complaint.adminNotes = adminNotes;
    }
    if (status === 'Resolved') {
      complaint.resolvedAt = new Date();
    } else {
      complaint.resolvedAt = null;
    }

    await complaint.save();

    return res.status(200).json({
      success: true,
      message: `Complaint #${complaint.complaintId} status updated to "${status}".`,
      complaint
    });
  } catch (err) {
    console.error('Admin Update Status Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error updating complaint status.'
    });
  }
};

// @desc    Get all registered users with complaint counts
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    // Aggregate complaint counts per user
    const usersWithStats = await Promise.all(
      users.map(async (u) => {
        const count = await Complaint.countDocuments({
          $or: [{ userId: u._id }, { citizenEmail: u.email }]
        });
        return {
          id: u._id,
          name: u.name,
          email: u.email,
          role: u.role,
          createdAt: u.createdAt,
          complaintsCount: count
        };
      })
    );

    return res.status(200).json({
      success: true,
      count: usersWithStats.length,
      users: usersWithStats
    });
  } catch (err) {
    console.error('Admin Get Users Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving users.'
    });
  }
};

// @desc    Get high-level dashboard statistics
// @route   GET /api/admin/stats
// @access  Private (Admin)
exports.getDashboardStats = async (req, res) => {
  try {
    const totalComplaints = await Complaint.countDocuments();
    const pendingComplaints = await Complaint.countDocuments({ status: 'Pending' });
    const inProgressComplaints = await Complaint.countDocuments({ status: 'In Progress' });
    const resolvedComplaints = await Complaint.countDocuments({ status: 'Resolved' });
    const totalUsers = await User.countDocuments();
    const citizenCount = await User.countDocuments({ role: 'citizen' });

    // Fault type distribution
    const faultDistribution = await Complaint.aggregate([
      { $group: { _id: '$faultType', count: { $sum: 1 } } }
    ]);

    // Recent 5 complaints
    const recentComplaints = await Complaint.find()
      .sort({ createdAt: -1 })
      .limit(5);

    return res.status(200).json({
      success: true,
      stats: {
        totalComplaints,
        pendingComplaints,
        inProgressComplaints,
        resolvedComplaints,
        totalUsers,
        citizenCount,
        faultDistribution,
        recentComplaints
      }
    });
  } catch (err) {
    console.error('Admin Stats Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving dashboard statistics.'
    });
  }
};
