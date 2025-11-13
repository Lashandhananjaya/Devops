import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout, getUser } from "../services/api";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      navigate("/login");
    } else {
      setUser(currentUser);
    }
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">

      {/* Navigation Header */}
      <header className="w-full fixed top-0 left-0 z-50 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold text-indigo-600">Royal Stay Dashboard</h1>

          {/* Right Side Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-gray-700 text-sm">
            <Link className="hover:text-indigo-600" to="/">Home</Link>
            <Link className="hover:text-indigo-600" to="/dashboard">Dashboard</Link>
            <Link className="hover:text-indigo-600" to="/rooms">Rooms</Link>
            <Link className="hover:text-indigo-600" to="/offers">Offers</Link>
            <button onClick={handleLogout} className="text-red-500 hover:underline">Logout</button>
          </nav>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="pt-28 px-6 max-w-7xl mx-auto">

        {/* Welcome Card */}
        <div className="mb-8 bg-white/80 backdrop-blur-md border border-white/40 rounded-xl p-6 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 drop-shadow mb-2">
            Welcome, {user.name}!
          </h2>
          <p className="text-gray-700">
            Email: {user.email}
          </p>
          <p className="text-gray-700">
            Here's a summary of your recent bookings and offers.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white/80 backdrop-blur-md border border-white/40 rounded-xl p-6 shadow-lg text-center">
            <h3 className="text-xl font-semibold text-gray-900 drop-shadow mb-2">Upcoming Bookings</h3>
            <p className="text-gray-900 text-3xl font-bold drop-shadow">3</p>
          </div>
          <div className="bg-white/80 backdrop-blur-md border border-white/40 rounded-xl p-6 shadow-lg text-center">
            <h3 className="text-xl font-semibold text-gray-900 drop-shadow mb-2">Available Rooms</h3>
            <p className="text-gray-900 text-3xl font-bold drop-shadow">12</p>
          </div>
          <div className="bg-white/80 backdrop-blur-md border border-white/40 rounded-xl p-6 shadow-lg text-center">
            <h3 className="text-xl font-semibold text-gray-900 drop-shadow mb-2">Special Offers</h3>
            <p className="text-gray-900 text-3xl font-bold drop-shadow">2</p>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white/90 backdrop-blur-md border border-white/40 rounded-xl p-6 shadow-lg overflow-x-auto">
          <h3 className="text-2xl font-bold text-gray-900 drop-shadow mb-4">Your Bookings</h3>
          <table className="w-full text-gray-900 text-left border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b border-gray-300">Room</th>
                <th className="py-2 px-4 border-b border-gray-300">Check-in</th>
                <th className="py-2 px-4 border-b border-gray-300">Check-out</th>
                <th className="py-2 px-4 border-b border-gray-300">Guests</th>
                <th className="py-2 px-4 border-b border-gray-300">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-100 transition">
                <td className="py-2 px-4 border-b border-gray-200">Deluxe King</td>
                <td className="py-2 px-4 border-b border-gray-200">2025-11-15</td>
                <td className="py-2 px-4 border-b border-gray-200">2025-11-18</td>
                <td className="py-2 px-4 border-b border-gray-200">2</td>
                <td className="py-2 px-4 border-b border-gray-200">Confirmed</td>
              </tr>
              <tr className="hover:bg-gray-100 transition">
                <td className="py-2 px-4 border-b border-gray-200">Standard Twin</td>
                <td className="py-2 px-4 border-b border-gray-200">2025-12-01</td>
                <td className="py-2 px-4 border-b border-gray-200">2025-12-03</td>
                <td className="py-2 px-4 border-b border-gray-200">1</td>
                <td className="py-2 px-4 border-b border-gray-200">Pending</td>
              </tr>
            </tbody>
          </table>
        </div>

      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-gray-700 text-sm border-t border-gray-300 mt-10">
        © {new Date().getFullYear()} Royal Stay Hotels. All rights reserved.
      </footer>
    </div>
  );
}
