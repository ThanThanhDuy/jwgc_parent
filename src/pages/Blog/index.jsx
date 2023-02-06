import React, { useEffect, useState } from "react";
import "./index.scss";
import DisplayBlog from "../../components/DisplayBlog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsUp as faThumbsUpRegular,
  faThumbsDown as faThumbsDownRegular,
  faBookmark as faBookmarkRegular,
  faComment as faCommentRegular,
  faPenToSquare,
  faTrashAlt,
} from "@fortawesome/free-regular-svg-icons";
import {
  faThumbsUp as faThumbsUpSolid,
  faThumbsDown as faThumbsDownSolid,
  faBookmark as faBookmarkSolid,
  faEllipsisH,
} from "@fortawesome/free-solid-svg-icons";
import Tooltip from "@mui/material/Tooltip";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import ListComment from "../../components/ListComment";
import { Popover } from "antd";
import Author from "../../components/Author";
import { Link, useNavigate } from "react-router-dom";
import { BLOG, COMMENT } from "../../constants/blog";
import { useParams } from "react-router-dom";
import blogService from "../../services/blog";
import { CATE_ICON } from "../../assets/icons/cateIcon";
import userService from "../../services/user";
import { Helmet } from "react-helmet";
import { REACTION_BLOG } from "../../constants/reactionBlog";
import { Modal, notification } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import userAvatar from "../../assets/icons/user.png";
import { useSetRecoilState } from "recoil";
import { isOpenModalRequireAuthState } from "../../stores/auth";
import ButtonOutline from "../../components/ButtonOutline";

