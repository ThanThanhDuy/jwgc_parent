import React from "react";
import { Link } from "react-router-dom";
import "./index.scss";

function TabItem(props) {
  const { Icon, label, link = "/", active, div } = props;

  if (div) {
    return (
      <div className={`tab__item ${active ? "tab__item__active" : ""}`}>
        {Icon && (
          <div className="tab__item__icon">
            <img src={Icon} alt={label} />
          </div>
        )}
        {label}
      </div>
    );
  } else {
    return (
      <Link
        className={`tab__item ${active ? "tab__item__active" : ""}`}
        to={link}
      >
        {Icon && (
          <div className="tab__item__icon">
            <img src={Icon} alt={label} />
          </div>
        )}
        {label}
      </Link>
    );
  }
}

export default TabItem;
