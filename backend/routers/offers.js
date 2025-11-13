import express from "express";
import {
  getAllOffers,
  getOfferById,
  createOffer,
  updateOffer,
  deleteOffer,
  getActiveOffers,
  getOfferByCode
} from "../controllers/offerController.js";

const router = express.Router();

// Get all offers
router.get("/", getAllOffers);

// Get active offers
router.get("/active", getActiveOffers);

// Get offer by code
router.get("/code/:code", getOfferByCode);

// Get single offer
router.get("/:id", getOfferById);

// Create offer (Admin)
router.post("/", createOffer);

// Update offer (Admin)
router.put("/:id", updateOffer);

// Delete offer (Admin)
router.delete("/:id", deleteOffer);

export default router;
