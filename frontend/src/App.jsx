import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import MentorLogin from "./components/mentor/MentorLogin";
import MentorRegister from "./components/mentor/MentorRegister";
import MentorDashboard from "./components/mentor/MentorDashboard";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Student routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        
        {/* Mentor routes */}
        <Route path="/mentor/register" element={<MentorRegister />} />
        <Route path="/mentor/login" element={<MentorLogin />} />
        <Route path="/mentor/dashboard" element={<MentorDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
