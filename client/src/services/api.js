import axios from "axios";

// Default to environment variable, fallback to localhost:5000
const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://panchayat-backend-new.onrender.com"
    : "http://localhost:5000");

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

// Request Interceptor: Attach authentication token
api.interceptors.request.use(
  (config) => {
    // Check for admin token first, then citizen token
    const adminToken = localStorage.getItem("admin_token");
    const citizenToken = localStorage.getItem("citizen_token");
    const token = adminToken || citizenToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Format error messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      "An unexpected server error occurred.";

    // Handle token expiration
    if (error.response?.status === 401) {
      // Clear expired state if needed
      console.warn("Session expired or unauthorized request:", message);
    }

    return Promise.reject(new Error(message));
  }
);

/**
 * Helper to resolve uploaded asset URLs (avatars, PDFs, attachments)
 */
export const getAssetUrl = (filePath) => {
  if (!filePath) return "";
  if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
    return filePath;
  }
  const cleanPath = filePath.startsWith("/") ? filePath : `/uploads/${filePath}`;
  return `${API_BASE_URL}${cleanPath}`;
};

export { API_BASE_URL };
export default api;
