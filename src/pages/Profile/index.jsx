import React, { useEffect, useState } from "react";
import "./index.scss";
import userService from "../../services/user";
import { Col, Row } from "antd";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
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
  listBlogProfileState,
  pageCountProfileState,
  currentPageProfileState,
  scrollPositionProfileState,
} from "../../stores/profile";
import ListBlog from "../../components/ListBlog";

function Profile() {
  const [user, setUser] = useState({});
  const params = useParams();
  const [listBlog, setListBlog] = useRecoilState(listBlogProfileState);
  const [pageCount, setPageCount] = useRecoilState(pageCountProfileState);
  const [currentPage, setCurrentPage] = useRecoilState(currentPageProfileState);
  const scrollPosition = useRecoilValue(scrollPositionProfileState);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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
    if (listBlog.length === 0) {
      const handleGetBlogByUsername = async () => {
        const data = {
          Code: "",
          Username: params.username,
          Page: BLOG.pageDefault,
          PageSize: BLOG.pageSizeDefault,
        };
        const res = await blogService.getBlogByUsername(data);
        if (res && res.StatusCode === 200) {
          setListBlog(res.Data?.Items);
          setPageCount(res.Data?.TotalPagesCount);
        }
        setLoading(false);
      };
      handleGetBlogByUsername();
    } else {
      window.scrollTo({
        top: scrollPosition,
        left: 0,
        behavior: "instant",
      });
    }
    // eslint-disable-next-line
  }, []);

  const handleLoadMore = async () => {
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
                <button className="jwgc__btn__primary">Chỉnh sửa</button>

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
