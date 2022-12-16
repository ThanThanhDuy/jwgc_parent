import { atom } from "recoil";

export const titleBlogState = atom({
  key: "titleState",
  default: "",
});

export const contentBlogState = atom({
  key: "contentBlogState",
  default: "",
});

export const cateBlogState = atom({
  key: "cateBlogState",
  default: 2,
});
