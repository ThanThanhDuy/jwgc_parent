import axiosClient from "./index.js";

class VaccineApi {
  async getVaccineSystem(childCode) {
    const url = `vaccinations/recommendation/vaccines/${childCode}`;
    return axiosClient.get(url);
  }

  async importVaccineSystem(params) {
    const url = `vaccinations/recommendation/records`;
    return axiosClient.post(url, params);
  }

  async updateRecordVaccineSystem(recordCode, params) {
    const url = `vaccinations/recommendation/records/${recordCode}`;
    return axiosClient.put(url, params);
  }

  async deleteRecordVaccineSystem(recordCode) {
    const url = `vaccinations/records/${recordCode}`;
    return axiosClient.delete(url);
  }

  async getVaccineDefine(childCode) {
    const url = `vaccinations/customization/vaccines/${childCode}`;
    return axiosClient.get(url);
  }

  async addVaccineDefine(params) {
    const url = `vaccinations/customization/vaccines`;
    return axiosClient.post(url, params);
  }

  async updateVaccineDefine(vaccineCode, params) {
    const url = `vaccinations/customization/vaccines/${vaccineCode}`;
    return axiosClient.put(url, params);
  }

  async deleteVaccineDefine(vaccineCode) {
    const url = `vaccinations/customization/vaccines/${vaccineCode}`;
    return axiosClient.delete(url);
  }

  async importVaccineDefine(params) {
    const url = `vaccinations/customization/records`;
    return axiosClient.post(url, params);
  }

  async updateRecordVaccineDefine(recordCode, params) {
    const url = `vaccinations/customization/records/${recordCode}`;
    return axiosClient.put(url, params);
  }
}

const vaccineApi = new VaccineApi();
export default vaccineApi;
