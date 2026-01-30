import mongoose from "mongoose";
import dotenv from "dotenv";
import Room from "./models/Room.js";
import Offer from "./models/Offer.js";

dotenv.config();

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await Room.deleteMany({});
    await Offer.deleteMany({});
    console.log("🗑️  Cleared existing data");

    // Sample Rooms Data
    const roomsData = [
      {
        name: "Deluxe King",
        description: "Luxurious king-sized room with premium amenities and city view",
        type: "Deluxe",
        price: 250,
        capacity: 2,
        amenities: ["Free WiFi", "Air Conditioning", "Flat Screen TV", "Mini Bar", "Bath Robe", "Premium Toiletries"],
        images: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80"],
        available: true,
        rating: 4.8,
        reviews: 342
      },
      {
        name: "Standard Twin",
        description: "Comfortable twin beds room perfect for friends or colleagues",
        type: "Twin",
        price: 150,
        capacity: 2,
        amenities: ["Free WiFi", "Air Conditioning", "Flat Screen TV", "Work Desk"],
        images: ["https://images.unsplash.com/photo-1591088398332-8c5ef4d88b47?auto=format&fit=crop&w=800&q=80"],
        available: true,
        rating: 4.5,
        reviews: 215
      },
      {
        name: "Suite Paradise",
        description: "Spacious suite with separate living area and bedroom",
        type: "Suite",
        price: 350,
        capacity: 4,
        amenities: ["Free WiFi", "Living Room", "Kitchen", "Jacuzzi", "Concierge", "24/7 Room Service"],
        images: ["https://images.unsplash.com/photo-1578500494198-246f612d03b3?auto=format&fit=crop&w=800&q=80"],
        available: true,
        rating: 4.9,
        reviews: 189
      },
      {
        name: "Cozy Single",
        description: "Perfect single room for solo travelers",
        type: "Single",
        price: 99,
        capacity: 1,
        amenities: ["Free WiFi", "Compact Bathroom", "Work Area"],
        images: ["https://images.unsplash.com/photo-1540932239986-310128078ceb?auto=format&fit=crop&w=800&q=80"],
        available: true,
        rating: 4.3,
        reviews: 128
      },
      {
        name: "Double Comfort",
        description: "Standard double room with all essential amenities",
        type: "Double",
        price: 180,
        capacity: 2,
        amenities: ["Free WiFi", "Air Conditioning", "Flat Screen TV", "Safe"],
        images: ["https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=800&q=80"],
        available: true,
        rating: 4.6,
        reviews: 267
      },
      {
        name: "Royal Suite",
        description: "Our most luxurious suite with premium service",
        type: "Suite",
        price: 500,
        capacity: 6,
        amenities: ["Butler Service", "Private Spa", "Wine Cellar", "Chef Kitchen", "Personal Concierge"],
        images: ["https://images.unsplash.com/photo-1569457472513-480c042a8e09?auto=format&fit=crop&w=800&q=80"],
        available: true,
        rating: 5.0,
        reviews: 95
      }
    ];

    // Sample Offers Data
    const now = new Date();
    const offersData = [
      {
        title: "Early Bird Special",
        description: "Book 7 days in advance and get 20% off on all room types",
        discount: 20,
        offerType: "percentage",
        applicableRoomTypes: ["Single", "Double", "Twin"],
        validFrom: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        validUntil: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
        code: "EARLYBIRD20",
        active: true
      },
      {
        title: "Weekend Getaway",
        description: "Get 25% discount on Friday and Saturday stays for Suites and Deluxe rooms",
        discount: 25,
        offerType: "percentage",
        applicableRoomTypes: ["Suite", "Deluxe"],
        validFrom: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        validUntil: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000),
        code: "WEEKEND25",
        active: true
      },
      {
        title: "Extended Stay",
        description: "Stay 3+ nights and receive 30% off your total bill",
        discount: 30,
        offerType: "percentage",
        applicableRoomTypes: [],
        validFrom: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
        validUntil: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000),
        code: "STAY30",
        active: true
      },
      {
        title: "Loyal Guest Bonus",
        description: "$50 off on your next booking. Rewards program members only",
        discount: 50,
        offerType: "fixed",
        applicableRoomTypes: ["Double", "Suite"],
        validFrom: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        validUntil: new Date(now.getTime() + 120 * 24 * 60 * 60 * 1000),
        code: "LOYAL50",
        active: true
      }
    ];

    // Insert data
    const createdRooms = await Room.insertMany(roomsData);
    console.log(`✅ Created ${createdRooms.length} rooms`);

    const createdOffers = await Offer.insertMany(offersData);
    console.log(`✅ Created ${createdOffers.length} offers`);

    console.log("\n🎉 Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
