const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const authMiddleware = require('../middleware/auth');

// Validation rules
const bookingValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('phone').trim().notEmpty().withMessage('Phone is required'),
  body('address').trim().notEmpty().withMessage('Address is required'),
  body('service').isIn(['cctv', 'access', 'egate', 'alarm', 'combo', 'other']).withMessage('Invalid service type'),
  body('property').isIn(['home', 'office', 'factory', 'shop', 'apartment', 'other']).withMessage('Invalid property type'),
  body('date').notEmpty().withMessage('Date is required'),
  body('time').isIn(['morning', 'afternoon', 'evening']).withMessage('Invalid time slot')
];

// POST /api/bookings - Create new booking (Public)
router.post('/', bookingValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const bookingData = {
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email || '',
      address: req.body.address,
      service: req.body.service,
      property: req.body.property,
      date: req.body.date,
      time: req.body.time,
      notes: req.body.notes || ''
    };

    const booking = new Booking(bookingData);
    await booking.save();

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: {
        id: booking.id,
        name: booking.name,
        service: booking.service,
        date: booking.date,
        time: booking.time,
        status: booking.status,
        createdAt: booking.createdAt
      }
    });

  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating booking'
    });
  }
});

// GET /api/bookings - Get all bookings (Admin only)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      data: bookings.map(b => ({
        id: b.id,
        name: b.name,
        phone: b.phone,
        email: b.email,
        address: b.address,
        service: b.service,
        property: b.property,
        date: b.date,
        time: b.time,
        notes: b.notes,
        status: b.status,
        createdAt: b.createdAt
      }))
    });

  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching bookings'
    });
  }
});

// GET /api/bookings/:id - Get single booking (Admin only)
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findOne({ id: req.params.id });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      data: {
        id: booking.id,
        name: booking.name,
        phone: booking.phone,
        email: booking.email,
        address: booking.address,
        service: booking.service,
        property: booking.property,
        date: booking.date,
        time: booking.time,
        notes: booking.notes,
        status: booking.status,
        createdAt: booking.createdAt
      }
    });

  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching booking'
    });
  }
});

// PATCH /api/bookings/:id - Update booking status (Admin only)
router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const booking = await Booking.findOneAndUpdate(
      { id: req.params.id },
      { status, updatedAt: Date.now() },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      message: 'Booking status updated',
      data: {
        id: booking.id,
        status: booking.status
      }
    });

  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating booking'
    });
  }
});

// DELETE /api/bookings/:id - Delete booking (Admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findOneAndDelete({ id: req.params.id });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      message: 'Booking deleted successfully'
    });

  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting booking'
    });
  }
});

module.exports = router;