import reminderApi from "../apis/remider";

class ReminderService {
  async addReminder({
    Label,
    Time,
    Type,
    Note,
    ActivityCategoryCode,
    ChildCode,
  }) {
    const params = {
      Label,
      Time,
      Type: Number(Type),
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
    Type,
    Note,
    ActivityCategoryCode,
  }) {
    const params = {
      Code,
      Label,
      Time,
      Type,
      Note,
      Sound: 0,
      ActivityCategoryCode,
    };
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
