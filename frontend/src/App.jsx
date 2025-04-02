import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import MentorLogin from "./components/mentor/MentorLogin";
import MentorRegister from "./components/mentor/MentorRegister";
import MentorDashboard from "./components/mentor/MentorDashboard";
import CollegeLogin from "./components/college/CollegeLogin";
import CollegeRegister from "./components/college/CollegeRegister";
import CollegeDashboard from "./components/college/CollegeDashboard";
import StudentDashboard from "./components/StudentDashboard";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Student routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<StudentDashboard />} />
        
        {/* Mentor routes */}
        <Route path="/mentor/register" element={<MentorRegister />} />
        <Route path="/mentor/login" element={<MentorLogin />} />
        <Route path="/mentor/dashboard" element={<MentorDashboard />} />

        {/* College routes */}
        <Route path="/college/register" element={<CollegeRegister />} />
        <Route path="/college/login" element={<CollegeLogin />} />
        <Route path="/college/dashboard" element={<CollegeDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
