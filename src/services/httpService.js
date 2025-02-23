import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:1880",
  withCredentials: false,
});

const http = {
  get: axiosInstance.get,
  post: axiosInstance.post,
  put: axiosInstance.put,
  delete: axiosInstance.delete,
};

export default http;
