const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
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
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    trim: true,
    maxlength: [20, 'Phone number cannot exceed 20 characters']
  },
  serviceType: {
    type: String,
    default: 'General',
    enum: ['', 'web', 'ecommerce', 'cctv', 'access', 'egate', 'security-package', 'other', 'General']
  },
  budgetRange: {
    type: String,
    default: '',
    enum: ['', 'small', 'medium', 'large', 'enterprise']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [5000, 'Message cannot exceed 5000 characters']
  },
  status: {
    type: String,
    enum: ['new', 'read'],
    default: 'new'
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

// Auto-generate inquiry ID before saving
inquirySchema.pre('save', function(next) {
  if (!this.id) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    this.id = `INQ-${timestamp}${random}`;
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Inquiry', inquirySchema);