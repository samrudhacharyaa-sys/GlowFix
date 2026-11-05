const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    complaintId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    citizenName: {
      type: String,
      trim: true,
      default: 'Anonymous Citizen'
    },
    citizenEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: ''
    },
    streetLightId: {
      type: String,
      required: [true, 'Please provide the Street Light ID (e.g., SL-1042)'],
      trim: true,
      uppercase: true
    },
    location: {
      type: String,
      required: [true, 'Please provide the location / landmark / street name'],
      trim: true
    },
    faultType: {
      type: String,
      required: [true, 'Please select a fault type'],
      enum: {
        values: ['Not Working', 'Flickering', 'Dim Light', 'Damaged Pole'],
        message: '{VALUE} is not a valid fault type'
      }
    },
    description: {
      type: String,
      required: [true, 'Please provide a description of the issue'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    image: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Resolved'],
      default: 'Pending'
    },
    adminNotes: {
      type: String,
      trim: true,
      default: ''
    },
    resolvedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Index for fast search and filtering
complaintSchema.index({ streetLightId: 1 });
complaintSchema.index({ status: 1 });
complaintSchema.index({ userId: 1 });

module.exports = mongoose.model('Complaint', complaintSchema);
