import activityApi from "../apis/activity";

class ActivityService {
  async getCateActivity() {
    try {
      var response = await activityApi.getCateActivity();
    } catch (error) {
      return error;
    }
    return response;
  }

  async recordActivity(cateCode, childCode, startAt, data, file) {
    let bodyFormData = new FormData();
    startAt && bodyFormData.append("StartAt", startAt);
    bodyFormData.append("Data", JSON.stringify(data));
    file && bodyFormData.append("File", file);
    try {
      var response = await activityApi.recordActivity(
        cateCode,
        childCode,
        bodyFormData
      );
    } catch (error) {
      return error;
    }
    return response;
  }

  async getActivity(childCode, from, to, cate) {
    const params = {};
    from && (params.FromDate = from);
    to && (params.ToDate = to);
    cate && (params.categoryCode = cate);

    try {
      var response = await activityApi.getActivity(childCode, params);
    } catch (error) {
      return error;
    }
    return response;
  }

  async updateActivity(activityCode, startAt, data, file) {
    let bodyFormData = new FormData();
    startAt && bodyFormData.append("StartAt", startAt);
    bodyFormData.append("Data", JSON.stringify(data));
    file && bodyFormData.append("File", file);
    try {
      var response = await activityApi.updateActivity(
        activityCode,
        bodyFormData
      );
    } catch (error) {
      return error;
    }
    return response;
  }

  async deleteActivity(activityCode) {
    try {
      var response = await activityApi.deleteActivity(activityCode);
    } catch (error) {
      return error;
    }
    return response;
  }
}
const activityService = new ActivityService();
export default activityService;
