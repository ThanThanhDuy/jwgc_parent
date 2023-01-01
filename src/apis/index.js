import axios from "axios";
import Qs from "qs";
import { BASE_URL } from "../constants/commons";
import localService from "../services/local";
// import { redirect } from "react-router-dom";

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  paramsSerializer: {
    serialize: (params) => Qs.stringify(params, { arrayFormat: "brackets" }),
  },
});

axiosClient.interceptors.request.use(async (config) => {
  const accessToken = localService.getAccessToken();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    if (error.response.data.StatusCode === 401) {
      localService.removeAccessToken();
      localService.removeUser();
    }
    throw error.response.data;
  }
);
export default axiosClient;
