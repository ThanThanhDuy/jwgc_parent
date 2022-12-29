import React, { useState } from "react";
import "./index.scss";
import { Link } from "react-router-dom";
import moment from "moment";
import Tooltip from "@mui/material/Tooltip";
import { ReactComponent as More } from "../../assets/icons/more.svg";
import { Popover } from "antd";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import blogService from "../../services/blog";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { Modal } from "antd";
const { confirm } = Modal;

function CommentReply({
  item,
  index,
  name,
  isUser,
  handleEditReplyComment,
  parentCode,
  handleDeleteCommentReply,
}) {
  const [commentValue, setCommentValue] = useState("");
  const [isSendingComment, setIsSendingComment] = useState(false);
  const [isOpenComment, setIsOpenComment] = useState(false);
  const [error, setError] = useState([]);
  const [isEdit, setIsEdit] = useState(false);

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

  const handleSendCommentUpdate = async () => {
    if (commentValue.trim() === "") {
      setError(["Vui lòng nhập bình luận"]);
      const el = document.querySelectorAll(
        ".comment__blog__container__main__comment__you__input__text"
      );
      console.log(el);
      el[index * 2].style.paddingTop = 74 + 8 + "px";
      return;
    }
    if (isSendingComment) return;
    setIsSendingComment(true);
    const res = await blogService.updateComment(item.Code, commentValue.trim());
    if (res && res.StatusCode === 200) {
      handleEditReplyComment(commentValue.trim(), item.Code, parentCode);
      setCommentValue("");
    } else {
      setError([res.Message]);
    }
    setIsSendingComment(false);
    setIsOpenComment(false);
    setIsEdit(false);
  };

  const handleDeleteComment = async () => {
    confirm({
      title: "Bạn có chắc chắn muốn xóa bình luận này không?",
      icon: <ExclamationCircleFilled />,
      content: "Bình luận sẽ bị xóa vĩnh viễn",
      async onOk() {
        const res = await blogService.deleteComment(item.Code);
        if (res && res.StatusCode === 200) {
          handleDeleteCommentReply(item.Code, parentCode);
        } else {
          setError([res.Message]);
        }
      },
      onCancel() {},
    });
  };

  const handleEditCommentCo = () => {
    handleOpenComment();
    setIsEdit(true);
    setCommentValue(item.Content);
  };

  const handleCancelComment = () => {
    setIsEdit(false);
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
            <img src={item?.User.AvatarPath} alt="" />
          </Link>
        </div>
        <div className="commentReply__container__content">
          {!isEdit && (
            <div className="commentReply__container__content__box">
              <div className="commentReply__container__content__header">
                <div className="commentReply__container__content__header__user">
                  <Link
                    className="commentReply__container__content__header__user__name"
                    to="/"
                  >
                    {item?.User.Name}
                  </Link>
                  <div className="commentReply__container__content__header__user__time">
                    <span className="commentReply__container__content__header__user__time__icon">
                      •
                    </span>
                    <Tooltip
                      title={`Bình luận ngày ${moment(
                        moment(item.Datetime, "DD-MM-YYYY HH:mm:ss")
                      ).format("DD MMMM, HH:mm")}`}
                      placement="top"
                    >
                      <span className="commentReply__container__content__header__user__time__text">
                        {moment(
                          moment(item.Datetime, "DD-MM-YYYY HH:mm:ss")
                        ).format("DD MMMM")}
                      </span>
                    </Tooltip>
                    {/* {item?.timeEdit && (
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
                  )} */}
                  </div>
                </div>
                <div className="commentReply__container__content__header__more">
                  <Popover
                    placement="bottomRight"
                    content={() => (
                      <div className="popover_profile">
                        <div>
                          {item.User.Code === isUser ? (
                            <>
                              <span
                                className="comment__container__content__header__more__item"
                                onClick={handleEditCommentCo}
                              >
                                Chỉnh sửa bình luận
                              </span>
                              <span
                                className="comment__container__content__header__more__item"
                                onClick={handleDeleteComment}
                              >
                                Xóa bình luận
                              </span>
                            </>
                          ) : (
                            <span className="comment__container__content__header__more__item">
                              Báo cáo bình luận
                            </span>
                          )}
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
                {/* <Link className="commentReply__container__link">@{name}</Link>{" "} */}
                {item?.Content}
              </span>
            </div>
          )}
          {/* <div className="commentReply__container__content__control">
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
                  <span className={`text__comment`}>Trả lời</span>
                </div>
              </Tooltip>
            </div>
          </div> */}
          {/* {isOpenComment && ( */}
          {isUser && (
            <div
              style={{
                display: isOpenComment ? "block" : "none",
                marginTop: isEdit ? "0" : "10px",
              }}
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
                  onClick={isEdit ? handleSendCommentUpdate : handleSendComment}
                >
                  {isEdit
                    ? isSendingComment
                      ? "Đang gửi..."
                      : "Chỉnh sửa"
                    : isSendingComment
                    ? "Đang gửi..."
                    : "Bình luận"}
                </div>
                <div
                  className="commentReply__blog__container__main__comment__you__input__control__btnCancel"
                  onClick={handleCancelComment}
                >
                  Hủy
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CommentReply;
