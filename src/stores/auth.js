import { atom } from "recoil";

export const isAuthState = atom({
  key: "isAuthState",
  default: false,
});

export const usernameState = atom({
  key: "usernameState",
  default: "",
});

export const isOpenModalRequireAuthState = atom({
  key: "isOpenModalRequireAuthState",
  default: false,
});
