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

  async sendComment(params) {
    const url = `${this.PREFIX}/comment`;
    return axiosClient.post(url, params);
  }

  async updateComment(params) {
    const url = `${this.PREFIX}/comment`;
    return axiosClient.put(url, params);
  }

  async deleteComment(code) {
    const url = `${this.PREFIX}/comment`;
    return axiosClient.delete(url, {
      data: {
        Code: code,
      },
    });
  }

  async getComment(params) {
    const url = `${this.PREFIX}/comment`;
    return axiosClient.get(url, {
      params: {
        ...params,
      },
    });
  }

  async saveBlogFavorite(params) {
    const url = `${this.PREFIX}/favorite-blog`;
    return axiosClient.put(url, params);
  }

  async deleteBlogFavorite(code) {
    const url = `${this.PREFIX}/favorite-blog`;
    return axiosClient.delete(url, {
      data: {
        Code: code,
      },
    });
  }

  async shareBlog(params) {
    const url = `${this.PREFIX}/sharing-blog`;
    return axiosClient.put(url, params);
  }

  async deleteBlogShare(code) {
    const url = `${this.PREFIX}/sharing-blog`;
    return axiosClient.delete(url, {
      data: {
        Code: code,
      },
    });
  }

  async getBlogShareFavorite(params) {
    const url = `${this.PREFIX}/favorite-blog`;
    return axiosClient.get(url, {
      params: {
        ...params,
      },
    });
  }

  async reportComment(params) {
    const url = `${this.PREFIX}/comment/report`;
    return axiosClient.put(url, params);
  }

  async uploadImage(params) {
    const url = `${this.PREFIX}/images`;
    return axiosClient.post(url, params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
}

const blogApi = new BlogApi();
export default blogApi;
