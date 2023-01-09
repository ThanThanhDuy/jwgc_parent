import React, { useState } from "react";
import { Helmet } from "react-helmet";
import "./index.scss";
import SidebarChildren from "../../components/SidebarChildren";
import Activity from "../../components/Activity";

function Children() {
  return (
    <div className="childrenContainer">
      <Helmet>
        <title>Chăm sóc trẻ</title>
      </Helmet>

      <div className="childrenContainer__main">
        <SidebarChildren />
        <Activity />
      </div>
    </div>
  );
}

export default Children;
