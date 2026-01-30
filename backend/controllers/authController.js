import mongooseUser from "../models/User.js";
import mockDB from "../db/mockDB.js";
import bcrypt from "bcryptjs";

// Use the real Mongoose model when a Mongo URI is configured; otherwise fall
// back to the simple file-based mock DB implementation (mockDB.User).
const User = process.env.MONGO_URI ? mongooseUser : mockDB.User;

// Register User
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

  // Check if user exists
  const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Use `create` which works with both Mongoose models and the mock DB.
    const created = await User.create({ name, email, password: hashedPassword });

    // Normalize response shape for both implementations
    const responseUser = created.toObject ? created.toObject() : created;

    return res.status(201).json({ message: "User registered successfully", user: { name: responseUser.name, email: responseUser.email } });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Login User
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Normalize response shape for both Mongoose and mock DB implementations
    const responseUser = user.toObject ? user.toObject() : user;

    return res.status(200).json({ message: "Login successful", user: { name: responseUser.name, email: responseUser.email } });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
