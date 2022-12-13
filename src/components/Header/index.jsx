import React, { useState } from "react";
import "./index.scss";
import { Button as Btn, Input } from "reactstrap";
import { UilSearch } from "@iconscout/react-unicons";
import { Link } from "react-router-dom";
import ButtonOutline from "../ButtonOutline";
import { ReactComponent as Noti } from "../../assets/icons/noti.svg";
import Popover from "@mui/material/Popover";
import IconButton from "@mui/material/IconButton";

function Header() {
  const [searchValue, setSearchValue] = useState("");
  // eslint-disable-next-line
  const [isAuth, setIsAuth] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(searchValue);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div className="header">
      <div className="header__container">
        <div style={{ display: "flex" }}>
          <div className="header__container__logo">
            <Link to="/">Baby</Link>
          </div>
          <form
            className="header__container__search"
            onSubmit={(e) => handleSubmit(e)}
          >
            <Input
              name="search"
              className="header__container__search__bar"
              placeholder="Tìm kiếm..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <Btn color="white" className="header__container__search__btn">
              <UilSearch className="header__container__search__btn__icon" />
            </Btn>
          </form>
        </div>
        {!isAuth ? (
          <div className="header__container__notauth">
            <Link className="header__container__notauth__login" to="/login">
              Đăng nhập
            </Link>
            <Link
              className="header__container__notauth__register"
              to="/register"
            >
              Đăng ký
            </Link>
          </div>
        ) : (
          <div className="header__container__auth">
            <ButtonOutline isLink={true} label="Tạo bài viết" path="/home" />
            <Noti className="header__container__auth__noti__icon" />
            <div className="header__container__auth__avatar">
              <IconButton
                aria-describedby={id}
                variant="contained"
                onClick={handleClick}
                className="header__container__auth__avatar__link"
                href="#"
              >
                <img
                  src="https://res.cloudinary.com/practicaldev/image/fetch/s--PINMBAvy--/c_fill,f_auto,fl_progressive,h_320,q_auto,w_320/https://dev-to-uploads.s3.amazonaws.com/uploads/user/profile_image/863543/44bae2e1-fd14-460d-97ae-c1f4adee6980.png"
                  alt=""
                />
              </IconButton>
              <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <div className="popover_profile">
                  <Link className="popover_profile__link">
                    <div>
                      <p className="popover_profile__link__name">
                        Thân Thanh Duy
                      </p>
                      <p className="popover_profile__link__username">
                        @thanthanhduy
                      </p>
                    </div>
                  </Link>
                  <div className="divider-10"></div>
                  <div>
                    <Link className="popover_profile__link">Đăng xuất</Link>
                  </div>
                </div>
              </Popover>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
