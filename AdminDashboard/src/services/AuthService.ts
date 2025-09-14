import axios from "axios";

// ✅ Use the same base URL for Admin APIs
const API_URL = "https://bmytsqa7b3.ap-south-1.awsapprunner.com/api/auth";

// ---------------------------
// Admin Authentication APIs
// ---------------------------

// ✅ Login
export const loginAdmin = async (email: string, password: string) => {
  return axios.post(`${API_URL}/login`, { email, password });
};

// ✅ Signup (backend expects: fullName, email, phone, password)
export const signupAdmin = async (formData: {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}) => {
  return axios.post(`${API_URL}/signup`, formData);
};

// ✅ Forgot Password
export const forgotPasswordAdmin = async (email: string, newPassword: string) => {
  return axios.post(`${API_URL}/forgot-password`, { email, newPassword });
};

// ✅ (Optional) Get All Users – for Admin dashboard
export const getAllUsersAdmin = async () => {
  return axios.get(`${API_URL}/users`);
};
