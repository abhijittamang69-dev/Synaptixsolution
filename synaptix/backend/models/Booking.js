const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    maxlength: [20, 'Phone number cannot exceed 20 characters']
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  service: {
    type: String,
    required: [true, 'Service type is required'],
    enum: ['cctv', 'access', 'egate', 'alarm', 'combo', 'other']
  },
  property: {
    type: String,
    required: [true, 'Property type is required'],
    enum: ['home', 'office', 'factory', 'shop', 'apartment', 'other']
  },
  date: {
    type: String,
    required: [true, 'Date is required']
  },
  time: {
    type: String,
    required: [true, 'Time is required'],
    enum: ['morning', 'afternoon', 'evening']
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Auto-generate booking ID before saving
bookingSchema.pre('save', function(next) {
  if (!this.id) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    this.id = `BK-${timestamp}${random}`;
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);