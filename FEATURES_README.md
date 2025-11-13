# Royal Stay Hotels - Complete Hotel Management System

## 🎉 Project Features Overview

This is a full-stack hotel booking and management system with frontend and backend components. The application now includes complete features for Rooms, Offers, Dashboard, and Home pages.

---

## ✨ New Features Added

### 1. **Home Page Enhancements** 
- Featured Rooms Section: Displays 3 most available rooms
- Special Offers Section: Shows active promotional offers
- Why Choose Us Section: Highlights hotel benefits
- Call-to-Action Buttons: Easy navigation to booking pages
- Dynamic content loading from backend API

### 2. **Rooms Page**
- **Display all available rooms** with beautiful card layout
- **Filter by room type**: Single, Double, Twin, Suite, Deluxe
- **Room details**:
  - Name, description, and room type
  - Price per night
  - Capacity (number of guests)
  - Rating and review count
  - Amenities list
  - Availability status
- **Book Now buttons** for easy booking
- Responsive design for mobile and desktop

### 3. **Offers Page**
- **Display special promotional offers** in an attractive card format
- **Filter options**: View all offers or active offers only
- **Offer details**:
  - Offer title and description
  - Discount percentage
  - Applicable room types
  - Valid dates
  - Promo code (if available)
- **Apply Now buttons** to redeem offers
- Promo code verification section
- Time-based offer filtering

### 4. **Dashboard Enhancements**
- Navigation links to Rooms, Offers, and Home pages
- Summary statistics:
  - Upcoming bookings count
  - Available rooms count
  - Special offers count
- **Your Bookings table** showing:
  - Room names
  - Check-in and check-out dates
  - Number of guests
  - Booking status (Confirmed/Pending)

### 5. **Backend API Endpoints**

#### Rooms API (`/api/rooms`)
```
GET    /api/rooms              - Get all rooms
GET    /api/rooms/available    - Get available rooms
GET    /api/rooms/type/:type   - Get rooms by type
GET    /api/rooms/:id          - Get single room
POST   /api/rooms              - Create new room (Admin)
PUT    /api/rooms/:id          - Update room (Admin)
DELETE /api/rooms/:id          - Delete room (Admin)
```

#### Offers API (`/api/offers`)
```
GET    /api/offers             - Get all offers
GET    /api/offers/active      - Get active offers only
GET    /api/offers/code/:code  - Verify promo code
GET    /api/offers/:id         - Get single offer
POST   /api/offers             - Create new offer (Admin)
PUT    /api/offers/:id         - Update offer (Admin)
DELETE /api/offers/:id         - Delete offer (Admin)
```

---

## 📦 Database Models

### Room Model
```javascript
{
  name: String,
  description: String,
  type: Enum["Single", "Double", "Twin", "Suite", "Deluxe"],
  price: Number,
  capacity: Number (1-10),
  amenities: [String],
  images: [String],
  available: Boolean,
  rating: Number (0-5),
  reviews: Number,
  timestamps: { createdAt, updatedAt }
}
```

### Offer Model
```javascript
{
  title: String,
  description: String,
  discount: Number,
  offerType: Enum["percentage", "fixed"],
  applicableRoomTypes: [String],
  validFrom: Date,
  validUntil: Date,
  image: String,
  code: String (unique),
  active: Boolean,
  timestamps: { createdAt, updatedAt }
}
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB (or MongoDB Atlas connection)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables** (`.env`)
   ```
   MONGO_URI=mongodb://localhost:27017/royal-stay-hotels
   PORT=5000
   NODE_ENV=development
   ```

4. **Seed the database** (with sample data)
   ```bash
   node seed.js
   ```

5. **Start the backend server**
   ```bash
   npm start        # Production
   npm run dev      # Development with nodemon
   ```

The backend API will be available at `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5174` (or `http://localhost:5173`)

---

## 🔗 Project Structure

