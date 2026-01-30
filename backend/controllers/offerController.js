import Offer from "../models/Offer.js";

// Get all offers
export const getAllOffers = async (req, res) => {
  try {
    const offers = await Offer.find();
    res.status(200).json({ offers });
  } catch (error) {
    console.error("Get offers error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get single offer by ID
export const getOfferById = async (req, res) => {
  try {
    const { id } = req.params;
    const offer = await Offer.findById(id);
    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }
    res.status(200).json({ offer });
  } catch (error) {
    console.error("Get offer error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create new offer (Admin only)
export const createOffer = async (req, res) => {
  try {
    const { title, description, discount, offerType, applicableRoomTypes, validFrom, validUntil, image, code } = req.body;

    if (!title || !description || !discount || !validFrom || !validUntil) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    const newOffer = new Offer({
      title,
      description,
      discount,
      offerType: offerType || "percentage",
      applicableRoomTypes: applicableRoomTypes || [],
      validFrom,
      validUntil,
      image,
      code,
    });

    await newOffer.save();
    res.status(201).json({ message: "Offer created successfully", offer: newOffer });
  } catch (error) {
    console.error("Create offer error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update offer
export const updateOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const offer = await Offer.findByIdAndUpdate(id, updates, { new: true });
    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    res.status(200).json({ message: "Offer updated successfully", offer });
  } catch (error) {
    console.error("Update offer error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete offer
export const deleteOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const offer = await Offer.findByIdAndDelete(id);
    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }
    res.status(200).json({ message: "Offer deleted successfully" });
  } catch (error) {
    console.error("Delete offer error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get active offers
export const getActiveOffers = async (req, res) => {
  try {
    const now = new Date();
    const offers = await Offer.find({
      active: true,
      validFrom: { $lte: now },
      validUntil: { $gte: now }
    });
    res.status(200).json({ offers });
  } catch (error) {
    console.error("Get active offers error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get offer by code
export const getOfferByCode = async (req, res) => {
  try {
    const { code } = req.params;
    const now = new Date();
    const offer = await Offer.findOne({
      code,
      active: true,
      validFrom: { $lte: now },
      validUntil: { $gte: now }
    });
    if (!offer) {
      return res.status(404).json({ message: "Invalid or expired offer code" });
    }
    res.status(200).json({ offer });
  } catch (error) {
    console.error("Get offer by code error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
