const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config();

const app = express();

// ===== MIDDLEWARE =====
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// ===== SERVE STATIC FRONTEND FILES =====
app.use(express.static(path.join(__dirname, 'public')));

// ===== MONGODB CONNECTION =====
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/synaptix';
mongoose.connect(MONGODB_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Error:', err));

// ===== SCHEMAS =====
const bookingSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    address: { type: String, required: true },
    service: { type: String, required: true },
    property: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    notes: { type: String },
    status: { type: String, default: 'pending', enum: ['pending', 'confirmed', 'completed', 'cancelled'] },
    createdAt: { type: Date, default: Date.now }
});
const Booking = mongoose.model('Booking', bookingSchema);

const inquirySchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    serviceType: { type: String, default: '' },
    budgetRange: { type: String, default: '' },
    message: { type: String, required: true },
    status: { type: String, default: 'new', enum: ['new', 'read', 'replied', 'archived'] },
    createdAt: { type: Date, default: Date.now }
});
const Inquiry = mongoose.model('Inquiry', inquirySchema);

// ===== AUTH MIDDLEWARE =====
const authenticateAdmin = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ success: false, message: 'No token provided' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'synaptix-secret-key-2026');
        if (decoded.role !== 'admin') return res.status(403).json({ success: false, message: 'Not authorized' });

        req.admin = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
    }
};

// ===== AUTH ROUTES =====
app.post('/api/auth/admin-login', async (req, res) => {
    try {
        const { password } = req.body;
        const adminPassword = process.env.ADMIN_PASSWORD || 'Abhijit@2';

        if (password !== adminPassword) {
            return res.status(401).json({ success: false, message: 'Invalid password' });
        }

        const token = jwt.sign(
            { role: 'admin', username: 'admin' },
            process.env.JWT_SECRET || 'synaptix-secret-key-2026',
            { expiresIn: '24h' }
        );

        res.json({ success: true, token });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ===== BOOKING ROUTES =====
app.post('/api/bookings', async (req, res) => {
    try {
        const bookingData = req.body;
        const bookingId = 'BK-' + Math.random().toString(36).substr(2, 6).toUpperCase();

        const booking = new Booking({
            id: bookingId,
            ...bookingData,
            status: 'pending'
        });

        await booking.save();
        res.status(201).json({ success: true, data: booking });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.get('/api/bookings', authenticateAdmin, async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ createdAt: -1 });
        res.json({ success: true, data: bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.patch('/api/bookings/:id', authenticateAdmin, async (req, res) => {
    try {
        const booking = await Booking.findOneAndUpdate(
            { id: req.params.id },
            { status: req.body.status },
            { new: true }
        );
        if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
        res.json({ success: true, data: booking });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ===== INQUIRY ROUTES =====
app.post('/api/inquiries', async (req, res) => {
    try {
        const inquiryData = req.body;
        const inquiryId = 'INQ-' + Math.random().toString(36).substr(2, 6).toUpperCase();

        const inquiry = new Inquiry({
            id: inquiryId,
            ...inquiryData,
            status: 'new'
        });

        await inquiry.save();
        res.status(201).json({ success: true, data: inquiry });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.get('/api/inquiries', authenticateAdmin, async (req, res) => {
    try {
        const inquiries = await Inquiry.find().sort({ createdAt: -1 });
        res.json({ success: true, data: inquiries });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.get('/api/inquiries/:id', authenticateAdmin, async (req, res) => {
    try {
        const inquiry = await Inquiry.findOne({ id: req.params.id });
        if (!inquiry) return res.status(404).json({ success: false, message: 'Inquiry not found' });
        res.json({ success: true, data: inquiry });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.patch('/api/inquiries/:id', authenticateAdmin, async (req, res) => {
    try {
        const inquiry = await Inquiry.findOneAndUpdate(
            { id: req.params.id },
            { status: req.body.status },
            { new: true }
        );
        if (!inquiry) return res.status(404).json({ success: false, message: 'Inquiry not found' });
        res.json({ success: true, data: inquiry });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.delete('/api/inquiries/:id', authenticateAdmin, async (req, res) => {
    try {
        const inquiry = await Inquiry.findOneAndDelete({ id: req.params.id });
        if (!inquiry) return res.status(404).json({ success: false, message: 'Inquiry not found' });
        res.json({ success: true, message: 'Inquiry deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ===== DASHBOARD ROUTE =====
app.get('/api/dashboard', authenticateAdmin, async (req, res) => {
    try {
        const totalBookings = await Booking.countDocuments();
        const totalInquiries = await Inquiry.countDocuments();
        const pendingBookings = await Booking.countDocuments({ status: 'pending' });
        const newInquiries = await Inquiry.countDocuments({ status: 'new' });

        const recentBookings = await Booking.find().sort({ createdAt: -1 }).limit(5);
        const recentInquiries = await Inquiry.find().sort({ createdAt: -1 }).limit(5);

        res.json({
            success: true,
            data: {
                totalBookings,
                totalInquiries,
                pendingBookings,
                newInquiries,
                recentBookings,
                recentInquiries
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ===== HEALTH CHECK =====
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'Synaptix API is running', timestamp: new Date().toISOString() });
});

// ===== CATCH-ALL: SERVE index.html FOR ALL NON-API ROUTES =====
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ===== ERROR HANDLER =====
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Something went wrong!' });
});

// ===== START SERVER =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Synaptix Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
