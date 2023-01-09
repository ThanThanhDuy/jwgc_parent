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

  async parentCancelInviteNanny(params) {
    const url = `children/parent/nanny-relationship`;
    return axiosClient.delete(url, {
      data: {
        ...params,
      },
    });
  }
}

const childrenApi = new ChildrenApi();
export default childrenApi;
