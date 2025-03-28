import { useState } from "react";
import { registerStudent, getGitHubAuthURL } from "../utils/api";
import { useNavigate } from "react-router-dom";
import { Github } from "lucide-react";

const Register = () => {
  const [userData, setUserData] = useState({
    username: "",
    password: "",
    email: "",
    phone_number: "",
    github_username: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  // Handle registration
  const handleRegister = async (e) => {
    e.preventDefault();
    const response = await registerStudent(userData);
    if (response.status === "success") {
      navigate("/login");
    } else {
      setError(response.message);
    }
  };

  // Handle GitHub OAuth Registration
  const handleGitHubLogin = async () => {
    try {
        const response = await getGitHubAuthURL();
        console.log("GitHub Auth URL:", response.github_auth_url);
        if (response.github_auth_url) {
            window.location.href = response.github_auth_url;  // ✅ This correctly redirects
        } else {
            setError("GitHub OAuth failed: No auth URL received");
        }
    } catch (error) {
        console.error("GitHub login error:", error);
        setError("GitHub OAuth request failed");
    }
};
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Username"
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email"
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="phone_number" className="sr-only">Phone Number</label>
              <input
                id="phone_number"
                name="phone_number"
                type="text"
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Phone Number (Optional)"
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="github_username" className="sr-only">GitHub Username</label>
              <input
                id="github_username"
                name="github_username"
                type="text"
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="GitHub Username (Optional)"
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Register
            </button>
          </div>
        </form>

        <div className="flex items-center justify-center">
          <div className="w-full border-t border-gray-300"></div>
          <div className="px-4 text-gray-500">Or</div>
          <div className="w-full border-t border-gray-300"></div>
        </div>

        <div>
          <button
            onClick={handleGitHubLogin}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              <Github className="h-5 w-5 text-gray-100 group-hover:text-white" />
            </span>
            Register with GitHub
          </button>
        </div>

        <div className="text-center">
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;