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
  currentPageState,
  searchValueState,
  listBlogState,
  pageCountState,
  cateSelectedState,
} from "../../stores/blog";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Modal } from "antd";
// import { isAuthState } from "../../stores/auth";
import userService from "../../services/user";
import { userState } from "../../stores/user";
import userAvatar from "../../assets/icons/user.png";
import localService from "../../services/local";
import {
  currentPageProfileState,
  scrollPositionProfileState,
  tabProfileState,
} from "../../stores/profile";
import { isOpenModalRequireAuthState } from "../../stores/auth";
import { childSelectState, typeState } from "../../stores/child";
import { getMessagingToken } from "../../utils/noti";
import { BLOG } from "../../constants/blog";
import blogService from "../../services/blog";

function Header() {
  const [searchValue, setSearchValue] = useRecoilState(searchValueState);
  const [search, setSearch] = useState("");
  const [user, setUser] = useRecoilState(userState);
  const [isEdit, setIsEdit] = useRecoilState(isEditState);
  const [titleBlog, setTitleBlog] = useRecoilState(titleBlogState);
  const [contentBlog, setContentBlog] = useRecoilState(contentBlogState);
  // eslint-disable-next-line
  const [cateBlog, setCateBlog] = useRecoilState(cateBlogState);
  const location = useLocation();
  const navigate = useNavigate();
  const setScrollPosition = useSetRecoilState(scrollPositionState);
  const [currentPage, setCurrentPage] = useRecoilState(currentPageState);
  const setScrollPositionProfile = useSetRecoilState(
    scrollPositionProfileState
  );
  const setCurrentPageProfile = useSetRecoilState(currentPageProfileState);
  const setIsOpenModalRequireAuth = useSetRecoilState(
    isOpenModalRequireAuthState
  );
  const setType = useSetRecoilState(typeState);
  const setchildSelect = useSetRecoilState(childSelectState);
  const setTabValue = useSetRecoilState(tabProfileState);
  const [listBlog, setListBlog] = useRecoilState(listBlogState);
  const [pageCount, setPageCount] = useRecoilState(pageCountState);
  const [cateSelected, setCateSelected] = useRecoilState(cateSelectedState);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSearchValue(search);
    const data = {
      Code: "",
      Title: search,
      ConcernCategoryCode: cateSelected.Code,
      Page: 1,
      PageSize: BLOG.pageSizeDefault,
    };
    const res = await blogService.getBlog(data);
    if (res && res.StatusCode === 200) {
      setListBlog(res.Data?.Items);
      setPageCount(res.Data?.TotalPagesCount);
      if (currentPage < res.Data?.TotalPagesCount) {
        setCurrentPage(1);
      }
    }
  };

  useEffect(() => {
    if (!location?.pathname.includes("create-post")) {
      const handleGetProfile = async () => {
        const fcmToken = await getMessagingToken();
        console.log(fcmToken);
        const res = await userService.getProfile(fcmToken);
        if (res && res.StatusCode === 200) {
          // setIsAuth(true);
          setUser(res.Data);
          localService.setUser(JSON.stringify(res.Data));
        } else if (res && res.StatusCode === 401) {
          // setIsAuth(false);
        }
      };
      handleGetProfile();
    }
    setIsOpenModalRequireAuth(false);
    if (!location?.pathname.includes("children-care")) {
      setType("Cha mẹ");
      setchildSelect(null);
    }
    if (!location?.pathname.includes("profile")) {
      setTabValue("1");
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
      title: "Bạn có muốn thoát không?",
      icon: <ExclamationCircleOutlined />,
      content: "Nội dung bạn đã nhập sẽ bị mất.",
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
    setScrollPositionProfile(0);
    setCurrentPageProfile(1);
    navigate(`/profile/${user?.UserName}`);
  };

  const handleHome = () => {
    setScrollPosition(0);
    setCurrentPage(1);
    setSearchValue("");
    setSearch("");
    navigate(`/home`);
  };

  const handleLogout = async () => {
    const fcmToken = await getMessagingToken();

    const res = await userService.logout(fcmToken);
    if (res && res.StatusCode === 200) {
      localService.removeAll();
      localService.removeAccessToken();
      localService.removeUser();
      setUser(null);
      navigate("/login");
    }
  };

  return (
    <>
      <div
        className={`header ${
          location?.pathname.includes("create-post") ||
          location?.pathname.includes("edit")
            ? "noBoxShadow"
            : ""
        }`}
      >
        <div
          className={`header__container ${
            location?.pathname.includes("create-post") ||
            location?.pathname.includes("edit")
              ? "containerV2"
              : ""
          }`}
        >
          <div
            style={{
              display: "flex",
              width:
                location?.pathname.includes("create-post") ||
                location?.pathname.includes("edit")
                  ? "100%"
                  : "",
            }}
          >
            <div className="header__container__logo">
              <span onClick={handleHome}>Baby</span>
            </div>
            {location?.pathname.includes("create-post") ||
            location?.pathname.includes("edit") ? (
              <div className="header__container__boxCreatePost">
                <div className="header__container__boxCreatePost__title">
                  <span>Cập nhật bài viết</span>
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
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Btn color="white" className="header__container__search__btn">
                  <UilSearch className="header__container__search__btn__icon" />
                </Btn>
              </form>
            )}
          </div>
          {location?.pathname.includes("create-post") ||
          location?.pathname.includes("edit") ? (
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
                      <span
                        className="popover_profile__link"
                        onClick={() => navigate("/invition")}
                      >
                        Xem lời mời
                      </span>
                      <span
                        className="popover_profile__link"
                        onClick={() => navigate("/career-support")}
                      >
                        Xác thực tài khoản
                      </span>
                      <div className="divider-10"></div>
                      <div>
                        {/* <Link className="popover_profile__link" to="#">Đăng xuất</Link> */}
                        <span
                          className="popover_profile__link"
                          onClick={handleLogout}
                        >
                          Đăng xuất
                        </span>
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
