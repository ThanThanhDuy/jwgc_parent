import React from "react";
import { Button } from "reactstrap";
import "./index.scss";

function ButtonOutline(props) {
  const { isLink = true, label, onClick } = props;
  return (
    <>
      {isLink ? (
        <Button
          color="#ebecfe"
          className={`button__outline ${isLink ? "button__outline__link" : ""}`}
          onClick={onClick}
        >
          {label}
        </Button>
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
