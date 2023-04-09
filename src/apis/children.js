import axiosClient from "./index.js";
class ChildrenApi {
  async getChildrenParent() {
    const url = `children/parent`;
    return axiosClient.get(url);
  }

  async getChildrenNanny() {
    const url = `children/nanny`;
    return axiosClient.get(url);
  }

  async addChild(params) {
    const url = `children`;
    return axiosClient.post(url, params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  async updateChild(code, params) {
    const url = `children/${code}`;
    return axiosClient.put(url, params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  async deleteChild(code) {
    const url = `children/${code}`;
    return axiosClient.delete(url);
  }

  async sendInviteToNanny(params) {
    const url = `children/nanny-invitation`;
    return axiosClient.post(url, params);
  }

  async getSendInviteToNanny(params) {
    const url = `children/sent-nanny-invitation`;
    return axiosClient.get(url, {
      params: {
        ...params,
      },
    });
  }

  async parentCancelRelationshipNanny(params) {
    const url = `children/parent/nanny-relationship`;
    return axiosClient.delete(url, {
      data: {
        ...params,
      },
    });
  }

  async getInvition(params) {
    const url = `children/nanny-invitation`;
    return axiosClient.get(url, {
      params: {
        ...params,
      },
    });
  }

  async changeStatusInvition(params) {
    const url = `children/nanny-invitation`;
    return axiosClient.put(url, params);
  }

  async parentCancelInviteNanny(params) {
    const url = `children/nanny-invitation`;
    return axiosClient.delete(url, {
      data: {
        ...params,
      },
    });
  }

  async sendInviteToParent(params) {
    const url = `children/parent-invitation`;
    return axiosClient.post(url, params);
  }

  async getSendInviteToParent(params) {
    const url = `children/sent-parent-invitation`;
    return axiosClient.get(url, {
      params: {
        ...params,
      },
    });
  }

  async parentCancelInvitePartner(params) {
    const url = `children/parent-invitation`;
    return axiosClient.delete(url, {
      data: {
        ...params,
      },
    });
  }

  async getInvitionParent(params) {
    const url = `children/parent-invitation`;
    return axiosClient.get(url, {
      params: {
        ...params,
      },
    });
  }

  async changeStatusInvitionParent(params) {
    const url = `children/parent-invitation`;
    return axiosClient.put(url, params);
  }

  async parentCancelRelationshipPartner(params) {
    const url = `children/parent/parent-relationship`;
    return axiosClient.delete(url, {
      data: {
        ...params,
      },
    });
  }

  async updateJobDescription(params) {
    const url = `children/caring-job-description`;
    return axiosClient.put(url, params);
  }
}

const childrenApi = new ChildrenApi();
export default childrenApi;
