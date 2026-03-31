import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAvailableRooms, getActiveOffers, getUser, logout } from "../services/api";

export default function Home() {
  const [rooms, setRooms] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [loadingOffers, setLoadingOffers] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = getUser();
    setUser(currentUser);
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate("/");
  };

  useEffect(() => {
    fetchFeaturedRooms();
    fetchActiveOffers();
  }, []);

  const fetchFeaturedRooms = async () => {
    try {
      const data = await getAvailableRooms();
      setRooms((data.rooms || []).slice(0, 3));
    } catch (err) {
      console.error("Failed to fetch rooms:", err);
    } finally {
      setLoadingRooms(false);
    }
  };

  const fetchActiveOffers = async () => {
    try {
      const data = await getActiveOffers();
      setOffers((data.offers || []).slice(0, 3));
    } catch (err) {
      console.error("Failed to fetch offers:", err);
    } finally {
      setLoadingOffers(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">

      {/* Navigation Header */}
      <header className="w-full fixed top-0 left-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

          {/* Left Side: Logo */}
          <Link to="/" className="text-xl font-bold text-indigo-600">Royal Stay Hotels</Link>

          {/* Right Side: Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-gray-700 text-sm">
            <Link to="/" className="hover:text-indigo-600 cursor-pointer font-medium">Home</Link>
            <Link to="/rooms" className="hover:text-indigo-600 cursor-pointer">Rooms</Link>
            <Link to="/offers" className="hover:text-indigo-600 cursor-pointer">Offers</Link>
            <a href="#contact" className="hover:text-indigo-600 cursor-pointer">Contact</a>
            
            {user ? (
              <>
                <Link to="/dashboard" className="hover:text-indigo-600 cursor-pointer font-medium">Dashboard</Link>
                <button onClick={handleLogout} className="text-red-500 hover:underline font-medium">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm text-gray-700 hover:text-indigo-600 transition">
                  Login
                </Link>
                <Link to="/signup" className="text-sm bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-md transition">
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-28 pb-20 bg-[url('https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1350&q=80')] bg-cover bg-center bg-fixed text-center">
        <div className="bg-black/40 w-full h-full py-32 flex flex-col items-center justify-center">
          <h1 className="text-white text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">
            Your Perfect Stay Awaits
          </h1>
          <p className="text-white text-lg md:text-xl mb-8 max-w-xl">
            Book a room that suits your comfort and enjoy an unforgettable experience.
          </p>
          <div className="flex gap-4">
            <Link to="/rooms" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-bold transition shadow-lg">
              Explore Rooms
            </Link>
            <Link to="/offers" className="bg-white hover:bg-gray-100 text-indigo-600 px-8 py-3 rounded-lg font-bold transition shadow-lg">
              View Offers
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Rooms Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Rooms</h2>
            <p className="text-gray-600 text-lg">Discover our most popular accommodations</p>
          </div>

          {loadingRooms ? (
            <div className="text-center py-10 text-gray-600">Loading rooms...</div>
          ) : rooms.length === 0 ? (
            <div className="text-center py-10 text-gray-600">No rooms available at the moment</div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {rooms.map(room => (
                <div key={room._id} className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition">
                  <div className="relative h-40 bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                    {room.images && room.images.length > 0 ? (
                      <img src={room.images[0]} alt={room.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-white text-4xl">🏨</div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{room.name}</h3>
                    <p className="text-sm text-indigo-600 font-medium mb-2">{room.type}</p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-indigo-600">${room.price}</span>
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">⭐</span>
                        <span className="font-semibold text-sm">{room.rating}</span>
                      </div>
                    </div>
                    <Link to="/rooms" className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white text-center py-2 rounded-lg font-medium transition">
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link to="/rooms" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-bold transition">
              View All Rooms
            </Link>
          </div>
        </div>
      </section>

      {/* Special Offers Section */}
      <section className="py-16 px-6 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Special Offers</h2>
            <p className="text-gray-600 text-lg">Limited time deals on your favorite rooms</p>
          </div>

          {loadingOffers ? (
            <div className="text-center py-10 text-gray-600">Loading offers...</div>
          ) : offers.length === 0 ? (
            <div className="text-center py-10 text-gray-600">No active offers at the moment</div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {offers.map(offer => (
                <div key={offer._id} className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition border-l-4 border-indigo-600">
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">{offer.title}</h3>
                    <div className="text-3xl font-bold">{offer.discount}% OFF</div>
                  </div>
                  <div className="p-4">
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{offer.description}</p>
                    {offer.code && (
                      <div className="p-2 bg-gray-50 rounded mb-3 font-mono text-sm font-bold text-indigo-600 text-center">
                        {offer.code}
                      </div>
                    )}
                    <Link to="/offers" className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white text-center py-2 rounded-lg font-medium transition">
                      Learn More
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link to="/offers" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-bold transition">
              View All Offers
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Us?</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">🏆</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Best Rates</h3>
              <p className="text-gray-600">Competitive pricing with special discounts</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🛏️</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Luxury Rooms</h3>
              <p className="text-gray-600">Comfortable and well-equipped rooms</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">👥</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-gray-600">Expert customer service anytime</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">📍</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Prime Location</h3>
              <p className="text-gray-600">Centrally located with easy access</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-7xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Book?</h2>
          <p className="text-lg mb-8 text-indigo-100">Start your journey with us today</p>
          <div className="flex gap-4 justify-center">
            <Link to="/signup" className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-bold transition">
              Create Account
            </Link>
            <Link to="/rooms" className="border-2 border-white text-white hover:bg-white hover:text-indigo-600 px-8 py-3 rounded-lg font-bold transition">
              Browse Rooms
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-gray-500 text-sm border-t bg-gray-50">
        © {new Date().getFullYear()} Royal Stay Hotels. All rights reserved.
      </footer>

    </div>
  );
}
