import axiosClient from "./index.js";
class AuthApi {
  async login(params) {
    const url = `users/login/user`;
    return axiosClient.post(url, params);
  }

  async register(params) {
    const url = `users`;
    return axiosClient.post(url, params);
  }

  async sendLinkToResetPassword(email, username) {
    const url = `users/email/${email}/password-reset/${username}`;
    return axiosClient.post(url);
  }
}

const authApi = new AuthApi();
export default authApi;
