import React from "react";
import Comment from "../Comment";
import "./index.scss";

function ListComment({ listComment }) {
  return (
    <div>
      {listComment.map((item, index) => (
        <Comment comment={item} key={index} index={index} />
      ))}
    </div>
  );
}

export default ListComment;
