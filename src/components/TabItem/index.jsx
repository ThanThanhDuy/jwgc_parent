import React from "react";
import { Link } from "react-router-dom";
import "./index.scss";

function TabItem(props) {
  const { Icon, label } = props;

  return (
    <Link className="tab__item" to="/home">
      <div className="tab__item__icon">
        <img src={Icon} alt={label} />
      </div>
      {label}
    </Link>
  );
}

export default TabItem;
