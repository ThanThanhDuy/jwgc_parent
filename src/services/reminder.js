import reminderApi from "../apis/remider";

class ReminderService {
  async addReminder({
    Label,
    Time,
    Date,
    Note,
    ActivityCategoryCode,
    ChildCode,
  }) {
    const params = {
      Label,
      Time,
      Date,
      Note,
      Sound: 0,
      ActivityCategoryCode,
      ChildCode,
    };
    try {
      var response = await reminderApi.addReminder(params);
    } catch (error) {
      return error;
    }
    return response;
  }

  async getReminder({ ChildCode, From, To }) {
    const params = {};
    ChildCode && (params.ChildCode = ChildCode);
    params["Paging.Page"] = 1;
    params["Paging.PageSize"] = 100;
    params["Date.FromDate"] = From;
    params["Date.ToDate"] = To;
    try {
      var response = await reminderApi.getReminder(params);
    } catch (error) {
      return error;
    }
    return response;
  }

  async updateReminder({
    Code,
    Label,
    Time,
    Date,
    Note,
    ActivityCategoryCode,
  }) {
    const params = {
      Code,
      Label,
      Time,
      Date,
      Note,
      Sound: 0,
      ActivityCategoryCode,
    };
    console.log("params", params);
    try {
      var response = await reminderApi.updateReminder(params);
    } catch (error) {
      return error;
    }
    return response;
  }

  async deleteReminder(code) {
    try {
      var response = await reminderApi.deleteReminder(code);
    } catch (error) {
      return error;
    }
    return response;
  }
}
const reminderService = new ReminderService();
export default reminderService;
