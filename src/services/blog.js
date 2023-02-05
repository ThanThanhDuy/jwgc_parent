import blogApi from "../apis/blog";

class BlogService {
  async publishBlog(title, cateId, content) {
    const params = {
      Title: title,
      ConcernCategoryCode: cateId.toString(),
      Content: content,
    };
    try {
      var response = await blogApi.publishBlog(params);
    } catch (error) {
      return error;
    }
    return response;
  }

  async getBlog({ Code, Title, ConcernCategoryCode, Page, PageSize }) {
    const params = {};
    Code && (params.Code = Code);
    Title && (params.Title = Title);
    ConcernCategoryCode && (params.ConcernCategoryCode = ConcernCategoryCode);
    Page && (params["Paging.Page"] = Page);
    PageSize && (params["Paging.PageSize"] = PageSize);
    try {
      var response = await blogApi.getBlog(params);
    } catch (error) {
      return error;
    }
    return response;
  }

  async reactionBlog(BlogCode, Value) {
    const params = {
      BlogCode,
      Value,
    };
    try {
      var response = await blogApi.reactionBlog(params);
    } catch (error) {
      return error;
    }
    return response;
  }

  async getBlogByUsername({ Code, Username, Page, PageSize }) {
    const params = {};
    Code && (params.Code = Code);
    Username && (params.Username = Username);
    Page && (params["Paging.Page"] = Page);
    PageSize && (params["Paging.PageSize"] = PageSize);
    try {
      var response = await blogApi.getBlogByUsername(params);
    } catch (error) {
      return error;
    }
    return response;
  }

  async getMyBlog({
    Code,
    Title,
    Status,
    ConcernCategoryCode,
    Page,
    PageSize,
  }) {
    const params = {};
    Code && (params.Code = Code);
    Title && (params.Title = Title);
    Status && (params.Status = Status);
    ConcernCategoryCode && (params.ConcernCategoryCode = ConcernCategoryCode);
    Page && (params["Paging.Page"] = Page);
    PageSize && (params["Paging.PageSize"] = PageSize);
    try {
      var response = await blogApi.getMyBlog(params);
    } catch (error) {
      return error;
    }
    return response;
  }

  async updateBlog(code, title, cateId, content) {
    const params = {
      Code: code,
      Title: title,
      ConcernCategoryCode: cateId.toString(),
      Content: content,
    };
    try {
      var response = await blogApi.updateBlog(params);
    } catch (error) {
      return error;
    }
    return response;
  }

  async deleteBlog(code) {
    try {
      var response = await blogApi.deleteBlog(code);
    } catch (error) {
      return error;
    }
    return response;
  }

  async sendComment(content, blogCode, parentCode) {
    const params = {
      Content: content,
      BlogCode: blogCode,
      ParentCode: parentCode,
    };
    try {
      var response = await blogApi.sendComment(params);
    } catch (error) {
      return error;
    }
    return response;
  }

  async updateComment(blogCode, content) {
    const params = {
      Code: blogCode,
      Content: content,
    };
    try {
      var response = await blogApi.updateComment(params);
    } catch (error) {
      return error;
    }
    return response;
  }

  async deleteComment(code) {
    try {
      var response = await blogApi.deleteComment(code);
    } catch (error) {
      return error;
    }
    return response;
  }

  async getComment({ BlogCode, ParentCode, Page, PageSize }) {
    const params = {};
    BlogCode && (params.BlogCode = BlogCode);
    ParentCode && (params.ParentCode = ParentCode);
    Page && (params["Paging.Page"] = Page);
    PageSize && (params["Paging.PageSize"] = PageSize);
    try {
      var response = await blogApi.getComment(params);
    } catch (error) {
      return error;
    }
    return response;
  }

  async saveBlogFavorite(blogCode) {
    const params = {
      Code: blogCode,
    };
    try {
      var response = await blogApi.saveBlogFavorite(params);
    } catch (error) {
      return error;
    }
    return response;
  }

  async deleteBlogFavorite(code) {
    try {
      var response = await blogApi.deleteBlogFavorite(code);
    } catch (error) {
      return error;
    }
    return response;
  }

  async shareBlog(blogCode) {
    const params = {
      Code: blogCode,
    };
    try {
      var response = await blogApi.shareBlog(params);
    } catch (error) {
      return error;
    }
    return response;
  }

  async deleteBlogShare(code) {
    try {
      var response = await blogApi.deleteBlogShare(code);
    } catch (error) {
      return error;
    }
    return response;
  }

  async getBlogShareFavorite({ Page, PageSize, Type }) {
    const params = {};
    Page && (params["Paging.Page"] = Page);
    PageSize && (params["Paging.PageSize"] = PageSize);
    params["Type"] = Type;
    try {
      var response = await blogApi.getBlogShareFavorite(params);
    } catch (error) {
      return error;
    }
    return response;
  }

  async reportComment(commentCode) {
    const params = {
      Code: commentCode,
    };
    try {
      var response = await blogApi.reportComment(params);
    } catch (error) {
      return error;
    }
    return response;
  }
}
const blogService = new BlogService();
export default blogService;
