import "./App.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import Router from "./router/index";
import { UilAngleUp } from "@iconscout/react-unicons";
import { useEffect } from "react";
import RequireAuth from "./components/RequireAuth";

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
