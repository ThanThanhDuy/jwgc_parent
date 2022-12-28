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
    console.log(Status);
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
}
const blogService = new BlogService();
export default blogService;
