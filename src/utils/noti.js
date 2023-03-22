import firebase from "firebase/app";
import "firebase/messaging";
import { firebaseConfig } from "./firebase";

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}

let messaging;

if (typeof window !== "undefined") {
  if (firebase.messaging.isSupported()) {
    messaging = firebase.messaging();
  }
}

export const getMessagingToken = async () => {
  let currentToken = "";
  if (!messaging) return;
  try {
    currentToken = await messaging.getToken({
      vapidKey:
        "BKzkDnX8ppuuStLDZj5ROnNkj-T_7FF95s4rT3PHs2kr-XHoQEIjd86t-z4CAmgRw0fiOYIb0GgmBHKYChVfaaQ",
    });
  } catch (error) {
    console.log("An error occurred while retrieving token. ", error);
  }
  return currentToken;
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    messaging.onMessage((payload) => {
      resolve(payload);
    });
  });
