import { useState } from "react";
import { registerStudent, getGitHubAuthURL } from "../utils/api";
import { useNavigate } from "react-router-dom";

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
            window.location.replace(response.github_auth_url);
        } else {
            setError("GitHub OAuth failed: No auth URL received");
        }
    } catch (error) {
        console.error("GitHub login error:", error);
        setError("GitHub OAuth request failed");
    }
  };

  

  return (
    <div className="register-container">
      <h2>Register</h2>
      {error && <p className="error">{error}</p>}
      
      <form onSubmit={handleRegister}>
        <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <input type="text" name="phone_number" placeholder="Phone Number" onChange={handleChange} />
        <input type="text" name="github_username" placeholder="GitHub Username" onChange={handleChange} />
        <button type="submit">Register</button>
      </form>

      <p>Or</p>

      <button onClick={handleGitHubLogin} className="github-btn">
        Register with GitHub
      </button>

      <p>Already have an account? <a href="/login">Login here</a></p>
    </div>
  );
};

export default Register;
