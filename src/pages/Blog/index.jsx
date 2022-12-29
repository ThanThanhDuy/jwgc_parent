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
import { BLOG } from "../../constants/blog";
import { useParams } from "react-router-dom";
import blogService from "../../services/blog";
import { CATE_ICON } from "../../assets/icons/cateIcon";
import userService from "../../services/user";
import { Helmet } from "react-helmet";
import { REACTION_BLOG } from "../../constants/reactionBlog";
import { Modal, notification } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

// eslint-disable-next-line
const data = [
  {
    id: 1,
    comment: `Bài viết hay quá ạ.
    Bài viết hay quá ạ.
    Bài viết hay quá ạ.
    Bài viết hay quá ạ.`,
    timePost: "2021-10-11T14:15:10",
    timeEdit: "2021-10-12T18:16:10",
    replyTo: null,
    like: 10,
    dislike: 2,
    isLike: "like",
    user: {
      name: "Nguyễn Văn A",
      avatar: "https://picsum.photos/200",
    },
    reply: [
      {
        id: 2,
        comment: "Toi cung thay vay",
        timePost: "2021-10-11T14:15:10",
        timeEdit: "2021-10-12T18:16:10",
        like: 10,
        dislike: 2,
        isLike: "like",
        replyTo: {
          idComment: 1,
          name: "Nguyễn Văn A",
          avatar: "https://picsum.photos/200",
        },
        user: {
          name: "Nguyễn Văn C",
          avatar: "https://picsum.photos/400",
        },
      },
      {
        id: 3,
        comment: "uhm k te",
        timePost: "2021-10-11T14:15:10",
        timeEdit: "2021-10-12T18:16:10",
        like: 10,
        dislike: 2,
        isLike: "dislike",
        replyTo: {
          idComment: 3,
          name: "Nguyễn Văn C",
          avatar: "https://picsum.photos/200",
        },
        user: {
          name: "Nguyễn Văn D",
          avatar: "https://picsum.photos/100",
        },
      },
    ],
  },
  {
    id: 2,
    comment: "Bài viết te quá ",
    timePost: "2021-10-13T19:11:10",
    timeEdit: "",
    like: 10,
    dislike: 2,
    isLike: "",
    replyTo: null,
    user: {
      name: "Nguyễn Văn B",
      avatar: "https://picsum.photos/300",
    },
    reply: [],
  },
];

const dataAuthor = [
  {
    Code: "1",
    Name: "Sữa Aptamil Essensis có tăng cân không?",
  },
  {
    Code: "2",
    Name: "Pediakid là thuốc gì? Có nên cho bé sử dụng hay không?",
  },
  {
    Code: "3",
    Name: "4 cách phân biệt bình moyuum thật giả chỉ trong 1 phút",
  },
  {
    Code: "4",
    Name: "Đối mặt với Khủng hoảng tuổi lên 2 của con, mẹ phải làm sao?",
  },
  {
    Code: "5",
    Name: "Những sai lầm khi sử dụng men vi sinh cho bé sơ sinh",
  },
];

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
          setListComment(res.Data?.Items[0]?.BlogComments);
          setUserAuthor(res.Data?.Items[0]?.User);
          setStatus(res.Data?.Items[0]?.IsReaction);
          setLoading(false);
          setIsDone(true);
        }, 500);
      } else {
        setLoading(false);
        setIsDone(true);
      }
    };
    handleGetBlog();
    const handleGetProfile = async () => {
      const res = await userService.getProfile();
      if (res && res.StatusCode === 200) {
        setUser(res.Data);
      }
    };
    handleGetProfile();
  }, [params.codeBlog]);

  const handleClickReaction = async (value) => {
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
    } else if (value === REACTION_BLOG.like && status === REACTION_BLOG.like) {
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
  };

  const handleBookMark = () => {
    setBookmark(!bookmark);
  };

  const handleComment = () => {
    const element = document.getElementById("comment");
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleSendComment = () => {
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
    setTimeout(() => {
      setIsSendingComment(false);
      setComment("");
      setOpenSubmitComment(false);
    }, 1000);
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
                        <div>
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
          <div className="divider-10"></div>
          <div className="blog__container__main__comment" id="comment">
            <div className="blog__container__main__comment__title">
              <span>Bình luận ({listComment.length})</span>
            </div>
            {isDone && (
              <>
                <div className="blog__container__main__comment__you">
                  <div>
                    <img
                      className="blog__container__main__comment__you__avatar"
                      src="https://res.cloudinary.com/practicaldev/image/fetch/s--PINMBAvy--/c_fill,f_auto,fl_progressive,h_320,q_auto,w_320/https://dev-to-uploads.s3.amazonaws.com/uploads/user/profile_image/863543/44bae2e1-fd14-460d-97ae-c1f4adee6980.png"
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
              <ListComment listComment={listComment} />
            </div>
          </div>
        </div>
        <div className="blog__container__author">
          <Author user={userAuthor} />
          <div className="blog__author">
            <div className="blog__author__header">
              <p>Bài viết khác của</p>
              <Link>{userAuthor.Name}</Link>
            </div>
            <div className="rank__container__list">
              {dataAuthor.map((item, index) => {
                return (
                  <Link className="rank__container__list__item" key={index}>
                    <span>{item.Name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Blog;
