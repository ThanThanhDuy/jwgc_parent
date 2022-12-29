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
        />
      ))}
    </div>
  );
}

export default ListComment;
