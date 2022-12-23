import React, { useEffect, useState } from "react";
import "./index.scss";
import localService from "../../services/local";
import DisplayBlog from "../../components/DisplayBlog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsUp as faThumbsUpRegular,
  faThumbsDown as faThumbsDownRegular,
  faBookmark as faBookmarkRegular,
  faComment as faCommentRegular,
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
import { Link } from "react-router-dom";

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
  const [titleBlog, setTitleBlog] = useState("");
  const [contentBlog, setContentBlog] = useState("");
  const [cateBlog, setCateBlog] = useState(2);
  const [status, setStatus] = useState("");
  const [bookmark, setBookmark] = useState(false);
  const [comment, setComment] = useState("");
  const [openSubmitComment, setOpenSubmitComment] = useState(false);
  const [isSendingComment, setIsSendingComment] = useState(false);
  // eslint-disable-next-line
  const [error, setError] = useState([]);

  useEffect(() => {
    const blogContent = localService.getblogContent();
    if (blogContent) {
      setContentBlog(blogContent);
    }
    const blogTitle = localService.getblogTitle();
    if (blogTitle) {
      setTitleBlog(blogTitle);
    }
    const blogCategory = localService.getBlogCategory();
    if (blogCategory) {
      setCateBlog(Number(blogCategory));
    }
  }, []);

  const handleClickReaction = (value) => {
    if (value === "like" && status === "") {
      setStatus("like");
    } else if (value === "like" && status === "dislike") {
      setStatus("like");
    } else if (value === "like" && status === "like") {
      setStatus("");
    } else if (value === "dislike" && status === "") {
      setStatus("dislike");
    } else if (value === "dislike" && status === "like") {
      setStatus("dislike");
    } else if (value === "dislike" && status === "dislike") {
      setStatus("");
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

  return (
    <>
      <div className="blog__container">
        <div className="blog__container__reaction">
          <div className="blog__container__reaction__icon">
            <Tooltip title="Thích" placement="top">
              <FontAwesomeIcon
                onClick={() => handleClickReaction("like")}
                icon={status === "like" ? faThumbsUpSolid : faThumbsUpRegular}
                className={`icon__like ${
                  status === "like" ? "icon__like__active" : ""
                }`}
              />
            </Tooltip>
            <span
              className={`text__like ${
                status === "like" ? "text__like__active" : ""
              }`}
            >
              0
            </span>
          </div>
          <div className="blog__container__reaction__icon">
            <Tooltip title="Không thích" placement="top">
              <FontAwesomeIcon
                onClick={() => handleClickReaction("dislike")}
                icon={
                  status === "dislike" ? faThumbsDownSolid : faThumbsDownRegular
                }
                className={`icon__dislike ${
                  status === "dislike" ? "icon__dislike__active" : ""
                }`}
              />
            </Tooltip>
            <span
              className={`text__dislike ${
                status === "dislike" ? "text__dislike__active" : ""
              }`}
            >
              0
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
              <FontAwesomeIcon icon={faEllipsisH} className={`icon__more`} />
            </Popover>
          </div>
        </div>
        <div className="blog__container__main">
          <div className="blog__container__main__content">
            <DisplayBlog
              titleBlog={titleBlog}
              cateBlog={cateBlog}
              contentBlog={contentBlog}
            />
          </div>
          <div className="divider-10"></div>
          <div className="blog__container__main__comment" id="comment">
            <div className="blog__container__main__comment__title">
              <span>Bình luận (16)</span>
            </div>
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
            <div className="blog__container__main__comment__otherComment">
              <ListComment listComment={data} />
            </div>
          </div>
        </div>
        <div className="blog__container__author">
          <Author />
          <div className="blog__author">
            <div className="blog__author__header">
              <p>Bài viết khác của</p>
              <Link>Nguyễn Thị Thanh Như</Link>
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
