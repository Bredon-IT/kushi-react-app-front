import axios from "axios";

const API_URL = "https://bmytsqa7b3.ap-south-1.awsapprunner.com/api/auth";

// Login
export const loginAdmin = async (email: string, password: string) => {
  return axios.post(`${API_URL}/login`, { email, password });
};

// Signup
export const signupAdmin = async (formData: {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}) => {
  return axios.post(`${API_URL}/signup`, formData);
};

// Forgot password
export const forgotPasswordAdmin = async (
  email: string,
  newPassword: string
) => {
  return axios.post(`${API_URL}/forgot-password`, { email, newPassword });
};
