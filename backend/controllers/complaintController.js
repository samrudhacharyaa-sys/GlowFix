const Complaint = require('../models/Complaint');
const crypto = require('crypto');

// Helper to generate unique complaint ID (e.g., GF-783921)
const generateComplaintId = () => {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `GF-${randomNum}`;
};

// @desc    Submit a new street light complaint
// @route   POST /api/complaints
// @access  Public or Authenticated
exports.createComplaint = async (req, res) => {
  try {
    const { streetLightId, location, faultType, description, citizenName, citizenEmail } = req.body;

    // Validation
    if (!streetLightId || !location || !faultType || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: Street Light ID, Location, Fault Type, and Description.'
      });
    }

    const validFaults = ['Not Working', 'Flickering', 'Dim Light', 'Damaged Pole'];
    if (!validFaults.includes(faultType)) {
      return res.status(400).json({
        success: false,
        message: `Fault type must be one of: ${validFaults.join(', ')}`
      });
    }

    // Handle image upload path
    let imageUrl = '';
    if (req.file) {
      // Store relative path accessible via /uploads/<filename>
      imageUrl = `/uploads/${req.file.filename}`;
    }

    // Generate unique complaint ID
    let uniqueId = generateComplaintId();
    let idExists = await Complaint.findOne({ complaintId: uniqueId });
    while (idExists) {
      uniqueId = generateComplaintId();
      idExists = await Complaint.findOne({ complaintId: uniqueId });
    }

    // Determine user association
    const userId = req.user ? req.user._id : null;
    const resolvedName = req.user ? req.user.name : (citizenName || 'Concerned Citizen');
    const resolvedEmail = req.user ? req.user.email : (citizenEmail || '');

    const complaint = await Complaint.create({
      complaintId: uniqueId,
      userId,
      citizenName: resolvedName,
      citizenEmail: resolvedEmail,
      streetLightId: streetLightId.trim().toUpperCase(),
      location: location.trim(),
      faultType,
      description: description.trim(),
      image: imageUrl,
      status: 'Pending'
    });

    return res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully! Our municipal electrical team will review it shortly.',
      complaintId: complaint.complaintId,
      complaint
    });
  } catch (err) {
    console.error('Create Complaint Error:', err);
    return res.status(500).json({
      success: false,
      message: err.message || 'Server error while submitting complaint.'
    });
  }
};

// @desc    Get all complaints filed by the current user
// @route   GET /api/complaints/my
// @access  Private (Citizen)
exports.getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      $or: [
        { userId: req.user._id },
        { citizenEmail: req.user.email }
      ]
    }).sort({ createdAt: -1 });

    const stats = {
      total: complaints.length,
      pending: complaints.filter(c => c.status === 'Pending').length,
      inProgress: complaints.filter(c => c.status === 'In Progress').length,
      resolved: complaints.filter(c => c.status === 'Resolved').length
    };

    return res.status(200).json({
      success: true,
      count: complaints.length,
      stats,
      complaints
    });
  } catch (err) {
    console.error('Get My Complaints Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving your complaints.'
    });
  }
};

// @desc    Track a complaint by ID (Public)
// @route   GET /api/complaints/track/:complaintId
// @access  Public
exports.trackComplaint = async (req, res) => {
  try {
    const rawId = req.params.complaintId.trim().toUpperCase();

    // Query either by complaintId or streetLightId
    const complaint = await Complaint.findOne({
      $or: [
        { complaintId: rawId },
        { streetLightId: rawId }
      ]
    }).populate('userId', 'name email');

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: `No complaint found with Tracking or Light ID: "${rawId}". Please check the ID and try again.`
      });
    }

    return res.status(200).json({
      success: true,
      complaint
    });
  } catch (err) {
    console.error('Track Complaint Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error tracking complaint.'
    });
  }
};

// @desc    Get single complaint details
// @route   GET /api/complaints/:id
// @access  Public / Private
exports.getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate('userId', 'name email');
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found.'
      });
    }

    return res.status(200).json({
      success: true,
      complaint
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving complaint details.'
    });
  }
};
