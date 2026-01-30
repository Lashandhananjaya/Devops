import express from "express";
import {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  getAvailableRooms,
  getRoomsByType
} from "../controllers/roomController.js";

const router = express.Router();

// Get all rooms
router.get("/", getAllRooms);

// Get available rooms
router.get("/available", getAvailableRooms);

// Get rooms by type
router.get("/type/:type", getRoomsByType);

// Get single room
router.get("/:id", getRoomById);

// Create room (Admin)
router.post("/", createRoom);

// Update room (Admin)
router.put("/:id", updateRoom);

// Delete room (Admin)
router.delete("/:id", deleteRoom);

export default router;
