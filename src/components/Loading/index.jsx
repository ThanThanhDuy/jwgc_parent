import React from "react";
import "./index.scss";

function Loading() {
  return (
    <div className="loading__container">
      <div className="loading__container__dot"></div>
      <div className="loading__container__dot"></div>
      <div className="loading__container__dot"></div>
    </div>
  );
}

export default Loading;
