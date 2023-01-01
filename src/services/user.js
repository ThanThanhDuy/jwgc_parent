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

  async updateProfile({ name, file, dateOfBirth, gender, email, phoneNumber }) {
    let bodyFormData = new FormData();
    console.log(file);
    name && bodyFormData.append("Name", name);
    file && bodyFormData.append("Avatar", file);
    dateOfBirth && bodyFormData.append("DateOfBirth", dateOfBirth);
    gender && bodyFormData.append("Gender", gender);
    email && bodyFormData.append("Email", email);
    phoneNumber && bodyFormData.append("PhoneNumber", phoneNumber);

    try {
      var response = await userApi.updateProfile(bodyFormData);
    } catch (error) {
      return error;
    }
    return response;
  }

  async sendLinkToVerifyEmail() {
    try {
      var response = await userApi.sendLinkToVerifyEmail();
    } catch (error) {
      return error;
    }
    return response;
  }

  async sendLinkToVerifyPhone() {
    try {
      var response = await userApi.sendLinkToVerifyPhone();
    } catch (error) {
      return error;
    }
    return response;
  }

  async updatePassword({ oldPassword, newPassword }) {
    const params = {
      CurrentPassword: oldPassword,
      NewPassword: newPassword,
    };
    try {
      var response = await userApi.updatePassword(params);
    } catch (error) {
      return error;
    }
    return response;
  }
}
const userService = new UserService();
export default userService;