```
DevOPs/
├── backend/
│   ├── controllers/
│   │   ├── authController.js      - User authentication
│   │   ├── roomController.js      - Room CRUD operations
│   │   └── offerController.js     - Offer CRUD operations
│   ├── models/
│   │   ├── User.js                - User schema
│   │   ├── Room.js                - Room schema
│   │   └── Offer.js               - Offer schema
│   ├── routers/
│   │   ├── auth.js                - Auth routes
│   │   ├── rooms.js               - Room routes
│   │   └── offers.js              - Offer routes
│   ├── db/
│   │   └── mockDB.js              - Mock database
│   ├── server.js                  - Main server file
│   ├── seed.js                    - Database seeding
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── Pages/
│   │   │   ├── Home.jsx           - Home page with featured rooms/offers
│   │   │   ├── Rooms.jsx          - Rooms listing page
│   │   │   ├── Offers.jsx         - Offers listing page
│   │   │   ├── Dashboard.jsx      - User dashboard
│   │   │   ├── Login.jsx
│   │   │   └── SignUp.jsx
│   │   ├── services/
│   │   │   └── api.js             - API client with all endpoints
│   │   ├── App.jsx                - Main app component with routing
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
└── README.md (this file)
```

---

## 📋 Sample Data

The seed script creates:
- **6 sample rooms** with different types and price ranges
- **4 active promotional offers** with various discounts

### Sample Rooms Include:
- Deluxe King ($250/night) - 4.8⭐
- Standard Twin ($150/night) - 4.5⭐
- Suite Paradise ($350/night) - 4.9⭐
- Cozy Single ($99/night) - 4.3⭐
- Double Comfort ($180/night) - 4.6⭐
- Royal Suite ($500/night) - 5.0⭐

### Sample Offers Include:
- Early Bird Special: 20% off (code: EARLYBIRD20)
- Weekend Getaway: 25% off (code: WEEKEND25)
- Extended Stay: 30% off (code: STAY30)
- Loyal Guest Bonus: $50 off (code: LOYAL50)

---

## 🔐 Authentication

The app includes user authentication:
- **Sign Up**: Create new user account
- **Login**: Authenticate with email and password
- **Logout**: Clear user session
- **Protected Routes**: Dashboard requires user login

User data is stored in localStorage for session management.

---

## 🎨 UI/UX Features

- **Responsive Design**: Works on mobile, tablet, and desktop
- **Beautiful Gradient Backgrounds**: Modern color scheme
- **Card-based Layout**: Easy to scan and navigate
- **Smooth Transitions**: Professional animations
- **Filter Options**: Filter rooms by type, offers by status
- **Rating System**: Display room ratings and reviews
- **Clear CTA Buttons**: Easy booking and offer redemption

---

## 🧪 Testing the Application

1. **Access Home Page**: http://localhost:5174/
2. **Browse Rooms**: Click "Explore Rooms" or navigate to /rooms
3. **View Offers**: Click "View Offers" or navigate to /offers
4. **Sign Up**: Create a new account
5. **Login**: Use your credentials to access dashboard
6. **Dashboard**: View bookings and stats

---

## 📝 API Examples

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

### Create a Room (Admin)
```bash
curl -X POST http://localhost:5000/api/rooms \
  -H "Content-Type: application/json" \
  -d '{"name":"New Room","description":"Desc","type":"Suite","price":300,"capacity":2}'
```

### Verify Promo Code
```bash
curl http://localhost:5000/api/offers/code/EARLYBIRD20
```

---

## 🚀 Future Enhancements

- [ ] Add booking management system
- [ ] Implement payment gateway integration
- [ ] Add user reviews and ratings
- [ ] Email notifications for bookings
- [ ] Admin dashboard for managing rooms/offers
- [ ] Real-time availability calendar
- [ ] Advanced filtering and search
- [ ] Multi-language support

---

## 📧 Support

For issues or questions, please contact the development team.

---

## 📄 License

This project is part of the DevOPs training program.

**Last Updated**: November 13, 2025
