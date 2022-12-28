import { atom } from "recoil";
import { BLOG } from "../constants/blog";

export const listBlogProfileState = atom({
  key: "listBlogProfileState",
  default: [],
});

export const pageCountProfileState = atom({
  key: "pageCountProfileState",
  default: 1,
});

export const currentPageProfileState = atom({
  key: "currentPageProfileState",
  default: BLOG.pageDefault,
});

export const scrollPositionProfileState = atom({
  key: "scrollPositionProfileState",
  default: 0,
});
