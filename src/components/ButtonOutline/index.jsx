import React from "react";
import { Link } from "react-router-dom";
import { Button } from "reactstrap";
import "./index.scss";

function ButtonOutline(props) {
  const { path, isLink = true, label, onClick } = props;
  return (
    <>
      {isLink ? (
        <Link
          className={`button__outline ${isLink ? "button__outline__link" : ""}`}
          to={path}
        >
          {label}
        </Link>
      ) : (
        <Button
          className="button__outline__notlink"
          color="#ebecfe"
          onClick={onClick}
        >
          {label}
        </Button>
      )}
    </>
  );
}

export default ButtonOutline;
