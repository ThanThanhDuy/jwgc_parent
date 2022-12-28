import axiosClient from "./index.js";
class BlogApi {
  PREFIX = "blogs";

  async publishBlog(params) {
    const url = `${this.PREFIX}`;
    return axiosClient.post(url, params);
  }

  async getBlog(params) {
    const url = `${this.PREFIX}`;
    return axiosClient.get(url, {
      params: {
        ...params,
      },
    });
  }

  async reactionBlog(params) {
    const url = `${this.PREFIX}/reaction`;
    return axiosClient.put(url, params);
  }

  // lấy blog theo username, nhưng nếu truyền thêm param code (Blog) thì sẽ không lấy blog có code này
  async getBlogByUsername(params) {
    const url = `${this.PREFIX}/related-blogs`;
    return axiosClient.get(url, {
      params: {
        ...params,
      },
    });
  }

  async getMyBlog(params) {
    const url = `${this.PREFIX}/my-blogs`;
    return axiosClient.get(url, {
      params: {
        ...params,
      },
    });
  }

  async updateBlog(params) {
    const url = `${this.PREFIX}`;
    return axiosClient.put(url, params);
  }

  async deleteBlog(code) {
    const url = `${this.PREFIX}`;
    return axiosClient.delete(url, {
      data: {
        Code: code,
      },
    });
  }
}

const blogApi = new BlogApi();
export default blogApi;
