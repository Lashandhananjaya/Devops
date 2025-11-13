import mongoose from "mongoose";

const offerSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  discount: { 
    type: Number, 
    required: true,
    min: 0,
    max: 100
  },
  offerType: { 
    type: String, 
    enum: ["percentage", "fixed"], 
    default: "percentage"
  },
  applicableRoomTypes: [{ 
    type: String 
  }],
  validFrom: { 
    type: Date, 
    required: true 
  },
  validUntil: { 
    type: Date, 
    required: true 
  },
  image: { 
    type: String 
  },
  code: { 
    type: String, 
    unique: true,
    sparse: true
  },
  active: { 
    type: Boolean, 
    default: true 
  }
}, { timestamps: true });

export default mongoose.model("Offer", offerSchema);
