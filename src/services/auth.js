import authApi from "../apis/auth";
import { ROLE } from "../constants/auth";
class AuthService {
  async login(username, password) {
    const params = {
      UserName: username,
      Password: password,
      FCMToken: "",
    };
    try {
      var response = await authApi.login(params);
    } catch (error) {
      return error;
    }
    return response;
  }

  async register(username, password, fullname, email) {
    const params = {
      UserName: username,
      Password: password,
      Name: fullname,
      Email: email,
      Role: ROLE["parents"],
    };
    try {
      var response = await authApi.register(params);
    } catch (error) {
      return error;
    }
    return response;
  }
}
const authService = new AuthService();
export default authService;
