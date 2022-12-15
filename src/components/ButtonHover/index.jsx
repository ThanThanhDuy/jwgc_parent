import React from "react";
import "./index.scss";

function ButtonHover({ label, icon, active = false, onClick }) {
  const handleClick = () => {
    onClick(label);
  };
  const handleClickIcon = () => {
    onClick("close");
  };

  return (
    <div className="buttonhover__container">
      {icon ? (
        <div className="buttonhover__container__icon" onClick={handleClickIcon}>
          {icon}
        </div>
      ) : (
        <div
          data-text={label}
          onClick={handleClick}
          className={`${
            active
              ? "buttonhover__container__text__active"
              : "buttonhover__container__text"
          }`}
        >
          <span>{label}</span>
        </div>
      )}
    </div>
  );
}

export default ButtonHover;
