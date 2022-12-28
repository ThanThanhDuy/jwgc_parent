import cateBlogApi from "../apis/cateBlog";

class CateBlogService {
  async getCateBlog() {
    try {
      var response = await cateBlogApi.getCateBlog();
    } catch (error) {
      return error;
    }
    return response;
  }
}
const cateBlogService = new CateBlogService();
export default cateBlogService;
