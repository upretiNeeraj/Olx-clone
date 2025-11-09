import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import CreateAd from "./pages/CreateAd"
import ProtectedRoute from "./components/ProtectedRoute";
import AllAds from "./pages/AllAds";
import AdDetails from "./pages/AdDetails.jsx";
import ChatRoom from "./pages/ChatRoom.jsx"
import Inbox from "./pages/Inbox.jsx";


const App = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Router>
      <Navbar setSearchQuery={setSearchQuery} />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<ProtectedRoute>
          <Profile /></ProtectedRoute>} />
        <Route path="/create-ad" element={<CreateAd />} />
        <Route path="/" element={<AllAds searchQuery={searchQuery} />} />
        <Route path="/ad/:id" element={<AdDetails />} />
        <Route path="/chat/:id" element={<ChatRoom />} />
        <Route path="/inbox" element={<Inbox />} />


      </Routes>


    </Router>
  );
};

export default App;

