class LocalService {
  // content blog
  getblogContent() {
    return localStorage.getItem("blogContent");
  }
  setblogContent(value) {
    localStorage.setItem("blogContent", value);
  }
  // title blog
  getblogTitle() {
    return localStorage.getItem("blogTitle");
  }
  setblogTitle(value) {
    localStorage.setItem("blogTitle", value);
  }
  // category blog
  getBlogCategory() {
    return localStorage.getItem("blogCategory");
  }
  setBlogCategory(value) {
    localStorage.setItem("blogCategory", value);
  }
  // date save draft
  getDateSaveDraft() {
    return localStorage.getItem("dateSaveDraft");
  }
  setDateSaveDraft(value) {
    localStorage.setItem("dateSaveDraft", value);
  }
  // user
  getUser() {
    if (localStorage.getItem("user") === null) {
      return null;
    }
    return JSON.parse(localStorage.getItem("user"));
  }
  setUser(value) {
    localStorage.setItem("user", value);
  }
  // token
  getAccessToken() {
    return localStorage.getItem("accessToken");
  }
  setAccessToken(value) {
    localStorage.setItem("accessToken", value);
  }
  // remove
  removeblogContent() {
    localStorage.removeItem("blogContent");
  }
  removeblogTitle() {
    localStorage.removeItem("blogTitle");
  }
  removeBlogCategory() {
    localStorage.removeItem("blogCategory");
  }
  removeDateSaveDraft() {
    localStorage.removeItem("dateSaveDraft");
  }
  removeUser() {
    localStorage.removeItem("user");
  }
  removeAccessToken() {
    localStorage.removeItem("accessToken");
  }
  removeAll() {
    this.removeBlogCategory();
    this.removeblogContent();
    this.removeblogTitle();
    this.removeDateSaveDraft();
  }
}
const localService = new LocalService();
export default localService;
