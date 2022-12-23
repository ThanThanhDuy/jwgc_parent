import axios from "axios";
import Qs from "qs";
import localService from "../services/local";
import { isAuthState } from "../stores/auth";
import { setRecoil } from "recoil-nexus";

const axiosClient = axios.create({
  baseURL: "https://www.jwgc-api.click/api/v1/",
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
      if (response.data.StatusCode === 401) {
        setRecoil(isAuthState, false);
      }
      setRecoil(isAuthState, true);
      return response.data;
    }
    return response;
  },
  (error) => {
    if (error.response.data.StatusCode === 401) {
    }
    throw error.response.data;
  }
);
export default axiosClient;
