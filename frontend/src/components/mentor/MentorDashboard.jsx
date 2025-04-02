import { useState, useEffect } from "react";
import { getMentorProfile, logoutMentor } from "../../utils/api";
import { useNavigate } from "react-router-dom";

const MentorDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("mentorToken");
      if (!token) {
        navigate("/mentor/login");
        return;
      }
      
      const response = await getMentorProfile(token);
      if (response.status === "success") {
        setProfile(response.data);
      } else {
        setError(response.message);
      }
    };
    
    fetchProfile();
  }, [navigate]);

  const handleLogout = async () => {
    const token = localStorage.getItem("mentorToken");
    await logoutMentor(token);
    localStorage.removeItem("mentorToken");
    navigate("/mentor/login");
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Mentor Dashboard</h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold">Profile Information</h2>
            <div className="mt-4 space-y-4">
              <p><strong>Username:</strong> {profile.username}</p>
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Phone:</strong> {profile.phone_number || 'Not provided'}</p>
              <p><strong>Expertise:</strong> {profile.expertise || 'Not provided'}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MentorDashboard; 