function Blog() {
  const [cateBlog, setCateBlog] = useState(0);
  const [totalLike, setTotalLike] = useState(0);
  const [totalDislike, setTotalDislike] = useState(0);
  const [blog, setBlog] = useState({});
  const [status, setStatus] = useState(0);
  const [bookmark, setBookmark] = useState(false);
  const [comment, setComment] = useState("");
  const [openSubmitComment, setOpenSubmitComment] = useState(false);
  const [isSendingComment, setIsSendingComment] = useState(false);
  const [listComment, setListComment] = useState([]);
  const [userAuthor, setUserAuthor] = useState({});
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [error, setError] = useState([]);
  const params = useParams();
  const navigate = useNavigate();
  const setIsOpenModalRequireAuth = useSetRecoilState(
    isOpenModalRequireAuthState
  );
  const [countComment, setCountComment] = useState(0);
  const [currentPageComment, setCurrentPageComment] = useState(
    COMMENT.pageDefault
  );
  const [totalPageComment, setTotalPageComment] = useState(0);
  const [dataAuthor, setDataAuthor] = useState([]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
    const handleGetBlog = async () => {
      setLoading(true);
      const data = {
        Code: params.codeBlog,
        Title: "",
        ConcernCategoryCode: "",
        Page: BLOG.pageDefault,
        PageSize: 1,
      };
      const res = await blogService.getBlog(data);
      if (res && res.StatusCode === 200) {
        setTimeout(() => {
          setBlog(res.Data?.Items[0]);
          setTotalLike(res.Data?.Items[0]?.BlogReactions?.TotalLike);
          setTotalDislike(res.Data?.Items[0]?.BlogReactions?.TotalDislike);
          setCateBlog({
            Id: res.Data?.Items[0]?.ConcernCategory.Id,
            Label: res.Data?.Items[0]?.ConcernCategory.Name,
            Icon: CATE_ICON[res.Data?.Items[0]?.ConcernCategory.Name],
          });
          // setListComment(res.Data?.Items[0]?.BlogComments);
          setUserAuthor(res.Data?.Items[0]?.User);
          setStatus(res.Data?.Items[0]?.IsReaction);
          setBookmark(res.Data?.Items[0]?.IsFavorite);
          setCountComment(res.Data?.Items[0].BlogComments.TotalChild);
          setLoading(false);
          setIsDone(true);
        }, 500);
      } else {
        setLoading(false);
        setIsDone(true);
      }
    };
    handleGetBlog();
    const handleGetComment = async () => {
      const data = {
        BlogCode: params.codeBlog,
        Page: COMMENT.pageDefault,
        PageSize: COMMENT.pageSize,
      };
      const res = await blogService.getComment(data);
      if (res && res.StatusCode === 200) {
        const listCommentTmp = res.Data?.Items.map((item) => {
          return {
            ...item,
            ChildBlogComments: [],
            TotalChild: item.ChildBlogComments.TotalChild,
            TotalNextLevel: item.ChildBlogComments.TotalNextLevel,
          };
        });
        setListComment(listCommentTmp);
        setCurrentPageComment(1);
        setTotalPageComment(res.Data?.TotalPagesCount);
      }
    };
    handleGetComment();

    const handleGetMoreBlog = async () => {
      const data = {
        Code: params.codeBlog,
        Username: params.username,
        Page: 1,
        PageSize: 5,
      };
      const res = await blogService.getBlogByUsername(data);
      if (res && res.StatusCode === 200) {
        setDataAuthor(res.Data?.Items);
      }
    };
    handleGetMoreBlog();
    const handleGetProfile = async () => {
      const res = await userService.getProfile();
      if (res && res.StatusCode === 200) {
        setUser(res.Data);
      }
    };
    handleGetProfile();
    // eslint-disable-next-line
  }, [params.codeBlog]);

  const handleClickReaction = async (value) => {
    if (user.Code) {
      let statusTmp = status;
      let totalLikeTmp = totalLike;
      let totalDislikeTmp = totalDislike;
      if (value === REACTION_BLOG.like && status === REACTION_BLOG.default) {
        statusTmp = REACTION_BLOG.like;
        totalLikeTmp = totalLike + 1;
      } else if (
        value === REACTION_BLOG.like &&
        status === REACTION_BLOG.dislike
      ) {
        statusTmp = REACTION_BLOG.like;
        totalLikeTmp = totalLike + 1;
        totalDislikeTmp = totalDislike - 1;
      } else if (
        value === REACTION_BLOG.like &&
        status === REACTION_BLOG.like
      ) {
        statusTmp = REACTION_BLOG.default;
        totalLikeTmp = totalLike - 1;
      } else if (
        value === REACTION_BLOG.dislike &&
        status === REACTION_BLOG.default
      ) {
        statusTmp = REACTION_BLOG.dislike;
        totalDislikeTmp = totalDislike + 1;
      } else if (
        value === REACTION_BLOG.dislike &&
        status === REACTION_BLOG.like
      ) {
        statusTmp = REACTION_BLOG.dislike;
        totalLikeTmp = totalLike - 1;
        totalDislikeTmp = totalDislike + 1;
      } else if (
        value === REACTION_BLOG.dislike &&
        status === REACTION_BLOG.dislike
      ) {
        statusTmp = REACTION_BLOG.default;
        totalDislikeTmp = totalDislike - 1;
      }
      const res = await blogService.reactionBlog(blog.Code, statusTmp);
      if (res && res.StatusCode === 200) {
        setStatus(statusTmp);
        setTotalLike(totalLikeTmp);
        setTotalDislike(totalDislikeTmp);
      }
    } else {
      setIsOpenModalRequireAuth(true);
    }
  };

  const handleBookMark = async () => {
    if (user.Code) {
      if (bookmark) {
        const res = await blogService.deleteBlogFavorite(blog.Code);
        if (res && res.StatusCode === 200) {
          setBookmark(false);
        } else {
          notification.error({
            message: "Lỗi",
            description: res.Message,
          });
        }
      } else {
        const res = await blogService.saveBlogFavorite(blog.Code);
        if (res && res.StatusCode === 200) {
          setBookmark(true);
        } else {
          notification.error({
            message: "Lỗi",
            description: res.Message,
          });
        }
      }
    } else {
      setIsOpenModalRequireAuth(true);
    }
  };

  const handleComment = () => {
    const element = document.getElementById("comment");
    const y = element.getBoundingClientRect().top + window.pageYOffset - 56;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  const handleSendComment = async () => {
    if (comment.trim() === "") {
      setError(["Vui lòng nhập bình luận"]);
      const el = document.querySelector(
        ".blog__container__main__comment__you__input__text"
      );
      el.style.paddingTop = 74 + 8 + "px";
      return;
    }
    if (isSendingComment) return;
    setIsSendingComment(true);
    const res = await blogService.sendComment(comment.trim(), blog.Code, "");
    if (res && res.StatusCode === 200) {
      const tmp = {
        ...res.Data,
        ChildBlogComments: [],
        TotalChild: res.Data.TotalChild,
        TotalNextLevel: res.Data.TotalNextLevel,
      };
      setListComment([{ ...tmp }, ...listComment]);
      setComment("");
    } else {
      setError([res.Message]);
    }
    setIsSendingComment(false);
    setOpenSubmitComment(false);
  };

  const handleSendReplyComment = (res, parentCode) => {
    let listCommentTmp = [...listComment];
    const index = listCommentTmp.findIndex((item) => item.Code === parentCode);
    if (index !== -1) {
      const tmp = {
        ...res.Data,
        ChildBlogComments: [],
        TotalChild: res.Data.TotalChild,
        TotalNextLevel: res.Data.TotalNextLevel,
      };
      listCommentTmp[index].ChildBlogComments = [
        { ...tmp },
        ...listCommentTmp[index].ChildBlogComments,
      ];
    }
    setListComment(listCommentTmp);
  };

  const handleEditComment = async (value, code) => {
    let listCommentTmp = [...listComment];
    const index = listCommentTmp.findIndex((item) => item.Code === code);
    if (index !== -1) {
      listCommentTmp[index].Content = value;
    }
    setListComment(listCommentTmp);
  };

  const handleEditReplyComment = (value, code, parentCode) => {
    let listCommentTmp = [...listComment];
    const index = listCommentTmp.findIndex((item) => item.Code === parentCode);
    if (index !== -1) {
      const indexChild = listCommentTmp[index].ChildBlogComments.findIndex(
        (item) => item.Code === code
      );
      if (indexChild !== -1) {
        listCommentTmp[index].ChildBlogComments[indexChild].Content = value;
      }
    }
    setListComment(listCommentTmp);
  };

  const handleDeleteComment = (code) => {
    let listCommentTmp = [...listComment];
    const index = listCommentTmp.findIndex((item) => item.Code === code);
    if (index !== -1) {
      listCommentTmp.splice(index, 1);
    }
    setListComment(listCommentTmp);
  };

  const handleDeleteCommentReply = (code, parentCode) => {
    let listCommentTmp = [...listComment];
    const index = listCommentTmp.findIndex((item) => item.Code === parentCode);
    if (index !== -1) {
      const indexChild = listCommentTmp[index].ChildBlogComments.findIndex(
        (item) => item.Code === code
      );
      if (indexChild !== -1) {
        listCommentTmp[index].ChildBlogComments.splice(indexChild, 1);
      }
    }
    setListComment(listCommentTmp);
  };

  const handleCancelComment = () => {
    setOpenSubmitComment(false);
    setComment("");
    setError([]);
    const el = document.querySelector(
      ".blog__container__main__comment__you__input__text"
    );
    el.style.paddingTop = 8 + "px";
  };

  const handleChangeComment = (value) => {
    const element = document.getElementById("comment");
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    setComment(value);
    if (error.length > 0 && value.trim() !== "") {
      setError([]);
      const el = document.querySelector(
        ".blog__container__main__comment__you__input__text"
      );
      el.style.paddingTop = 8 + "px";
    }
  };

  const handleEdit = () => {
    navigate(
      `/edit/${encodeURIComponent(blog.Title)?.replaceAll("%20", "-")}/${
        blog.Code
      }`
    );
  };

  const handleDelete = async () => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xóa bài viết này không?",
      icon: <ExclamationCircleOutlined />,
      content: "Bài viết sẽ không thể khôi phục lại sau khi xóa",
      okText: "Xóa",
      cancelText: "Hủy",
      async onOk() {
        const res = await blogService.deleteBlog(blog.Code);
        if (res && res.StatusCode === 200) {
          navigate("/home");
          notification.open({
            type: "success",
            message: "Xóa bài viết thành công",
          });
        } else {
          notification.open({
            type: "error",
            message: "Xóa bài viết thất bại",
          });
        }
      },
    });
  };

  const handleLoadMore = async () => {
    const data = {
      BlogCode: params.codeBlog,
      Page: currentPageComment + 1,
      PageSize: COMMENT.pageSize,
    };
    const res = await blogService.getComment(data);
    if (res && res.StatusCode === 200) {
      const listCommentTmp = res.Data?.Items.map((item) => {
        return {
          ...item,
          ChildBlogComments: [],
          TotalChild: item.ChildBlogComments.TotalChild,
          TotalNextLevel: item.ChildBlogComments.TotalNextLevel,
        };
      });
      const dataUnique = [...listComment, ...listCommentTmp].filter(
        (element, index, array) =>
          array.findIndex((element2) => element2.Code === element.Code) ===
          index
      );
      setListComment(dataUnique);
      setCurrentPageComment(currentPageComment + 1);
      setTotalPageComment(res.Data.TotalPagesCount);
    } else {
      notification.open({
        type: "error",
        message: "Lấy dữ liệu thất bại",
      });
    }
  };

  const handleLoadMoreSubComment = async (parentCode, currentPage) => {
    const data = {
      BlogCode: params.codeBlog,
      ParentCode: parentCode,
      Page: currentPage,
      PageSize: COMMENT.pageSize,
    };
    const res = await blogService.getComment(data);
    if (res && res.StatusCode === 200) {
      let listCommentTmp = [...listComment];
      const index = listCommentTmp.findIndex(
        (item) => item.Code === parentCode
      );
      if (index !== -1) {
        // listCommentTmp[index].ChildBlogComments = [
        //   ...listCommentTmp[index].ChildBlogComments,
        //   ...res.Data.Items,
        // ];
        const dataUnique = [
          ...listCommentTmp[index].ChildBlogComments,
          ...res.Data.Items,
        ].filter(
          (element, index, array) =>
            array.findIndex((element2) => element2.Code === element.Code) ===
            index
        );
        listCommentTmp[index].ChildBlogComments = [...dataUnique];
      }
      setListComment(listCommentTmp);
    }
  };

  const handleShareBlog = async () => {
    const res = await blogService.shareBlog(blog.Code);
    if (res && res.StatusCode === 200) {
      notification.success({
        message: "Chia sẻ bài viết thành công",
      });
    } else {
      notification.error({
        message: "Chia sẻ bài viết thất bại",
      });
    }
  };

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>
          {decodeURIComponent(params.titleBlog?.replaceAll("-", "%20"))}
        </title>
      </Helmet>
      <div className="blog__container">
        <div className="blog__container__reaction">
          {isDone && (
            <>
              <div className="blog__container__reaction__icon">
                <Tooltip title="Thích" placement="top">
                  <FontAwesomeIcon
                    onClick={() => handleClickReaction(REACTION_BLOG.like)}
                    icon={
                      status === REACTION_BLOG.like
                        ? faThumbsUpSolid
                        : faThumbsUpRegular
                    }
                    className={`icon__like ${
                      status === REACTION_BLOG.like ? "icon__like__active" : ""
                    }`}
                  />
                </Tooltip>
                <span
                  className={`text__like ${
                    status === REACTION_BLOG.like ? "text__like__active" : ""
                  }`}
                >
                  {totalLike}
                </span>
              </div>
              <div className="blog__container__reaction__icon">
                <Tooltip title="Không thích" placement="top">
                  <FontAwesomeIcon
                    onClick={() => handleClickReaction(REACTION_BLOG.dislike)}
                    icon={
                      status === REACTION_BLOG.dislike
                        ? faThumbsDownSolid
                        : faThumbsDownRegular
                    }
                    className={`icon__dislike ${
                      status === REACTION_BLOG.dislike
                        ? "icon__dislike__active"
                        : ""
                    }`}
                  />
                </Tooltip>
                <span
                  className={`text__dislike ${
                    status === REACTION_BLOG.dislike
                      ? "text__dislike__active"
                      : ""
                  }`}
                >
                  {totalDislike}
                </span>
              </div>
              <div className="blog__container__reaction__icon">
                <Tooltip title="Bình luận" placement="top">
                  <FontAwesomeIcon
                    onClick={() => handleComment()}
                    icon={faCommentRegular}
                    className={`icon__comment`}
                  />
                </Tooltip>
              </div>
              {userAuthor?.Code === user?.Code && (
                <div
                  className="blog__container__reaction__icon"
                  onClick={handleEdit}
                >
                  <Tooltip title="Sửa bài viết" placement="top">
                    <FontAwesomeIcon
                      icon={faPenToSquare}
                      className="icon__edit"
                    />
                  </Tooltip>
                </div>
              )}
              {userAuthor?.Code === user?.Code && (
                <div
                  className="blog__container__reaction__icon"
                  onClick={handleDelete}
                >
                  <Tooltip title="Xóa bài viết" placement="top">
                    <FontAwesomeIcon
                      icon={faTrashAlt}
                      className="icon__delete"
                    />
                  </Tooltip>
                </div>
              )}
              {userAuthor?.Code !== user?.Code && (
                <div className="blog__container__reaction__icon">
                  <Tooltip title="Lưu bài viết" placement="top">
                    <FontAwesomeIcon
                      onClick={() => handleBookMark()}
                      icon={bookmark ? faBookmarkSolid : faBookmarkRegular}
                      className={`icon__bookmark ${
                        bookmark ? "icon__bookmark__active" : ""
                      }`}
                    />
                  </Tooltip>
                </div>
              )}
              {userAuthor.Code !== user.Code && (
                <div className="blog__container__reaction__icon">
                  <Popover
                    placement="rightTop"
                    content={() => (
                      <div className="popover_profile">
                        <div onClick={handleShareBlog}>
                          <span className="comment__container__content__header__more__item">
                            Chia sẻ bài viết
                          </span>
                        </div>
                        <div>
                          <span className="comment__container__content__header__more__item">
                            Báo cáo bài viết
                          </span>
                        </div>
                      </div>
                    )}
                    trigger="click"
                  >
                    <FontAwesomeIcon
                      icon={faEllipsisH}
                      className={`icon__more`}
                    />
                  </Popover>
                </div>
              )}
            </>
          )}
        </div>
        <div className="blog__container__main">
          <div className="blog__container__main__content">
            <DisplayBlog
              titleBlog={blog?.Title}
              cateBlog={cateBlog}
              contentBlog={blog?.Content}
              loading={loading}
            />
          </div>
          <div className="divider-10" id="comment"></div>
          <div className="blog__container__main__comment">
            <div className="blog__container__main__comment__title">
              <span>Bình luận ({countComment})</span>
            </div>
            {isDone && user.Code && (
              <>
                <div className="blog__container__main__comment__you">
                  <div>
                    <img
                      className="blog__container__main__comment__you__avatar"
                      src={user?.AvatarPath ? user?.AvatarPath : userAvatar}
                      alt=""
                    />
                  </div>
                  <div className="blog__container__main__comment__you__input">
                    {error.length > 0 && (
                      <div className="blog__container__main__comment__you__input__error">
                        <div className="blog__container__main__comment__you__input__error__title">
                          <span>Rất tiếc, đã xảy ra lỗi:</span>
                        </div>
                        <div>
                          <ul>
                            {error?.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                    <TextareaAutosize
                      placeholder="Viết bình luận của bạn..."
                      className={`blog__container__main__comment__you__input__text`}
                      value={comment}
                      onChange={(e) => handleChangeComment(e.target.value)}
                      onFocus={() => setOpenSubmitComment(true)}
                    />
                    {(comment || openSubmitComment) && (
                      <div className="blog__container__main__comment__you__input__control">
                        <div
                          className="blog__container__main__comment__you__input__control__btnSend"
                          onClick={handleSendComment}
                        >
                          {isSendingComment ? "Đang gửi..." : "Bình luận"}
                        </div>
                        <div
                          className="blog__container__main__comment__you__input__control__btnCancel"
                          onClick={handleCancelComment}
                        >
                          Hủy
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
            <div className="blog__container__main__comment__otherComment">
              <ListComment
                listComment={listComment}
                handleSendReplyComment={handleSendReplyComment}
                codeBlog={blog?.Code}
                handleEditComment={handleEditComment}
                handleEditReplyComment={handleEditReplyComment}
                handleDeleteComment={handleDeleteComment}
                handleDeleteCommentReply={handleDeleteCommentReply}
                handleLoadMoreSubComment={handleLoadMoreSubComment}
              />
              {totalPageComment > 1 &&
                currentPageComment !== totalPageComment && (
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <ButtonOutline
                      label="Xem thêm bình luận"
                      isLink={false}
                      onClick={handleLoadMore}
                    />
                  </div>
                )}
            </div>
          </div>
        </div>
        <div className="blog__container__author">
          <Author user={userAuthor} />
          {dataAuthor.length > 0 && (
            <div className="blog__author">
              <div className="blog__author__header">
                <p>Bài viết khác của</p>
                <Link to="#">{userAuthor.Name}</Link>
              </div>
              <div className="rank__container__list">
                {dataAuthor.map((item, index) => {
                  return (
                    <Link
                      to="#"
                      className="rank__container__list__item"
                      key={index}
                    >
                      <span>{item.Title}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Blog;
