const mongoose = require('mongoose');

const accessRequestSchema = new mongoose.Schema({
  providerName: {
    type: String,
    required: true,
  },
  providerEmail: {
    type: String,
    required: true,
  },
  patientName: {
    type: String,
    required: true,
  },
  patientEmail: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'denied'],
    default: 'pending',
  },
  requestDate: {
    type: String, // String format to match frontend
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  toJSON: {
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    }
  }
});

module.exports = mongoose.model('AccessRequest', accessRequestSchema);
