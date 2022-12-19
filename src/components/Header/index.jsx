import React, { useState } from "react";
import "./index.scss";
import { Button as Btn, Input } from "reactstrap";
import { UilSearch } from "@iconscout/react-unicons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ButtonOutline from "../ButtonOutline";
import { ReactComponent as Noti } from "../../assets/icons/noti.svg";
import { ReactComponent as Close } from "../../assets/icons/close.svg";
import { Popover } from "antd";
import IconButton from "@mui/material/IconButton";
import ButtonHover from "../ButtonHover";
import { useRecoilState } from "recoil";
import { isEditState } from "../../stores/editor";
import {
  titleBlogState,
  contentBlogState,
  cateBlogState,
} from "../../stores/blog";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Modal } from "antd";

function Header() {
  const [searchValue, setSearchValue] = useState("");
  // eslint-disable-next-line
  const [isAuth, setIsAuth] = useState(true);
  const [isEdit, setIsEdit] = useRecoilState(isEditState);
  const [titleBlog, setTitleBlog] = useRecoilState(titleBlogState);
  const [contentBlog, setContentBlog] = useRecoilState(contentBlogState);
  // eslint-disable-next-line
  const [cateBlog, setCateBlog] = useRecoilState(cateBlogState);
  const location = useLocation();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(searchValue);
  };

  const handleClickButton = (value) => {
    if (value === "Chỉnh sửa") {
      setIsEdit(true);
    } else if (value === "Xem trước") {
      setIsEdit(false);
    } else if (value === "close") {
      if (titleBlog === "" && contentBlog === "") {
        navigate(-1);
      } else {
        confirm();
      }
    }
  };

  const confirm = () => {
    Modal.confirm({
      title: "Bạn có muốn thoát không ?",
      icon: <ExclamationCircleOutlined />,
      content: "Nội dung chưa được lưu sẽ bị mất",
      okText: "Thoát",
      cancelText: "Hủy",
      onOk() {
        setContentBlog("");
        setTitleBlog("");
        setCateBlog(2);
        navigate(-1);
      },
    });
  };

  return (
    <>
      <div
        className={`header ${
          location?.pathname.includes("create-post") ? "noBoxShadow" : ""
        }`}
      >
        <div
          className={`header__container ${
            location?.pathname.includes("create-post") ? "containerV2" : ""
          }`}
        >
          <div
            style={{
              display: "flex",
              width: location?.pathname.includes("create-post") ? "100%" : "",
            }}
          >
            <div className="header__container__logo">
              <Link to="/">Baby</Link>
            </div>
            {location?.pathname.includes("create-post") ? (
              <div className="header__container__boxCreatePost">
                <div className="header__container__boxCreatePost__title">
                  <span>Tạo bài viết</span>
                </div>
                <div className="header__container__boxCreatePost__controlEditor">
                  <ButtonHover
                    label="Chỉnh sửa"
                    active={isEdit}
                    onClick={handleClickButton}
                  />
                  <ButtonHover
                    label="Xem trước"
                    active={!isEdit}
                    onClick={handleClickButton}
                  />
                </div>
              </div>
            ) : (
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
            )}
          </div>
          {location?.pathname.includes("create-post") ? (
            <div>
              <ButtonHover icon={<Close />} onClick={handleClickButton} />
            </div>
          ) : !isAuth ? (
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
              <ButtonOutline
                isLink={true}
                label="Tạo bài viết"
                onClick={() => {
                  setIsEdit(true);
                  navigate("create-post");
                }}
              />
              <Noti className="header__container__auth__noti__icon" />
              <div className="header__container__auth__avatar">
                <Popover
                  placement="bottomRight"
                  content={() => (
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
                  )}
                  trigger="click"
                >
                  <IconButton
                    variant="contained"
                    className="header__container__auth__avatar__link"
                    href="#"
                  >
                    <img
                      src="https://res.cloudinary.com/practicaldev/image/fetch/s--PINMBAvy--/c_fill,f_auto,fl_progressive,h_320,q_auto,w_320/https://dev-to-uploads.s3.amazonaws.com/uploads/user/profile_image/863543/44bae2e1-fd14-460d-97ae-c1f4adee6980.png"
                      alt=""
                    />
                  </IconButton>
                </Popover>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Header;
