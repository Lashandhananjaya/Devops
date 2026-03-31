import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routers/auth.js";
import roomRoutes from "./routers/rooms.js";
import offerRoutes from "./routers/offers.js";

dotenv.config();

const app = express();

// Middleware
// Allow CORS from frontend running on any port on the same host
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Get the host from the incoming request
    const requestHost = origin.split('://')[1]?.split(':')[0];
    
    // Allow all ports on localhost and the same host
    if (
      origin.includes('localhost') ||
      origin.includes('127.0.0.1') ||
      origin.includes(requestHost)
    ) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  credentials: true
}));
app.use(express.json()); // Parse JSON requests
// Also accept URL-encoded bodies (in case the client sends form data)
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/offers", offerRoutes);

// Handle JSON parse errors (body-parser) and return JSON instead of HTML
app.use((err, req, res, next) => {
  if (err && err.type === 'entity.parse.failed') {
    // body-parser throws an error with type 'entity.parse.failed' on bad JSON
    return res.status(400).json({ message: 'Invalid JSON payload' });
  }
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ message: 'Invalid JSON payload' });
  }
  return next(err);
});

// MongoDB Connection (only if MONGO_URI is provided). If not provided, the app
// will fall back to the lightweight mock DB in `db/mockDB.js`.
if (process.env.MONGO_URI) {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB connected successfully"))
    .catch((err) => {
      console.log("❌ MongoDB connection error:", err.message);
      console.log("⚠️  Make sure MongoDB is running: net start MongoDB");
    });
} else {
  console.log("ℹ️  No MONGO_URI provided — using mock DB (db/mockDB.js)");
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
