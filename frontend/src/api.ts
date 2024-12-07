import { SERVER_PATHNAME } from "@utils/urls";
import axios, { AxiosInstance } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: SERVER_PATHNAME, // Replace with your API base URL
  headers: {
    Authorization: `Bearer ${sessionStorage.getItem("token")}`, // Replace with your actual token
    "Content-Type": "application/json",
  },
});

export default api;
