import userApi from "../apis/user";

class UserService {
  async getProfile(fcmTokem) {
    const params = {
      FCMToken: fcmTokem,
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

  async searchUser(value, page, pageSize) {
    const params = {};
    value && (params["SearchValue"] = value);
    page && (params["Paging.Page"] = page);
    pageSize && (params["Paging.PageSize"] = pageSize);

    try {
      var response = await userApi.searchUser(params);
    } catch (error) {
      return error;
    }
    return response;
  }

  async searchNanny(value, page, pageSize, fromAge, toAge, gender) {
    const params = {};
    value && (params["Value"] = value);
    page && (params["Paging.Page"] = page);
    pageSize && (params["Paging.PageSize"] = pageSize);
    fromAge && (params["FromAge"] = fromAge);
    toAge && (params["ToAge"] = toAge);
    gender && (params["Genders"] = gender);
    try {
      var response = await userApi.searchNanny(params);
    } catch (error) {
      return error;
    }
    return response;
  }

  async followUser(code) {
    try {
      var response = await userApi.followUser(code);
    } catch (error) {
      return error;
    }
    return response;
  }

  async unFollowUser(code) {
    try {
      var response = await userApi.unFollowUser(code);
    } catch (error) {
      return error;
    }
    return response;
  }

  async logout(fcm) {
    try {
      const params = {
        FCMToken: fcm,
      };
      var response = await userApi.logout(params);
    } catch (error) {
      return error;
    }
    return response;
  }

  async verifyNanny({
    Name,
    Gender,
    DateOfBirth,
    IdentityCardNumber,
    PlaceOfResidence,
    PlaceOfOrigin,
    ForegroundIdentityCardImage,
    BackgroundIdentityCardImage,
  }) {
    const params = new FormData();
    params.append("Name", Name);
    params.append("Gender", Number(Gender));
    params.append("DateOfBirth", DateOfBirth);
    params.append("IdentityCardNumber", IdentityCardNumber);
    params.append("PlaceOfResidence", PlaceOfResidence);
    params.append("PlaceOfOrigin", PlaceOfOrigin);
    console.log(ForegroundIdentityCardImage);
    if (ForegroundIdentityCardImage) {
      params.append("ForegroundIdentityCardImage", ForegroundIdentityCardImage);
    }
    console.log(BackgroundIdentityCardImage);
    if (BackgroundIdentityCardImage) {
      params.append("BackgroundIdentityCardImage", BackgroundIdentityCardImage);
    }
    try {
      var response = await userApi.verifyNanny(params);
    } catch (error) {
      return error;
    }
    return response;
  }
}
const userService = new UserService();
export default userService;
