import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { MockEndPoints } from "__server__";

// Axios instance
const axiosInstance = axios.create({
   baseURL: process.env.NEXT_APP_API_URL,
  // Axios configuration options here
});

// Remove following 2 lines if you don't want to use MockAdapter
export const Mock = new MockAdapter(axiosInstance);
MockEndPoints(Mock);

export default axiosInstance;
