import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Signup from "./Pages/SignUp";
import Dashboard from "./Pages/Dashboard";
import Rooms from "./Pages/Rooms";
import Offers from "./Pages/Offers";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/offers" element={<Offers />} />
      </Routes>
    </Router>
  );
}

export default App;
