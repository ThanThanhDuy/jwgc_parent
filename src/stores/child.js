import { atom } from "recoil";

export const childSelectState = atom({
  key: "childSelectState",
  default: null,
});

export const typeState = atom({
  key: "typeState",
  default: "Cha mẹ",
});

export const listChildState = atom({
  key: "listChildState",
  default: [],
});

export const activitySelectState = atom({
  key: "activitySelectState",
  default: "",
});

export const openModalActivitySelectState = atom({
  key: "openModalActivitySelectState",
  default: false,
});
