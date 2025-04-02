import { useState } from "react";
import { loginStudent, getGitHubAuthURL, githubCallback } from "../utils/api";
import { useNavigate, useLocation } from "react-router-dom";
import { Github } from "lucide-react";

const Login = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle input change
  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await loginStudent(credentials);
    if (response.status === "success") {
      localStorage.setItem("token", response.token);
      navigate("/dashboard");
    } else {
      setError(response.message);
    }
  };

  // Handle GitHub OAuth Login
  const handleGitHubLogin = async () => {
    try {
      const response = await getGitHubAuthURL();
      console.log("GitHub Auth URL:", response.github_auth_url); // Debugging
  
      if (response.github_auth_url) {
        window.location.href = response.github_auth_url;  // Redirect to GitHub login page
      } else {
        setError("GitHub OAuth failed: No auth URL received");
      }
    } catch (error) {
      console.error("GitHub login error:", error);
      setError("GitHub OAuth request failed");
    }
  };
  
  // Handle GitHub OAuth Callback (Runs only when redirected back from GitHub)
  const handleGitHubCallback = async () => {
    const params = new URLSearchParams(location.search);
    const code = params.get("code");
    if (code) {
      const response = await githubCallback(code);
      if (response.status === "success") {
        localStorage.setItem("token", response.token);
        navigate("/profile");
      } else {
        setError(response.message);
      }
    }
  };

  // Run GitHub callback if the URL has a code
  useState(() => {
    handleGitHubCallback();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Username"
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
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in
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
            Sign in with GitHub
          </button>
        </div>

        <div className="text-center">
          <p className="mt-2 text-sm text-gray-600">
            Don't have an account?{" "}
            <a href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
              Register here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;