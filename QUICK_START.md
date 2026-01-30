# 🚀 Quick Start Guide

## Run Everything in 3 Steps

### Step 1: Start MongoDB
MongoDB is already running as a service on your system.

### Step 2: Start Backend Server
```powershell
cd C:\Users\ASUS\Desktop\DevOPs\backend
npm start
```
✅ Backend will be available at `http://localhost:5000`

### Step 3: Start Frontend Server
```powershell
cd C:\Users\ASUS\Desktop\DevOPs\frontend
npm run dev
```
✅ Frontend will be available at `http://localhost:5174`

---

## 🔄 Seed Database (Optional - do this once)
To populate with sample rooms and offers:
```powershell
cd C:\Users\ASUS\Desktop\DevOPs\backend
node seed.js
```

---

## 📍 Access Points

| Component | URL | Purpose |
|-----------|-----|---------|
| Frontend | http://localhost:5174 | User Interface |
| Backend API | http://localhost:5000/api | REST API |
| Rooms API | http://localhost:5000/api/rooms | Room endpoints |
| Offers API | http://localhost:5000/api/offers | Offer endpoints |
| Auth API | http://localhost:5000/api/auth | Authentication |

---

## 🎯 Key Pages in Frontend

- **Home** (`/`) - Welcome page with featured rooms and offers
- **Rooms** (`/rooms`) - Browse all rooms with filters
- **Offers** (`/offers`) - View active promotional offers
- **Dashboard** (`/dashboard`) - User dashboard with bookings
- **Login** (`/login`) - User login
- **Sign Up** (`/signup`) - Create new account

---

## 🧪 Test the Features

### 1. Create Account
- Go to http://localhost:5174/signup
- Enter name, email, and password
- Click "Sign Up"

### 2. Login
- Go to http://localhost:5174/login
- Enter email and password
- You'll be redirected to dashboard

### 3. Browse Rooms
- Click "Explore Rooms" on home page
- Or navigate to http://localhost:5174/rooms
- Filter by room type
- See prices, ratings, and amenities

### 4. View Offers
- Click "View Offers" on home page
- Or navigate to http://localhost:5174/offers
- See discount details and promo codes
- Filter active offers only

### 5. Dashboard
- After login, go to dashboard
- See your bookings and statistics
- View room and offer counts

---

## 📊 API Testing with Postman/cURL

### Get All Rooms
```bash
curl http://localhost:5000/api/rooms
```

### Get Available Rooms
```bash
curl http://localhost:5000/api/rooms/available
```

### Get Active Offers
```bash
curl http://localhost:5000/api/offers/active
```

### Get Offer by Code
```bash
curl http://localhost:5000/api/offers/code/EARLYBIRD20
```

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

---

## 🐛 Troubleshooting

### Backend won't start
- Check MongoDB is running: `net start MongoDB`
- Check port 5000 is not in use
- Verify `.env` file exists in backend folder

### Frontend won't start
- Port 5173/5174 might be in use
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and reinstall: `npm install`

### API not working
- Ensure backend is running (check terminal)
- Check `.env` has correct `MONGO_URI`
- Verify MongoDB connection in backend terminal

### No data showing
- Run seed script: `node seed.js`
- Check MongoDB connection
- Verify API endpoints are working with cURL

---

## 📚 File Structure

```
backend/
  ├── controllers/ (Business logic)
  ├── models/ (Database schemas)
  ├── routers/ (API routes)
  ├── server.js (Main server)
  └── seed.js (Sample data)

frontend/
  └── src/
      ├── Pages/ (Page components)
      ├── services/api.js (API calls)
      └── App.jsx (Main app)
```

---

## ✅ Completed Features

- ✅ MongoDB Integration
- ✅ User Authentication (Sign up, Login, Logout)
- ✅ Room Management (Create, Read, Update, Delete)
- ✅ Offer Management (Create, Read, Update, Delete)
- ✅ Rooms Page with Filtering
- ✅ Offers Page with Active Filter
- ✅ Home Page with Featured Content
- ✅ Dashboard with User Bookings
- ✅ Responsive Design
- ✅ Sample Data Seeding

---

## 🎯 Next Steps

1. Test all pages and features
2. Create accounts and login
3. Browse rooms and filter by type
4. View and apply promotional offers
5. Check dashboard for bookings

---

**Happy Coding! 🚀**

Created: November 13, 2025
