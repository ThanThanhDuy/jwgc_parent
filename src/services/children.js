import children from "../apis/children";

class ChildrenService {
  async getChildrenParent() {
    try {
      var response = await children.getChildrenParent();
    } catch (error) {
      return error;
    }
    return response;
  }

  async getChildrenNanny() {
    try {
      var response = await children.getChildrenNanny();
    } catch (error) {
      return error;
    }
    return response;
  }

  async addChild({ name, file, dateOfBirth, gender }) {
    let bodyFormData = new FormData();
    name && bodyFormData.append("Name", name);
    file && bodyFormData.append("Image", file);
    dateOfBirth && bodyFormData.append("DateOfBirth", dateOfBirth);
    bodyFormData.append("Gender", gender);
    try {
      var response = await children.addChild(bodyFormData);
    } catch (error) {
      return error;
    }
    return response;
  }

  async updateChild({ code, name, file, dateOfBirth, gender }) {
    let bodyFormData = new FormData();
    name && bodyFormData.append("Name", name);
    file && bodyFormData.append("Image", file);
    dateOfBirth && bodyFormData.append("DateOfBirth", dateOfBirth);
    bodyFormData.append("Gender", gender);
    bodyFormData.append("Status", 1);
    try {
      var response = await children.updateChild(code, bodyFormData);
    } catch (error) {
      return error;
    }
    return response;
  }

  async deleteChild(code) {
    try {
      var response = await children.deleteChild(code);
    } catch (error) {
      return error;
    }
    return response;
  }

  async sendInviteToNanny(ChildCode, NannyCode) {
    let params = {
      ChildCode,
      NannyCode,
    };
    try {
      var response = await children.sendInviteToNanny(params);
    } catch (error) {
      return error;
    }
    return response;
  }

  async getSendInviteToNanny(childCode, page, pageSize) {
    const params = {};
    childCode && (params["ChildCode"] = childCode);
    page && (params["Paging.Page"] = page);
    pageSize && (params["Paging.PageSize"] = pageSize);
    try {
      var response = await children.getSendInviteToNanny(params);
    } catch (error) {
      return error;
    }
    return response;
  }

  async parentCancelRelationshipNanny(ChildCode, NannyCode) {
    let params = {
      ChildCode,
      NannyCode,
    };
    try {
      var response = await children.parentCancelRelationshipNanny(params);
    } catch (error) {
      return error;
    }
    return response;
  }

  async getInvition(page, pageSize) {
    const params = {};
    page && (params["Paging.Page"] = page);
    pageSize && (params["Paging.PageSize"] = pageSize);
    try {
      var response = await children.getInvition(params);
    } catch (error) {
      return error;
    }
    return response;
  }

  async changeStatusInvition(childCode, status) {
    const params = {};
    params["ChildCode"] = childCode;
    params["Status"] = status;
    try {
      var response = await children.changeStatusInvition(params);
    } catch (error) {
      return error;
    }
    return response;
  }

  async parentCancelInviteNanny(ChildCode, NannyCode) {
    let params = {
      ChildCode,
      NannyCode,
    };
    try {
      var response = await children.parentCancelInviteNanny(params);
    } catch (error) {
      return error;
    }
    return response;
  }

  async sendInviteToParent(ChildCode, PartnerCode) {
    let params = {
      ChildCode,
      PartnerCode,
    };
    try {
      var response = await children.sendInviteToParent(params);
    } catch (error) {
      return error;
    }
    return response;
  }

  async getSendInviteToParent(childCode, page, pageSize) {
    const params = {};
    childCode && (params["ChildCode"] = childCode);
    page && (params["Paging.Page"] = page);
    pageSize && (params["Paging.PageSize"] = pageSize);
    try {
      var response = await children.getSendInviteToParent(params);
    } catch (error) {
      return error;
    }
    return response;
  }

  async parentCancelInvitePartner(ChildCode, PartnerCode) {
    let params = {
      ChildCode,
      PartnerCode,
    };
    try {
      var response = await children.parentCancelInvitePartner(params);
    } catch (error) {
      return error;
    }
    return response;
  }

  async getInvitionParent(page, pageSize) {
    const params = {};
    page && (params["Paging.Page"] = page);
    pageSize && (params["Paging.PageSize"] = pageSize);
    try {
      var response = await children.getInvitionParent(params);
    } catch (error) {
      return error;
    }
    return response;
  }

  async changeStatusInvitionParent(childCode, status) {
    const params = {};
    params["ChildCode"] = childCode;
    params["Status"] = status;
    try {
      var response = await children.changeStatusInvitionParent(params);
    } catch (error) {
      return error;
    }
    return response;
  }

  async parentCancelRelationshipPartner(ChildCode, PartnerCode) {
    let params = {
      ChildCode,
      PartnerCode,
    };
    try {
      var response = await children.parentCancelRelationshipPartner(params);
    } catch (error) {
      return error;
    }
    return response;
  }
}
const childrenService = new ChildrenService();
export default childrenService;
