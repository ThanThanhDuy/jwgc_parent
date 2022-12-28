import { atom } from "recoil";
import { BLOG } from "../constants/blog";

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

export const cateDisplayState = atom({
  key: "cateDisplayState",
  default: {},
});

export const listBlogState = atom({
  key: "listBlogState",
  default: [],
});

export const pageCountState = atom({
  key: "pageCountState",
  default: 1,
});

export const currentPageState = atom({
  key: "currentPageState",
  default: BLOG.pageDefault,
});

export const scrollPositionState = atom({
  key: "scrollPositionState",
  default: 0,
});
