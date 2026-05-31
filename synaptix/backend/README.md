# Synaptix Solutions Backend

Complete Node.js/Express backend for Synaptix Solutions Ltd website with MongoDB integration.

## 🚀 Features

- **Booking System** - Clients can book security installations
- **Inquiry System** - Contact form submissions stored in MongoDB
- **Admin Dashboard** - Secure JWT-protected admin panel
- **Rate Limiting** - Protection against spam/abuse
- **CORS Configured** - Ready for Vercel frontend

## 📋 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/admin-login` | No | Admin login (password: synaptix2026) |
| POST | `/api/bookings` | No | Create new booking |
| GET | `/api/bookings` | Yes (JWT) | List all bookings |
| GET | `/api/bookings/:id` | Yes (JWT) | Get single booking |
| PATCH | `/api/bookings/:id` | Yes (JWT) | Update booking status |
| DELETE | `/api/bookings/:id` | Yes (JWT) | Delete booking |
| POST | `/api/inquiries` | No | Submit inquiry |
| GET | `/api/inquiries` | Yes (JWT) | List all inquiries |
| GET | `/api/inquiries/:id` | Yes (JWT) | Get single inquiry |
| PATCH | `/api/inquiries/:id` | Yes (JWT) | Update inquiry status |
| DELETE | `/api/inquiries/:id` | Yes (JWT) | Delete inquiry |
| GET | `/api/dashboard` | Yes (JWT) | Dashboard statistics |

## 🛠️ Deployment Steps

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial backend setup"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### 2. Deploy on Render
1. Go to [render.com](https://render.com) and sign in
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `synaptixsolution`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add Environment Variables:
   - `MONGODB_URI`: `mongodb+srv://admin:Abhijit%402@cluster0.7uo82m0.mongodb.net/synaptix?retryWrites=true&w=majority`
   - `JWT_SECRET`: Generate a strong random string
   - `FRONTEND_URL`: `https://synaptixsolution.vercel.app`
6. Click "Create Web Service"

### 3. Update Frontend API URL
In your frontend files, update:
```javascript
const API_BASE = 'https://synaptixsolution.onrender.com/api';
```

## 🔐 Admin Login
- **Username**: `admin`
- **Password**: `synaptix2026`

## 📦 Tech Stack
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs Password Hashing
- express-validator Validation
- Helmet Security Headers
- express-rate-limit Rate Limiting

## 📞 Support
For issues, contact: abhijittamang69@gmail.com
