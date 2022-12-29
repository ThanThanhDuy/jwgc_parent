import userApi from "../apis/user";

class UserService {
  async getProfile() {
    const params = {
      FCMToken: "",
    };
    try {
      var response = await userApi.getProfile(params);
    } catch (error) {
      return error;
    }
    return response;
  }

  async getProfileByUsername({ userName }) {
    try {
      var response = await userApi.getProfileByUsername(userName);
    } catch (error) {
      return error;
    }
    return response;
  }
}
const userService = new UserService();
export default userService;
