import axios from "axios";

// ✅ Change this to IP if testing on phone: e.g., http://192.168.1.5:8000
const BASE_URL = "http://10.102.142.75:8000"; // not localhost

export const predictDemand = async (city, month) => {
  try {
    const response = await axios.post(`${BASE_URL}/predict`, {
      city,
      month,
    });
    return response.data;
  } catch (error) {
    console.error("Predict API error:", error.message);
    return { error: "Prediction failed" };
  }
};

export const suggestCabinetItems = async (product) => {
  try {
    // Use POST with JSON body
    const response = await axios.post(`${BASE_URL}/suggest/`, { product });
    return response.data;
  } catch (error) {
    console.error("Suggest API error:", error.message);
    return { error: "Suggestion failed" };
  }
};
