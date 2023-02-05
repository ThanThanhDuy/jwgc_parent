import axiosClient from "./index.js";

class ActivityApi {
  async getCateActivity() {
    const url = `activities/categories`;
    return axiosClient.get(url);
  }

  async recordActivity(cateCode, childCode, params) {
    const url = `activities/categories/${cateCode}/children/${childCode}/`;
    return axiosClient.post(url, params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
}

const activityApi = new ActivityApi();
export default activityApi;
