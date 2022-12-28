import axiosClient from "./index.js";
class CateBlogApi {
  async getCateBlog() {
    const url = `categories`;
    return axiosClient.get(url);
  }
}

const cateBlogApi = new CateBlogApi();
export default cateBlogApi;
