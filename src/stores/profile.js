import { atom } from "recoil";
import { BLOG } from "../constants/blog";

export const currentPageProfileState = atom({
  key: "currentPageProfileState",
  default: BLOG.pageDefault,
});

export const scrollPositionProfileState = atom({
  key: "scrollPositionProfileState",
  default: 0,
});
