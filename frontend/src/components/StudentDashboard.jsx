import { useState, useEffect } from "react";
import { getStudentProfile } from "../utils/api";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

const StudentDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      
      const response = await getStudentProfile(token);
      if (response.status === "success") {
        setProfile(response.data);
      } else {
        setError(response.message);
      }
    };
    
    fetchProfile();
  }, [navigate]);

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Student Dashboard</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <h2 className="text-lg font-semibold text-indigo-900 mb-3">Profile Information</h2>
                  <div className="space-y-2">
                    <p><span className="font-medium">Username:</span> {profile.username}</p>
                    <p><span className="font-medium">Email:</span> {profile.email}</p>
                    <p><span className="font-medium">Student ID:</span> {profile.student_id || 'Not set'}</p>
                    <p><span className="font-medium">Phone:</span> {profile.phone_number || 'Not set'}</p>
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <h2 className="text-lg font-semibold text-purple-900 mb-3">GitHub Information</h2>
                  <div className="space-y-2">
                    <p><span className="font-medium">GitHub Username:</span> {profile.github_username || 'Not connected'}</p>
                    {profile.github_url && (
                      <p>
                        <span className="font-medium">GitHub Profile:</span>{" "}
                        <a href={profile.github_url} className="text-indigo-600 hover:text-indigo-800" target="_blank" rel="noopener noreferrer">
                          View Profile
                        </a>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard; 