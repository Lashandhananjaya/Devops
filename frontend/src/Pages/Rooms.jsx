import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllRooms } from "../services/api";

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const data = await getAllRooms();
      setRooms(data.rooms || []);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to load rooms");
      console.error("Fetch rooms error:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredRooms = filter === "All" 
    ? rooms 
    : rooms.filter(room => room.type === filter);

  const roomTypes = ["All", "Single", "Double", "Twin", "Suite", "Deluxe"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      {/* Navigation Header */}
      <header className="w-full fixed top-0 left-0 z-50 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <Link to="/" className="text-xl font-bold text-indigo-600">Royal Stay Hotels</Link>

          <nav className="hidden md:flex items-center gap-6 text-gray-700 text-sm">
            <Link to="/" className="hover:text-indigo-600">Home</Link>
            <Link to="/rooms" className="hover:text-indigo-600 text-indigo-600 font-bold">Rooms</Link>
            <Link to="/offers" className="hover:text-indigo-600">Offers</Link>
            <Link to="/dashboard" className="hover:text-indigo-600">Dashboard</Link>
          </nav>
        </div>
      </header>

      <main className="pt-28 px-6 max-w-7xl mx-auto pb-10">
        {/* Page Title */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Our Rooms</h1>
          <p className="text-gray-600 text-lg">Choose from our luxurious collection of rooms</p>
        </div>

        {/* Filter Buttons */}
        <div className="mb-8 flex flex-wrap gap-2 justify-center">
          {roomTypes.map(type => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === type
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "bg-white text-gray-700 border border-gray-300 hover:border-indigo-600"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-gray-600 text-lg">Loading rooms...</div>
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-gray-600 text-lg">No rooms available</div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRooms.map(room => (
              <div key={room._id} className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition">
                {/* Room Image */}
                <div className="relative h-48 bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                  {room.images && room.images.length > 0 ? (
                    <img src={room.images[0]} alt={room.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-white text-4xl">🏨</div>
                  )}
                  {room.available && (
                    <span className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Available
                    </span>
                  )}
                </div>

                {/* Room Details */}
                <div className="p-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{room.name}</h3>
                  <p className="text-sm text-gray-600 text-indigo-600 font-medium mb-3">{room.type}</p>
                  
                  <p className="text-gray-700 text-sm mb-4 line-clamp-2">{room.description}</p>

                  {/* Capacity and Rating */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <span>👥 {room.capacity} Guests</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">⭐</span>
                      <span className="font-semibold text-gray-900">{room.rating}</span>
                      <span className="text-gray-600 text-sm">({room.reviews})</span>
                    </div>
                  </div>

                  {/* Amenities */}
                  {room.amenities && room.amenities.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-2">
                      {room.amenities.slice(0, 3).map((amenity, idx) => (
                        <span key={idx} className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                          {amenity}
                        </span>
                      ))}
                      {room.amenities.length > 3 && (
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          +{room.amenities.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Price and Button */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-indigo-600">${room.price}</span>
                      <span className="text-gray-600 text-sm">/night</span>
                    </div>
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-gray-700 text-sm border-t border-gray-300 mt-10">
        © {new Date().getFullYear()} Royal Stay Hotels. All rights reserved.
      </footer>
    </div>
  );
}
