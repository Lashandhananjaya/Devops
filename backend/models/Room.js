import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  type: { 
    type: String, 
    enum: ["Single", "Double", "Twin", "Suite", "Deluxe"], 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  capacity: { 
    type: Number, 
    required: true,
    min: 1,
    max: 10
  },
  amenities: [{ 
    type: String 
  }],
  images: [{ 
    type: String 
  }],
  available: { 
    type: Boolean, 
    default: true 
  },
  rating: { 
    type: Number, 
    default: 4.5,
    min: 0,
    max: 5
  },
  reviews: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

export default mongoose.model("Room", roomSchema);
