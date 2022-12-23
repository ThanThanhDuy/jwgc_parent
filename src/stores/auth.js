import { atom } from "recoil";

export const isAuthState = atom({
  key: "isAuthState",
  default: false,
});

export const usernameState = atom({
  key: "usernameState",
  default: "",
});
