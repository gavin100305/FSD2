import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api"; // Changed base path to api/

// Create an instance of axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Register a student
export const registerStudent = async (studentData) => {
  try {
    const response = await api.post("/students/register/", studentData);
    return response.data;
  } catch (error) {
    return error.response?.data || { status: "error", message: "Something went wrong" };
  }
};

// Login a student
export const loginStudent = async (credentials) => {
  try {
    const response = await api.post("/students/login/", credentials);
    return response.data;
  } catch (error) {
    return error.response?.data || { status: "error", message: "Invalid credentials" };
  }
};

// Logout a student
export const logoutStudent = async (token) => {
  try {
    const response = await api.post("/students/logout/", null, {
      headers: { Authorization: `Token ${token}` },
    });
    return response.data;
  } catch (error) {
    return error.response?.data || { status: "error", message: "Logout failed" };
  }
};

// Get student profile
export const getStudentProfile = async (token) => {
  try {
    const response = await api.get("/students/profile/", {
      headers: { Authorization: `Token ${token}` },
    });
    return response.data;
  } catch (error) {
    return error.response?.data || { status: "error", message: "Unauthorized" };
  }
};

// GitHub OAuth Login
export const getGitHubAuthURL = async () => {
  try {
      const response = await fetch("http://127.0.0.1:8000/api/students/github_login/");
      return await response.json();  // ✅ Convert response to JSON
  } catch (error) {
      console.error("GitHub Auth URL fetch error:", error);
      return { error: "Failed to fetch GitHub auth URL" };
  }
};

// Handle GitHub OAuth Callback
export const githubCallback = async (code) => {
  try {
    const response = await api.get(`/students/github_callback/?code=${code}`);
    return response.data;
  } catch (error) {
    return error.response?.data || { status: "error", message: "GitHub authentication failed" };
  }
};
