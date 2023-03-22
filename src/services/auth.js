import authApi from "../apis/auth";
import { ROLE } from "../constants/auth";
class AuthService {
  async login(username, password, fcmToken, deviceType) {
    const params = {
      UserName: username,
      Password: password,
      FCMToken: fcmToken,
      DeviceType: deviceType,
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

  async sendLinkToResetPassword(email, username) {
    try {
      var response = await authApi.sendLinkToResetPassword(email, username);
    } catch (error) {
      return error;
    }
    return response;
  }
}
const authService = new AuthService();
export default authService;
