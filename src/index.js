import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./themes/styles/index.scss";
import "./themes/ckEditor/index.scss";
import { RecoilRoot } from "recoil";
import "antd/dist/reset.css";
import { ConfigProvider } from "antd";
import moment from "moment";
import "moment/locale/vi";
import RecoilNexus from "recoil-nexus";
moment.locale("vi");

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#0a64c4",
        },
      }}
    >
      <RecoilRoot>
        <RecoilNexus />
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </RecoilRoot>
    </ConfigProvider>
  </>
);
