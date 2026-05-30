# Synaptix Backend

## Deploy to Render

1. Push this `backend/` folder to GitHub
2. On Render: New Web Service → Connect GitHub repo
3. Settings:
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Environment Variables:
   - `MONGODB_URI` = your MongoDB Atlas URI
   - `JWT_SECRET` = random secret string
   - `ADMIN_PASSWORD` = synaptix2026
   - `NODE_ENV` = production

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/admin-login | No | Admin login |
| POST | /api/bookings | No | Create booking |
| GET | /api/bookings | Yes | List bookings |
| PATCH | /api/bookings/:id | Yes | Update status |
| POST | /api/inquiries | No | Create inquiry |
| GET | /api/inquiries | Yes | List inquiries |
| GET | /api/inquiries/:id | Yes | View inquiry |
| PATCH | /api/inquiries/:id | Yes | Update status |
| DELETE | /api/inquiries/:id | Yes | Delete inquiry |
| GET | /api/dashboard | Yes | Dashboard stats |
| GET | /api/health | No | Health check |
