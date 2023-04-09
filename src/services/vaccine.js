import vaccineApi from "../apis/vaccine";

class VaccineService {
  async getVaccineSystem(childCode) {
    try {
      var response = await vaccineApi.getVaccineSystem(childCode);
    } catch (error) {
      return error;
    }
    return response;
  }

  async importVaccineSystem({
    childCode,
    date,
    note,
    vaccineCode,
    statusVaccine,
  }) {
    const params = {
      ChildCode: childCode,
      Date: date,
      Note: note,
      VaccineCode: vaccineCode,
      Status: statusVaccine,
    };
    try {
      var response = await vaccineApi.importVaccineSystem(params);
    } catch (error) {
      return error;
    }
    return response;
  }

  async updateRecordVaccineSystem({
    childCode,
    date,
    note,
    vaccineCode,
    statusVaccine,
    recordCode,
  }) {
    const params = {
      ChildCode: childCode,
      Date: date,
      Note: note,
      VaccineCode: vaccineCode,
      Status: statusVaccine,
    };
    try {
      var response = await vaccineApi.updateRecordVaccineSystem(
        recordCode,
        params
      );
    } catch (error) {
      return error;
    }
    return response;
  }

  async getVaccineDefine(childCode) {
    try {
      var response = await vaccineApi.getVaccineDefine(childCode);
    } catch (error) {
      return error;
    }
    return response;
  }

  async addVaccineDefine({
    nameVaccine,
    noteVaccine,
    diseaseVaccine,
    amoundVaccine,
  }) {
    const params = {
      Name: nameVaccine,
      Note: noteVaccine,
      Disease: diseaseVaccine,
      BasicAmount: amoundVaccine,
    };
    try {
      var response = await vaccineApi.addVaccineDefine(params);
    } catch (error) {
      return error;
    }
    return response;
  }

  async updateVaccineDefine({
    nameVaccine,
    noteVaccine,
    diseaseVaccine,
    amoundVaccine,
    codeVaccine,
  }) {
    const params = {
      Name: nameVaccine,
      Note: noteVaccine,
      Disease: diseaseVaccine,
      BasicAmount: amoundVaccine,
    };
    try {
      var response = await vaccineApi.updateVaccineDefine(codeVaccine, params);
    } catch (error) {
      return error;
    }
    return response;
  }

  async deleteRecordVaccineSystem(recordCode) {
    try {
      var response = await vaccineApi.deleteRecordVaccineSystem(recordCode);
    } catch (error) {
      return error;
    }
    return response;
  }

  async importVaccineDefine({
    childCode,
    date,
    note,
    vaccineCode,
    statusVaccine,
  }) {
    const params = {
      ChildCode: childCode,
      Date: date,
      Note: note,
      VaccineCode: vaccineCode,
      Status: statusVaccine,
    };
    try {
      var response = await vaccineApi.importVaccineDefine(params);
    } catch (error) {
      return error;
    }
    return response;
  }

  async deleteVaccineDefine(vaccineCode) {
    try {
      var response = await vaccineApi.deleteVaccineDefine(vaccineCode);
    } catch (error) {
      return error;
    }
    return response;
  }
  
}
const vaccineService = new VaccineService();
export default vaccineService;
