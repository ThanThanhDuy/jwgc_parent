importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

self.addEventListener("fetch", () => {
  const urlParams = new URLSearchParams(location.search);
  self.firebaseConfig = Object.fromEntries(urlParams);
});

const defaultConfig = {
  apiKey: "AIzaSyCDPU7xWAP4WfkvbHDwGaubCkcPXD6gFQo",
  authDomain: "jwgc-d721e.firebaseapp.com",
  projectId: "jwgc-d721e",
  storageBucket: "jwgc-d721e.appspot.com",
  messagingSenderId: "558480503120",
  appId: "1:558480503120:web:e93b6dc86daf60926bbc55",
  measurementId: "G-LXCRCRKN7M",
};

firebase.initializeApp(self.firebaseConfig || defaultConfig);
if (firebase.messaging.isSupported()) {
  const messaging = firebase.messaging();
  const channel = new BroadcastChannel("notifications");
  messaging.onBackgroundMessage(function (payload) {
    //can not console.log here
    channel.postMessage(payload);
  });
}
