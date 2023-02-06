import React, { useState, useEffect } from "react";
import "./index.scss";
import { Link } from "react-router-dom";
import moment from "moment";
import Tooltip from "@mui/material/Tooltip";
import { ReactComponent as More } from "../../assets/icons/more.svg";
import { notification, Popover } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment as faCommentRegular } from "@fortawesome/free-regular-svg-icons";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import CommentReply from "../CommentReply";
import userService from "../../services/user";
import blogService from "../../services/blog";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { Modal } from "antd";
import { useSetRecoilState } from "recoil";
import { isOpenModalRequireAuthState } from "../../stores/auth";
const { confirm } = Modal;

function Comment({
  comment,
  index,
  handleSendReplyComment,
  codeBlog,
  handleEditComment,
  handleEditReplyComment,
  handleDeleteComment,
  handleDeleteCommentReply,
  handleLoadMoreSubComment,
}) {
  const [commentValue, setCommentValue] = useState("");
  const [isSendingComment, setIsSendingComment] = useState(false);
  const [isOpenComment, setIsOpenComment] = useState(false);
  const [error, setError] = useState([]);
  const [isUser, setIsUser] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [currentPageComment, setCurrentPageComment] = useState(0);
  const setIsOpenModalRequireAuth = useSetRecoilState(
    isOpenModalRequireAuthState
  );

  useEffect(() => {
    const handleGetProfile = async () => {
      const res = await userService.getProfile();
      if (res && res.StatusCode === 200) {
        setIsUser(res.Data.Code, currentPageComment + 1);
        setCurrentPageComment(currentPageComment + 1);
      }
    };
    handleGetProfile();
  }, []);

  const handleSendComment = async () => {
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
    const res = await blogService.sendComment(
      commentValue.trim(),
      codeBlog,
      comment.Code
    );
    if (res && res.StatusCode === 200) {
      handleSendReplyComment(res, comment.Code);
      setCommentValue("");
    } else {
      setError([res.Message]);
    }
    setIsSendingComment(false);
    setIsOpenComment(false);
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
    const res = await blogService.updateComment(
      comment.Code,
      commentValue.trim()
    );
    if (res && res.StatusCode === 200) {
      handleEditComment(commentValue.trim(), comment.Code);
      setCommentValue("");
    } else {
      setError([res.Message]);
    }
    setIsSendingComment(false);
    setIsOpenComment(false);
    setIsEdit(false);
  };

  const handleDeleteComentCo = async () => {
    confirm({
      title: "Bạn có chắc chắn muốn xóa bình luận này không?",
      icon: <ExclamationCircleFilled />,
      content: "Bình luận sẽ bị xóa vĩnh viễn",
      async onOk() {
        const res = await blogService.deleteComment(comment.Code);
        if (res && res.StatusCode === 200) {
          handleDeleteComment(comment.Code);
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
    setCommentValue(comment.Content);
  };

  const handleCancelComment = () => {
    setIsEdit(false);
    setCommentValue("");
    setError([]);
    const el = document.querySelectorAll(
      ".comment__blog__container__main__comment__you__input__text"
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
        ".comment__blog__container__main__comment__you__input__text"
      );
      el[index * 2].style.paddingTop = 8 + "px";
    }
  };

  const handleOpenComment = () => {
    if (isUser) {
      setIsOpenComment(true);
      const el = document.querySelectorAll(
        ".comment__blog__container__main__comment__you__input__text"
      );
      setTimeout(() => {
        el[index * 2].focus();
      }, 0);
    } else {
      setIsOpenModalRequireAuth(true);
    }
  };

  const handleLoadMoreSub = () => {
    handleLoadMoreSubComment(comment.Code);
  };

  const handleReportComment = async () => {
    const res = await blogService.reportComment(comment.Code);
    if (res && res.StatusCode === 200) {
      notification.success({
        message: "Yêu cầu của bạn đã được gửi đi",
        description: "Chúng tôi sẽ xem xét và xử lý trong thời gian sớm nhất",
      });
    } else {
      notification.error({
        message: "Yêu cầu của bạn không thành công",
        description: "Vui lòng thử lại sau",
      });
    }
  };

  return (
    <div>
      <div className="comment__container">
        <div className="comment__container__avatar">
          <Link to="/">
            <img src={comment.User?.AvatarPath} alt="" />
          </Link>
        </div>
        <div className="comment__container__content">
          {!isEdit && (
            <div className="comment__container__content__box">
              <div className="comment__container__content__header">
                <div className="comment__container__content__header__user">
                  <Link
                    className="comment__container__content__header__user__name"
                    to="/"
                  >
                    {comment.User?.Name}
                  </Link>
                  <div className="comment__container__content__header__user__time">
                    <span className="comment__container__content__header__user__time__icon">
                      •
                    </span>
                    <Tooltip
                      title={`Bình luận ngày ${moment(
                        moment(comment.Datetime, "DD-MM-YYYY HH:mm:ss")
                      ).format("DD MMMM, HH:mm")}`}
                      placement="top"
                    >
                      <span className="comment__container__content__header__user__time__text">
                        {moment(
                          moment(comment.Datetime, "DD-MM-YYYY HH:mm:ss")
                        ).format("DD MMMM")}
                      </span>
                    </Tooltip>
                  </div>
                </div>
                <div className="comment__container__content__header__more">
                  <Popover
                    placement="bottomRight"
                    content={() => (
                      <div className="popover_profile">
                        <div>
                          {comment.User.Code === isUser ? (
                            <>
                              <span
                                className="comment__container__content__header__more__item"
                                onClick={handleEditCommentCo}
                              >
                                Chỉnh sửa bình luận
                              </span>
                              <span
                                className="comment__container__content__header__more__item"
                                onClick={handleDeleteComentCo}
                              >
                                Xóa bình luận
                              </span>
                            </>
                          ) : (
                            <span
                              className="comment__container__content__header__more__item"
                              onClick={handleReportComment}
                            >
                              Báo cáo bình luận
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    trigger="click"
                  >
                    <More className="comment__container__content__header__more__icon" />
                  </Popover>
                </div>
              </div>
              <span>{comment.Content}</span>
            </div>
          )}
          {!isOpenComment && (
            <div className="comment__container__content__control">
              <div>
                <Tooltip title="Bình luận" placement="top">
                  <div
                    className="comment__container__content__control__comment__box"
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
            </div>
          )}

          {isUser && (
            <div
              style={{
                display: isOpenComment ? "block" : "none",
                marginTop: isEdit ? "0" : "10px",
              }}
              className="comment__blog__container__main__comment__you__input"
            >
              {/* {error.length > 0 && ( */}
              <div
                style={{ display: error.length > 0 ? "block" : "none" }}
                className="comment__blog__container__main__comment__you__input__error"
              >
                <div className="comment__blog__container__main__comment__you__input__error__title">
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
                className="comment__blog__container__main__comment__you__input__text"
                value={commentValue}
                onChange={(e) => handleChangeComment(e.target.value)}
              />
              <div className="comment__blog__container__main__comment__you__input__control">
                <div
                  className="comment__blog__container__main__comment__you__input__control__btnSend"
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
                  className="comment__blog__container__main__comment__you__input__control__btnCancel"
                  onClick={handleCancelComment}
                >
                  Hủy
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {comment?.ChildBlogComments?.length > 0 &&
        comment.ChildBlogComments?.map((item, index) => (
          <CommentReply
            item={item}
            key={index}
            index={index}
            codeBlog={codeBlog}
            name={comment.User.Name}
            isUser={isUser}
            parentCode={comment.Code}
            handleEditReplyComment={handleEditReplyComment}
            handleDeleteCommentReply={handleDeleteCommentReply}
          />
        ))}
      {comment.TotalChild > 0 &&
        comment?.ChildBlogComments?.length < comment.TotalChild && (
          <div
            onClick={handleLoadMoreSub}
            className="comment__blog__container__main__comment__loadmore"
          >
            Xem thêm
          </div>
        )}
    </div>
  );
}

export default Comment;
