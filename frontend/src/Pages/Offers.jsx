import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllOffers, getActiveOffers } from "../services/api";

export default function Offers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOffers();
  }, [filter]);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      let data;
      if (filter === "active") {
        data = await getActiveOffers();
      } else {
        data = await getAllOffers();
      }
      setOffers(data.offers || []);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to load offers");
      console.error("Fetch offers error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      {/* Navigation Header */}
      <header className="w-full fixed top-0 left-0 z-50 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <Link to="/" className="text-xl font-bold text-indigo-600">Royal Stay Hotels</Link>

          <nav className="hidden md:flex items-center gap-6 text-gray-700 text-sm">
            <Link to="/" className="hover:text-indigo-600">Home</Link>
            <Link to="/rooms" className="hover:text-indigo-600">Rooms</Link>
            <Link to="/offers" className="hover:text-indigo-600 text-indigo-600 font-bold">Offers</Link>
            <Link to="/dashboard" className="hover:text-indigo-600">Dashboard</Link>
          </nav>
        </div>
      </header>

      <main className="pt-28 px-6 max-w-7xl mx-auto pb-10">
        {/* Page Title */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Special Offers</h1>
          <p className="text-gray-600 text-lg">Exclusive deals and discounts on our best rooms</p>
        </div>

        {/* Filter Buttons */}
        <div className="mb-8 flex gap-4 justify-center">
          <button
            onClick={() => setFilter("all")}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              filter === "all"
                ? "bg-indigo-600 text-white shadow-lg"
                : "bg-white text-gray-700 border border-gray-300 hover:border-indigo-600"
            }`}
          >
            All Offers
          </button>
          <button
            onClick={() => setFilter("active")}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              filter === "active"
                ? "bg-indigo-600 text-white shadow-lg"
                : "bg-white text-gray-700 border border-gray-300 hover:border-indigo-600"
            }`}
          >
            Active Now
          </button>
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
            <div className="text-gray-600 text-lg">Loading offers...</div>
          </div>
        ) : offers.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-gray-600 text-lg">No offers available</div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {offers.map(offer => (
              <div key={offer._id} className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition border-l-4 border-indigo-600">
                {/* Offer Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white relative">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-2">{offer.title}</h3>
                      <p className="text-indigo-100 text-sm mb-4">{offer.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-bold">{offer.discount}%</div>
                      <div className="text-sm text-indigo-100">OFF</div>
                    </div>
                  </div>
                </div>

                {/* Offer Details */}
                <div className="p-6">
                  {/* Valid Dates */}
                  <div className="mb-4 flex gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-semibold text-gray-900">Valid From:</span>
                      <div>{new Date(offer.validFrom).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900">Valid Until:</span>
                      <div>{new Date(offer.validUntil).toLocaleDateString()}</div>
                    </div>
                  </div>

                  {/* Applicable Rooms */}
                  {offer.applicableRoomTypes && offer.applicableRoomTypes.length > 0 && (
                    <div className="mb-4">
                      <span className="font-semibold text-gray-900 block mb-2">Applicable Rooms:</span>
                      <div className="flex flex-wrap gap-2">
                        {offer.applicableRoomTypes.map((roomType, idx) => (
                          <span key={idx} className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                            {roomType}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Discount Type */}
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <span className="text-xs font-semibold text-gray-600 uppercase">
                      {offer.offerType === "percentage" ? "Percentage Discount" : "Fixed Amount"}
                    </span>
                  </div>

                  {/* Promo Code */}
                  {offer.code && (
                    <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg mb-4">
                      <div className="text-sm text-gray-600 mb-1">Promo Code:</div>
                      <div className="text-lg font-bold text-indigo-600 font-mono">{offer.code}</div>
                    </div>
                  )}

                  {/* Action Button */}
                  <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition">
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Promo Code Section */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Have a Promo Code?</h2>
          <p className="text-gray-600 mb-6">Enter your promo code to see the discount</p>
          <div className="flex gap-2 max-w-md mx-auto">
            <input
              type="text"
              placeholder="Enter promo code"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600"
            />
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition">
              Verify
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-gray-700 text-sm border-t border-gray-300 mt-10">
        © {new Date().getFullYear()} Royal Stay Hotels. All rights reserved.
      </footer>
    </div>
  );
}
