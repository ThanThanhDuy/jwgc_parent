import { atom } from "recoil";

export const reloadState = atom({
  key: "reloadState",
  default: false,
});

export const itemSelectedState = atom({
  key: "itemSelectedState",
  default: "",
});
