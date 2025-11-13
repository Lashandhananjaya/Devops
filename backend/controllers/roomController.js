import Room from "../models/Room.js";

// Get all rooms
export const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.status(200).json({ rooms });
  } catch (error) {
    console.error("Get rooms error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get single room by ID
export const getRoomById = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await Room.findById(id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.status(200).json({ room });
  } catch (error) {
    console.error("Get room error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create new room (Admin only)
export const createRoom = async (req, res) => {
  try {
    const { name, description, type, price, capacity, amenities, images } = req.body;

    if (!name || !description || !type || !price || !capacity) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    const newRoom = new Room({
      name,
      description,
      type,
      price,
      capacity,
      amenities: amenities || [],
      images: images || [],
    });

    await newRoom.save();
    res.status(201).json({ message: "Room created successfully", room: newRoom });
  } catch (error) {
    console.error("Create room error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update room
export const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const room = await Room.findByIdAndUpdate(id, updates, { new: true });
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.status(200).json({ message: "Room updated successfully", room });
  } catch (error) {
    console.error("Update room error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete room
export const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await Room.findByIdAndDelete(id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.status(200).json({ message: "Room deleted successfully" });
  } catch (error) {
    console.error("Delete room error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get available rooms
export const getAvailableRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ available: true });
    res.status(200).json({ rooms });
  } catch (error) {
    console.error("Get available rooms error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get rooms by type
export const getRoomsByType = async (req, res) => {
  try {
    const { type } = req.params;
    const rooms = await Room.find({ type });
    res.status(200).json({ rooms });
  } catch (error) {
    console.error("Get rooms by type error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
