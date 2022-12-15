class LocalService {
  getblogContent() {
    return localStorage.getItem("blogContent");
  }
  setblogContent(value) {
    localStorage.setItem("blogContent", value);
  }
  getblogTitle() {
    return localStorage.getItem("blogTitle");
  }
  setblogTitle(value) {
    localStorage.setItem("blogTitle", value);
  }
  getBlogCategory() {
    return localStorage.getItem("blogCategory");
  }
  setBlogCategory(value) {
    localStorage.setItem("blogCategory", value);
  }
  getDateSaveDraft() {
    return localStorage.getItem("dateSaveDraft");
  }
  setDateSaveDraft(value) {
    localStorage.setItem("dateSaveDraft", value);
  }
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
}
const localService = new LocalService();
export default localService;
