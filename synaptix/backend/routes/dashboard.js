const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Inquiry = require('../models/Inquiry');
const authMiddleware = require('../middleware/auth');

// GET /api/dashboard - Get dashboard statistics (Admin only)
router.get('/', authMiddleware, async (req, res) => {
  try {
    // Get counts
    const totalBookings = await Booking.countDocuments();
    const totalInquiries = await Inquiry.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const newInquiries = await Inquiry.countDocuments({ status: 'new' });

    // Get recent bookings (last 5)
    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('id name service status createdAt');

    // Get recent inquiries (last 5)
    const recentInquiries = await Inquiry.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('id name serviceType status createdAt');

    // Format recent activity
    const formattedBookings = recentBookings.map(b => ({
      id: b.id,
      name: b.name,
      service: b.service,
      status: b.status,
      createdAt: b.createdAt
    }));

    const formattedInquiries = recentInquiries.map(i => ({
      id: i.id,
      name: i.name,
      serviceType: i.serviceType,
      status: i.status,
      createdAt: i.createdAt
    }));

    res.json({
      success: true,
      data: {
        totalBookings,
        totalInquiries,
        pendingBookings,
        newInquiries,
        recentBookings: formattedBookings,
        recentInquiries: formattedInquiries
      }
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard data'
    });
  }
});

module.exports = router;