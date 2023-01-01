import React, { useEffect, useState } from "react";
import "./index.scss";
import userService from "../../services/user";
import { Col, Row } from "antd";
import { Helmet } from "react-helmet";
import { useNavigate, useParams } from "react-router-dom";
import {
  UilEllipsisH,
  UilUserPlus,
  UilUserCheck,
  UilNewspaper,
  UilComment,
} from "@iconscout/react-unicons";
import { Popover } from "antd";
import blogService from "../../services/blog";
import { BLOG } from "../../constants/blog";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  currentPageProfileState,
  scrollPositionProfileState,
} from "../../stores/profile";
import ListBlog from "../../components/ListBlog";
import localService from "../../services/local";

function Profile() {
  const [user, setUser] = useState({});
  const params = useParams();
  const [listBlog, setListBlog] = useState([]);
  const [pageCount, setPageCount] = useState(1);
  const [currentPage, setCurrentPage] = useRecoilState(currentPageProfileState);
  const scrollPosition = useRecoilValue(scrollPositionProfileState);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (params.username === localService.getUser().UserName) {
      const handleGetProfile = async () => {
        const res = await userService.getProfile();
        if (res && res.StatusCode === 200) {
          setUser(res.Data);
        }
      };
      handleGetProfile();
    } else {
      const handleGetProfileByUsername = async () => {
        const res = await userService.getProfileByUsername({
          userName: params.username,
        });
        if (res && res.StatusCode === 200) {
          setUser(res.Data);
        }
      };
      handleGetProfileByUsername();
    }

    if (params.username === localService.getUser().UserName) {
      const handleGetMyBlog = async () => {
        setLoading(true);
        let dataTmp = [];
        for (let i = 1; i <= currentPage; i++) {
          const data = {
            Code: "",
            Title: "",
            Status: "",
            ConcernCategoryCode: "",
            Page: i,
            PageSize: BLOG.pageSizeDefault,
          };
          const res = await blogService.getMyBlog(data);
          if (res && res.StatusCode === 200) {
            if (res.Data?.Items.length > 0) {
              if (dataTmp.length === 0) {
                dataTmp = res.Data?.Items;
              } else {
                dataTmp = dataTmp.concat(res.Data?.Items);
              }
              setPageCount(res.Data?.TotalPagesCount);
            }
          }
          setListBlog(dataTmp);
          setLoading(false);
          const scroll = new Promise((resolve) => {
            setTimeout(() => {
              window.scrollTo({
                top: scrollPosition,
                left: 0,
                behavior: "instant",
              });
              resolve();
            }, 0);
          });
          await scroll;
        }
      };
      handleGetMyBlog();
    } else {
      const handleGetBlogByUsername = async () => {
        setLoading(true);
        let dataTmp = [];
        for (let i = 1; i <= currentPage; i++) {
          const data = {
            Code: "",
            Username: params.username,
            Page: i,
            PageSize: BLOG.pageSizeDefault,
          };
          const res = await blogService.getBlogByUsername(data);
          if (res && res.StatusCode === 200) {
            if (res.Data?.Items.length > 0) {
              if (dataTmp.length === 0) {
                dataTmp = res.Data?.Items;
              } else {
                dataTmp = dataTmp.concat(res.Data?.Items);
              }
              setPageCount(res.Data?.TotalPagesCount);
            }
          }
          setListBlog(dataTmp);
          setLoading(false);
          const scroll = new Promise((resolve) => {
            setTimeout(() => {
              window.scrollTo({
                top: scrollPosition,
                left: 0,
                behavior: "instant",
              });
              resolve();
            }, 0);
          });
          await scroll;
        }
      };
      handleGetBlogByUsername();
    }

    // eslint-disable-next-line
  }, [params.username]);

  const handleLoadMore = async () => {
    if (params.username === localService.getUser().UserName) {
      const handleGetMyBlog = async () => {
        const data = {
          Code: "",
          Title: "",
          Status: "",
          ConcernCategoryCode: "",
          Page: currentPage + 1,
          PageSize: BLOG.pageSizeDefault,
        };
        const res = await blogService.getMyBlog(data);
        if (res && res.StatusCode === 200) {
          setListBlog(listBlog.concat(res.Data?.Items));
          setPageCount(res.Data?.TotalPagesCount);
          if (currentPage < res.Data?.TotalPagesCount) {
            setCurrentPage(currentPage + 1);
          }
        }
      };
      handleGetMyBlog();
    } else {
      const handleGetBlogByUsername = async () => {
        const data = {
          Code: "",
          Username: params.username,
          Page: currentPage + 1,
          PageSize: BLOG.pageSizeDefault,
        };
        const res = await blogService.getBlogByUsername(data);
        if (res && res.StatusCode === 200) {
          setListBlog(listBlog.concat(res.Data?.Items));
          setPageCount(res.Data?.TotalPagesCount);
          if (currentPage < res.Data?.TotalPagesCount) {
            setCurrentPage(currentPage + 1);
          }
        }
      };
      handleGetBlogByUsername();
    }
  };

  return (
    <div className="profile__container">
      <Helmet>
        <meta charSet="utf-8" />
        <title>{`${user?.Name ? user?.Name : ""}`}</title>
      </Helmet>
      <div className="profile__container__box">
        <div className="profile__container__box__header">
          <Row>
            <Col span={8} offset={8}>
              <div className="profile__container__box__header__avatar">
                <img src={user.AvatarPath} alt="" />
              </div>
            </Col>
            <Col span={8}>
              <div className="profile__container__box__header__edit">
                {user.Code === localService.getUser().Code ? (
                  <button
                    onClick={() => {
                      navigate(`/profile/update/${user.Code}`);
                    }}
                    className="jwgc__btn__primary"
                  >
                    Chỉnh sửa
                  </button>
                ) : (
                  <button className="jwgc__btn__primary">Theo dõi</button>
                )}
                {user.Code !== localService.getUser().Code && (
                  <Popover
                    placement="bottomRight"
                    content={() => (
                      <div className="popover_profile">
                        <div>
                          <span className="comment__container__content__header__more__item">
                            Báo cáo người dùng
                          </span>
                        </div>
                      </div>
                    )}
                    trigger="click"
                  >
                    <button className="button__more">
                      <UilEllipsisH className="button__more__icon" />
                    </button>
                  </Popover>
                )}
              </div>
            </Col>
          </Row>
        </div>
        <div className="profile__container__box__infor">
          <p className="profile__container__box__infor__name">{user.Name}</p>
          <p className="profile__container__box__infor__join">
            Tham gia ngày 26 tháng 12 năm 2022
          </p>
        </div>
      </div>
      <div className="profile__container__main">
        <div className="profile__container__main__more">
          <div className="profile__container__main__more__infor">
            <Row gutter={0}>
              <Col
                span={24}
                className="profile__container__main__more__infor__item"
              >
                <UilUserPlus color="rgb(113,113,113)" />{" "}
                <span>18 người theo dõi</span>
              </Col>
              <Col
                span={24}
                className="profile__container__main__more__infor__item"
              >
                <UilUserCheck color="rgb(113,113,113)" />{" "}
                <span>Đang theo dõi 12 người</span>
              </Col>
              <Col
                span={24}
                className="profile__container__main__more__infor__item"
              >
                <UilNewspaper color="rgb(113,113,113)" />{" "}
                <span>10 Bài viết đã đăng</span>
              </Col>
              <Col
                span={24}
                className="profile__container__main__more__infor__item"
              >
                <UilComment color="rgb(113,113,113)" />{" "}
                <span>23 Bình luận đã viết</span>
              </Col>
            </Row>
          </div>
        </div>
        <div className="profile__container__main__blog">
          <ListBlog
            listBlog={listBlog}
            pageCount={pageCount}
            currentPage={currentPage}
            handleLoadMore={handleLoadMore}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}

export default Profile;
