import React from "react";
import { Outlet } from "react-router-dom";
import "./index.scss";

function Content() {
  return <Outlet />;
}

export default Content;
