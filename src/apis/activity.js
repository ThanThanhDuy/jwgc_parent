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

  async getActivity(childCode, params) {
    const url = `activities/children/${childCode}`;
    return axiosClient.get(url, { params });
  }

  async updateActivity(activityCode, params) {
    const url = `activities/${activityCode}`;
    return axiosClient.put(url, params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  async deleteActivity(activityCode) {
    const url = `activities/${activityCode}`;
    return axiosClient.delete(url);
  }
}

const activityApi = new ActivityApi();
export default activityApi;
