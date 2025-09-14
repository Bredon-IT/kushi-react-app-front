import axios from "axios";

// ✅ Base URL for your backend (same as customer app)
const API_URL = "https://bmytsqa7b3.ap-south-1.awsapprunner.com/api/auth";

// ---------------------------
// Admin Authentication APIs
// ---------------------------

// Login
export const loginAdmin = async (email: string, password: string) => {
  return axios.post(`${API_URL}/login`, { email, password });
};

// Signup (use /register, not /signup)
export const signupAdmin = async (formData: {
  adminname: string;      // ✅ matches your Login.tsx
  email: string;
  phoneNumber: string;
  password: string;
}) => {
  return axios.post(`${API_URL}/register`, formData);
};

// Forgot Password
export const forgotPasswordAdmin = async (
  email: string,
  newPassword: string
) => {
  return axios.post(`${API_URL}/forgot-password`, { email, newPassword });
};

// Get All Users – optional for Admin Dashboard
export const getAllUsersAdmin = async () => {
  return axios.get(`${API_URL}/users`);
};
