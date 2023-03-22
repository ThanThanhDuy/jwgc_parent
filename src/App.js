import "./App.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import Router from "./router/index";
import { UilAngleUp } from "@iconscout/react-unicons";
import { useEffect } from "react";
import RequireAuth from "./components/RequireAuth";
import { getMessagingToken, onMessageListener } from "./utils/noti";
import { notification } from "antd";

function App() {
  useEffect(() => {
    let button = document.getElementById("buttonScrollTop");
    window.onscroll = function () {
      scrollFunction();
    };

    function scrollFunction() {
      if (
        document.body.scrollTop > 20 ||
        document.documentElement.scrollTop > 20
      ) {
        button.style.display = "block";
      } else {
        button.style.display = "none";
      }
    }
  }, []);

  useEffect(() => {
    getMessagingToken();
    const channel = new BroadcastChannel("notifications");
    // background
    channel.addEventListener("message", (event) => {
      console.log("Receive background: ", event.data);
      notification.info({
        message: event.data.notification.title,
        description: event.data.notification.body,
        duration: null,
      });
    });
  }, []);

  useEffect(() => {
    // foregroun
    onMessageListener().then((data) => {
      console.log("Receive foreground: ", data);
      notification.info({
        message: data.notification.title,
        description: data.notification.body,
        duration: null,
      });
    });
  });

  const handleClick = () => {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  };

  return (
    <div className="App">
      <RequireAuth />
      <Router />
      <div className="scrollTop" id="buttonScrollTop" onClick={handleClick}>
        <UilAngleUp size={32} color="#fff" />
      </div>
    </div>
  );
}

export default App;
