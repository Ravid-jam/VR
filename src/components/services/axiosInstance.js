import axios from "axios";
import Cookies from "js-cookie";
import config from "../../../config";

const api = axios.create({
  baseURL: config.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("refreshToken");
    if (token) {
      config.headers["Authorization"] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      console.error("Response Error:", error.response);
      if (error.response.status === 401) {
        console.warn("Unauthorized! Redirecting to login...");
      }
    } else if (error.request) {
      console.error("Request Error:", error.request);
    } else {
      console.error("General Error:", error.message);
    }

    return Promise.reject(error);
  },
);

export default api;
