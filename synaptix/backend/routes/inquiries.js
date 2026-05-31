const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Inquiry = require('../models/Inquiry');
const authMiddleware = require('../middleware/auth');

// Validation rules
const inquiryValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().isEmail().withMessage('Valid email is required'),
  body('message').trim().notEmpty().withMessage('Message is required')
];

// POST /api/inquiries - Create new inquiry (Public)
router.post('/', inquiryValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const inquiryData = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone || '',
      serviceType: req.body.serviceType || 'General',
      budgetRange: req.body.budgetRange || '',
      message: req.body.message
    };

    const inquiry = new Inquiry(inquiryData);
    await inquiry.save();

    res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully',
      data: {
        id: inquiry.id,
        name: inquiry.name,
        serviceType: inquiry.serviceType,
        status: inquiry.status,
        createdAt: inquiry.createdAt
      }
    });

  } catch (error) {
    console.error('Create inquiry error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while submitting inquiry'
    });
  }
});

// GET /api/inquiries - Get all inquiries (Admin only)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: inquiries.length,
      data: inquiries.map(i => ({
        id: i.id,
        name: i.name,
        email: i.email,
        phone: i.phone,
        serviceType: i.serviceType,
        budgetRange: i.budgetRange,
        message: i.message,
        status: i.status,
        createdAt: i.createdAt
      }))
    });

  } catch (error) {
    console.error('Get inquiries error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching inquiries'
    });
  }
});

// GET /api/inquiries/:id - Get single inquiry (Admin only)
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const inquiry = await Inquiry.findOne({ id: req.params.id });

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }

    res.json({
      success: true,
      data: {
        id: inquiry.id,
        name: inquiry.name,
        email: inquiry.email,
        phone: inquiry.phone,
        serviceType: inquiry.serviceType,
        budgetRange: inquiry.budgetRange,
        message: inquiry.message,
        status: inquiry.status,
        createdAt: inquiry.createdAt
      }
    });

  } catch (error) {
    console.error('Get inquiry error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching inquiry'
    });
  }
});

// PATCH /api/inquiries/:id - Update inquiry status (Admin only)
router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;

    if (!['new', 'read'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const inquiry = await Inquiry.findOneAndUpdate(
      { id: req.params.id },
      { status, updatedAt: Date.now() },
      { new: true }
    );

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }

    res.json({
      success: true,
      message: 'Inquiry status updated',
      data: {
        id: inquiry.id,
        status: inquiry.status
      }
    });

  } catch (error) {
    console.error('Update inquiry error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating inquiry'
    });
  }
});

// DELETE /api/inquiries/:id - Delete inquiry (Admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const inquiry = await Inquiry.findOneAndDelete({ id: req.params.id });

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }

    res.json({
      success: true,
      message: 'Inquiry deleted successfully'
    });

  } catch (error) {
    console.error('Delete inquiry error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting inquiry'
    });
  }
});

module.exports = router;