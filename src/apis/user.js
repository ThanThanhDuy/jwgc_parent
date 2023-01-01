import axiosClient from "./index.js";
class UserApi {
  async getProfile(params) {
    const url = `users/profile`;
    return axiosClient.post(url, params);
  }

  async getProfileByUsername(userName) {
    const url = `users/profile/${userName}`;
    return axiosClient.get(url);
  }

  async updateProfile(params) {
    const url = `users/profile`;
    return axiosClient.put(url, params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  async sendLinkToVerifyEmail() {
    const url = `users/email/verification`;
    return axiosClient.post(url);
  }

  async sendLinkToVerifyPhone() {
    const url = `users/phone/verification`;
    return axiosClient.post(url);
  }

  async updatePassword(params) {
    const url = `users/password`;
    return axiosClient.put(url, params);
  }
}

const userApi = new UserApi();
export default userApi;
