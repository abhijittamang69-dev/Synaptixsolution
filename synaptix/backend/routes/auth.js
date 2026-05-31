const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

// POST /api/auth/admin-login
router.post('/admin-login', async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required'
      });
    }

    // Find admin or create default one
    let admin = await Admin.findOne({ username: 'admin' });

    if (!admin) {
      // Create default admin with password synaptix2026
      const defaultPassword = 'synaptix2026';
      admin = new Admin({
        username: 'admin',
        password: defaultPassword
      });
      await admin.save();
    }

    // Verify password using bcrypt
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      // Fallback: check against plain text passwords for backward compatibility
      if (password !== 'synaptix2026' && password !== 'Abhijit@2') {
        return res.status(401).json({
          success: false,
          message: 'Invalid password'
        });
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      admin: { username: admin.username }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

module.exports = router;