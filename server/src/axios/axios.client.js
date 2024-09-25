import axios from "axios";

// Function to make a GET request
const get = async (url) => {
  // Make the GET request using axios
  const response = await axios.get(url, {
    headers: {
      Accept: "application/json",
      "Accept-Encoding": "identity"
    }
  });

  // Return the response data
  return response.data;
};

// Export the get function as default
export default { get };
