import React from "react";
import Comment from "../Comment";
import "./index.scss";

function ListComment({
  listComment,
  handleSendReplyComment,
  codeBlog,
  handleEditComment,
  handleEditReplyComment,
  handleDeleteComment,
  handleDeleteCommentReply,
  handleLoadMoreSubComment,
}) {
  return (
    <div>
      {listComment.map((item, index) => (
        <Comment
          comment={item}
          key={index}
          index={index}
          handleSendReplyComment={handleSendReplyComment}
          codeBlog={codeBlog}
          handleEditComment={handleEditComment}
          handleEditReplyComment={handleEditReplyComment}
          handleDeleteComment={handleDeleteComment}
          handleDeleteCommentReply={handleDeleteCommentReply}
          handleLoadMoreSubComment={handleLoadMoreSubComment}
        />
      ))}
    </div>
  );
}

export default ListComment;
