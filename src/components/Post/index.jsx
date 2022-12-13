import React from "react";
import { Link } from "react-router-dom";
import "./index.scss";
import moment from "moment";
import { caculateDate } from "../../utils/Date";
import { ReactComponent as HeartIcon } from "../../assets/icons/heart.svg";
import { ReactComponent as CommentIcon } from "../../assets/icons/comment.svg";

function Post({ post }) {
  return (
    <div className="post">
      <div className="post_container">
        <div className="post_container_avatar">
          <Link to="/">
            <img
              className="post_container_avatar_img"
              src={post.User.Avatar}
              alt="avatar"
            />
          </Link>
          <div className="post_container_user">
            <Link className="post_container_user_name">{post.User.Name}</Link>
            <span className="post_container_user_date">
              {moment(post.TimePost).format("DD MMMM")}
              {" ("}
              {caculateDate(post.TimePost)}
              {")"}
            </span>
          </div>
        </div>
        <div className="post_container_content">
          <span className="post_container_content_title">{post.Title}</span>
          <Link className="post_container_content_cate">
            <span className="post_container_content_cate_link">
              #{post.CategoryName}
            </span>
          </Link>
          <div className="post_container_content_more">
            <span className="post_container_content_more_like">
              <HeartIcon /> {post.Like} lượt thích
            </span>
            <span className="post_container_content_more_comment">
              <CommentIcon /> {post.Comment} lượt bình luận
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post;
