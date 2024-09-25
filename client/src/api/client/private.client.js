import axios from "axios";
import queryString from "query-string";

const baseURL = "http://localhost:5000/api/v1";

const privateClient = axios.create({
  baseURL,
  paramsSerializer: {
    encode: params => queryString.stringify(params)
  }
});

privateClient.interceptors.request.use(async config => {
  const token = localStorage.getItem("actkn"); // Get token from localStorage
  console.log("Token:", token); // Log the token to verify it's retrieved

  return {
    ...config,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token ? token : ""}` // Attach token if available
    }
  };
}, (error) => {
  return Promise.reject(error);
});

privateClient.interceptors.response.use((response) => {
  if (response && response.data) return response.data;
  return response;
}, (err) => {
  console.error("API Error:", err); // Log the error for debugging

  // Handle cases where err.response or err.response.data is undefined
  if (!err.response || !err.response.data) {
    return Promise.reject({ message: "Server error or network issue" });
  }

  throw err.response.data;
});

export default privateClient;
