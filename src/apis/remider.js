import axiosClient from "./index.js";
class ReminderApi {
  async addReminder(params) {
    const url = `reminders`;
    return axiosClient.post(url, params);
  }

  async getReminder(params) {
    const url = `reminders`;
    return axiosClient.get(url, {
      params: {
        ...params,
      },
    });
  }

  async updateReminder(params) {
    const url = `reminders`;
    return axiosClient.put(url, params);
  }

  async deleteReminder(code) {
    const url = `reminders`;
    return axiosClient.delete(url, {
      data: {
        Code: code,
      },
    });
  }
}

const reminderApi = new ReminderApi();
export default reminderApi;
