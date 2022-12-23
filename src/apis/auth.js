import axiosClient from "./index.js";
class AuthApi {
  async login(params) {
    const url = `users/login`;
    return axiosClient.post(url, params);
  }

  async register(params) {
    const url = `users`;
    return axiosClient.post(url, params);
  }
}

const authApi = new AuthApi();
export default authApi;
