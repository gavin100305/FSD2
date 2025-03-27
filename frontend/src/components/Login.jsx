import React, { useState } from "react";
import { loginStudent, getGitHubAuthURL } from "../utils/api";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await loginStudent(formData);
    if (response.status === "success") {
      localStorage.setItem("token", response.token);
      setMessage("Login successful! Redirecting...");
      setTimeout(() => navigate("/profile"), 2000);
    } else {
      setMessage(response.message || "Invalid credentials.");
    }
  };

  const handleGitHubLogin = async () => {
    const response = await getGitHubAuthURL();
    if (response.github_auth_url) {
      window.location.href = response.github_auth_url; // Redirect to GitHub OAuth
    } else {
      setMessage("GitHub authentication failed.");
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Login</button>
      </form>
      <button onClick={handleGitHubLogin} className="github-btn">
        Login with GitHub
      </button>
      <p>Don't have an account? <a href="/register">Register here</a></p>
    </div>
  );
};

export default Login;
