import React, { useState } from "react";
import "./index.scss";
import { Link } from "react-router-dom";
import moment from "moment";
import Tooltip from "@mui/material/Tooltip";
import { ReactComponent as More } from "../../assets/icons/more.svg";
import { Popover } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsUp as faThumbsUpRegular,
  faThumbsDown as faThumbsDownRegular,
  faComment as faCommentRegular,
} from "@fortawesome/free-regular-svg-icons";
import {
  faThumbsUp as faThumbsUpSolid,
  faThumbsDown as faThumbsDownSolid,
} from "@fortawesome/free-solid-svg-icons";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import { STATUS_BLOG } from "../../constants/statusBlog";

function CommentReply({ item, index }) {
  const [status, setStatus] = useState(item?.isLike);
  const [commentValue, setCommentValue] = useState("");
  const [isSendingComment, setIsSendingComment] = useState(false);
  const [isOpenComment, setIsOpenComment] = useState(false);
  const [error, setError] = useState([]);

  const handleClickReaction = (value) => {
    if (value === STATUS_BLOG["like"] && status === STATUS_BLOG["noReaction"]) {
      setStatus(STATUS_BLOG["like"]);
    } else if (
      value === STATUS_BLOG["like"] &&
      status === STATUS_BLOG["dislike"]
    ) {
      setStatus(STATUS_BLOG["like"]);
    } else if (
      value === STATUS_BLOG["like"] &&
      status === STATUS_BLOG["like"]
    ) {
      setStatus(STATUS_BLOG["noReaction"]);
    } else if (
      value === STATUS_BLOG["dislike"] &&
      status === STATUS_BLOG["noReaction"]
    ) {
      setStatus(STATUS_BLOG["dislike"]);
    } else if (
      value === STATUS_BLOG["dislike"] &&
      status === STATUS_BLOG["like"]
    ) {
      setStatus(STATUS_BLOG["dislike"]);
    } else if (
      value === STATUS_BLOG["dislike"] &&
      status === STATUS_BLOG["dislike"]
    ) {
      setStatus(STATUS_BLOG["noReaction"]);
    }
  };

  const handleSendComment = () => {
    if (commentValue.trim() === "") {
      setError(["Vui lòng nhập bình luận"]);
      const el = document.querySelectorAll(
        ".commentReply__blog__container__main__comment__you__input__text"
      );
      console.log(el);
      el[index * 2].style.paddingTop = 74 + 8 + "px";
      return;
    }
    if (isSendingComment) return;
    setIsSendingComment(true);
    setTimeout(() => {
      setIsSendingComment(false);
      setCommentValue("");
    }, 1000);
  };

  const handleCancelComment = () => {
    setCommentValue("");
    setError([]);
    const el = document.querySelectorAll(
      ".commentReply__blog__container__main__comment__you__input__text"
    );
    el[index * 2].style.paddingTop = 8 + "px";
    setIsOpenComment(false);
  };

  const handleChangeComment = (value) => {
    const element = document.getElementById("comment");
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    setCommentValue(value);
    if (error.length > 0 && value.trim() !== "") {
      setError([]);
      const el = document.querySelectorAll(
        ".commentReply__blog__container__main__comment__you__input__text"
      );
      el[index * 2].style.paddingTop = 8 + "px";
    }
  };

  const handleOpenComment = () => {
    setIsOpenComment(true);
    const el = document.querySelectorAll(
      ".commentReply__blog__container__main__comment__you__input__text"
    );
    setTimeout(() => {
      el[index * 2].focus();
    }, 0);
  };

  return (
    <div>
      <div className="commentReply__container">
        <div className="commentReply__container__avatar">
          <Link to="/">
            <img src={item?.user.avatar} alt="" />
          </Link>
        </div>
        <div className="commentReply__container__content">
          <div className="commentReply__container__content__box">
            <div className="commentReply__container__content__header">
              <div className="commentReply__container__content__header__user">
                <Link
                  className="commentReply__container__content__header__user__name"
                  to="/"
                >
                  {item?.user.name}
                </Link>
                <div className="commentReply__container__content__header__user__time">
                  <span className="commentReply__container__content__header__user__time__icon">
                    •
                  </span>
                  <Tooltip
                    title={`Bình luận ngày ${moment(item?.timePost).format(
                      "DD MMMM, HH:mm"
                    )}`}
                    placement="top"
                  >
                    <span className="commentReply__container__content__header__user__time__text">
                      {moment(item?.timePost).format("DD MMMM")}
                    </span>
                  </Tooltip>
                  {item?.timeEdit && (
                    <>
                      <span className="commentReply__container__content__header__user__time__icon">
                        •
                      </span>
                      <Tooltip
                        title={`Chỉnh sửa lúc ${moment(item?.timeEdit).format(
                          "DD MMMM, HH:mm"
                        )}`}
                        placement="top"
                      >
                        <span className="commentReply__container__content__header__user__time__text">
                          Chỉnh sửa {moment(item?.timeEdit).format("DD MMMM")}
                        </span>
                      </Tooltip>
                    </>
                  )}
                </div>
              </div>
              <div className="commentReply__container__content__header__more">
                <Popover
                  placement="bottomRight"
                  content={() => (
                    <div className="popover_profile">
                      <div>
                        <span className="commentReply__container__content__header__more__item">
                          Báo cáo bình luận
                        </span>
                      </div>
                    </div>
                  )}
                  trigger="click"
                >
                  <More className="commentReply__container__content__header__more__icon" />
                </Popover>
              </div>
            </div>
            <span>
              <Link className="commentReply__container__link">
                @{item.replyTo.name}
              </Link>{" "}
              {item?.comment}
            </span>
          </div>
          <div className="commentReply__container__content__control">
            <div className="commentReply__container__content__control__like">
              <Tooltip title="Thích" placement="bottom">
                <div
                  className={`commentReply__container__content__control__like__box ${
                    status === STATUS_BLOG["like"]
                      ? "commentReply__container__content__control__like__box__active"
                      : ""
                  }`}
                  onClick={() => handleClickReaction(STATUS_BLOG["like"])}
                >
                  <FontAwesomeIcon
                    icon={
                      status === STATUS_BLOG["like"]
                        ? faThumbsUpSolid
                        : faThumbsUpRegular
                    }
                    className={`icon__like ${
                      status === STATUS_BLOG["like"] ? "icon__like__active" : ""
                    }`}
                  />
                  <span
                    className={`text__like ${
                      status === STATUS_BLOG["like"] ? "text__like__active" : ""
                    }`}
                  >
                    {item?.like} lượt thích
                  </span>
                </div>
              </Tooltip>
            </div>
            <div className="commentReply__container__content__control__dislike">
              <Tooltip title="Không thích" placement="top">
                <div
                  className={`commentReply__container__content__control__dislike__box ${
                    status === STATUS_BLOG["dislike"]
                      ? "commentReply__container__content__control__dislike__box__active"
                      : ""
                  }`}
                  onClick={() => handleClickReaction(STATUS_BLOG["dislike"])}
                >
                  <FontAwesomeIcon
                    icon={
                      status === STATUS_BLOG["dislike"]
                        ? faThumbsDownSolid
                        : faThumbsDownRegular
                    }
                    className={`icon__dislike ${
                      status === STATUS_BLOG["dislike"]
                        ? "icon__dislike__active"
                        : ""
                    }`}
                  />
                  <span
                    className={`text__dislike ${
                      status === STATUS_BLOG["dislike"]
                        ? "text__dislike__active"
                        : ""
                    }`}
                  >
                    {item?.dislike} lượt không thích
                  </span>
                </div>
              </Tooltip>
            </div>
            <div>
              <Tooltip title="Bình luận" placement="top">
                <div
                  className="commentReply__container__content__control__comment__box"
                  onClick={handleOpenComment}
                >
                  <FontAwesomeIcon
                    icon={faCommentRegular}
                    className={`icon__comment`}
                  />
                  <span className={`text__comment`}>Bình luận</span>
                </div>
              </Tooltip>
            </div>
          </div>
          {/* {isOpenComment && ( */}
          <div
            style={{ display: isOpenComment ? "block" : "none" }}
            className="commentReply__blog__container__main__comment__you__input"
          >
            {/* {error.length > 0 && ( */}
            <div
              style={{ display: error.length > 0 ? "block" : "none" }}
              className="commentReply__blog__container__main__comment__you__input__error"
            >
              <div className="commentReply__blog__container__main__comment__you__input__error__title">
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
            {/* )} */}
            <TextareaAutosize
              placeholder="Viết bình luận của bạn..."
              className="commentReply__blog__container__main__comment__you__input__text"
              value={commentValue}
              onChange={(e) => handleChangeComment(e.target.value)}
            />
            <div className="commentReply__blog__container__main__comment__you__input__control">
              <div
                className="commentReply__blog__container__main__comment__you__input__control__btnSend"
                onClick={handleSendComment}
              >
                {isSendingComment ? "Đang gửi..." : "Bình luận"}
              </div>
              <div
                className="commentReply__blog__container__main__comment__you__input__control__btnCancel"
                onClick={handleCancelComment}
              >
                Hủy
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommentReply;
