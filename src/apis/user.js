import axiosClient from "./index.js";
class UserApi {
  async getProfile(params) {
    const url = `users/profile`;
    return axiosClient.post(url, params);
  }
}

const userApi = new UserApi();
export default userApi;
