import { useState } from "react";
import { loginStudent, getGitHubAuthURL, githubCallback } from "../utils/api";
import { useNavigate, useLocation } from "react-router-dom";

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
      navigate("/profile");
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
    <div className="login-container">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      
      <form onSubmit={handleLogin}>
        <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Login</button>
      </form>

      <p>Or</p>

      <button onClick={handleGitHubLogin} className="github-btn">
        Login with GitHub
      </button>

      <p>Don't have an account? <a href="/register">Register here</a></p>
    </div>
  );
};

export default Login;
