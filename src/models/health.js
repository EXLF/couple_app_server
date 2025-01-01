const mongoose = require('mongoose');

const healthSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  coupleId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  hasTakenMedicine: {
    type: Boolean,
    default: false
  },
  note: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

const Health = mongoose.model('Health', healthSchema);

module.exports = Health;
