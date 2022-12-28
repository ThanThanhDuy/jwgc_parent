import React, { useEffect, useState } from "react";
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
import { useRecoilState, useSetRecoilState } from "recoil";
import { isEditState } from "../../stores/editor";
import {
  titleBlogState,
  contentBlogState,
  cateBlogState,
  scrollPositionState,
} from "../../stores/blog";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Modal } from "antd";
// import { isAuthState } from "../../stores/auth";
import userService from "../../services/user";
import { userState } from "../../stores/user";
import userAvatar from "../../assets/icons/user.png";
import localService from "../../services/local";
import { listBlogProfileState } from "../../stores/profile";

function Header() {
  const [searchValue, setSearchValue] = useState("");
  // const [open, setOpen] = useState(false);
  // eslint-disable-next-line
  // const [isAuth, setIsAuth] = useState(true);
  const [user, setUser] = useRecoilState(userState);
  // const [isAuth, setIsAuth] = useRecoilState(isAuthState);
  const [isEdit, setIsEdit] = useRecoilState(isEditState);
  const [titleBlog, setTitleBlog] = useRecoilState(titleBlogState);
  const [contentBlog, setContentBlog] = useRecoilState(contentBlogState);
  // eslint-disable-next-line
  const [cateBlog, setCateBlog] = useRecoilState(cateBlogState);
  const location = useLocation();
  const navigate = useNavigate();
  const setScrollPosition = useSetRecoilState(scrollPositionState);
  const setListBlogProfileState = useSetRecoilState(listBlogProfileState);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(searchValue);
  };

  useEffect(() => {
    if (!location?.pathname.includes("create-post")) {
      const handleGetProfile = async () => {
        const res = await userService.getProfile();
        if (res && res.StatusCode === 200) {
          // setIsAuth(true);
          setUser(res.Data);
        } else if (res && res.StatusCode === 401) {
          // setIsAuth(false);
        }
      };
      handleGetProfile();
    }
    // eslint-disable-next-line
  }, [location?.pathname]);

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
        setCateBlog(0);
        navigate(-1);
      },
    });
  };

  const handleProfile = () => {
    if (!location?.pathname.includes(`${user?.UserName}`)) {
      setListBlogProfileState([]);
    }
    navigate(`/profile/${user?.UserName}`);
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
              <Link to="/home">Baby</Link>
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
          ) : !localService.getAccessToken() ? (
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
                  setScrollPosition(window.pageYOffset);
                  navigate("create-post");
                }}
              />
              <Noti className="header__container__auth__noti__icon" />
              <div className="header__container__auth__avatar">
                <Popover
                  getPopupContainer={(trigger) => trigger.parentElement}
                  placement="bottomRight"
                  content={() => (
                    <div className="popover_profile">
                      <span
                        className="popover_profile__link"
                        onClick={handleProfile}
                      >
                        <div>
                          <p className="popover_profile__link__name">
                            {user?.Name}
                          </p>
                          <p className="popover_profile__link__username">
                            @{user?.UserName}
                          </p>
                        </div>
                      </span>
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
                      src={user?.AvatarPath ? user?.AvatarPath : userAvatar}
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
