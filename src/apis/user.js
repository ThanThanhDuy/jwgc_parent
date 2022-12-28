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
}

const userApi = new UserApi();
export default userApi;
