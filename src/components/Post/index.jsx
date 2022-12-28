import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./index.scss";
import moment from "moment";
import { caculateDate } from "../../utils/Date";
import { ReactComponent as HeartIcon } from "../../assets/icons/heart.svg";
import { ReactComponent as CommentIcon } from "../../assets/icons/comment.svg";
import { useSetRecoilState } from "recoil";
import { scrollPositionState } from "../../stores/blog";
import { scrollPositionProfileState } from "../../stores/profile";

function Post({ post }) {
  const navigate = useNavigate();
  const setScrollPosition = useSetRecoilState(scrollPositionState);
  const setScrollPositionProfile = useSetRecoilState(
    scrollPositionProfileState
  );
  const location = useLocation();

  const handleClickPost = () => {
    if (location?.pathname.includes("home")) {
      setScrollPosition(window.pageYOffset);
    } else {
      setScrollPositionProfile(window.pageYOffset);
    }
    navigate(
      `/blog/${encodeURIComponent(post.User.Name)?.replaceAll(
        "%20",
        "-"
      )}/${encodeURIComponent(post.Title)?.replaceAll("%20", "-")}/${post.Code}`
    );
  };

  return (
    <div className="post">
      <div className="post_container">
        <div className="post_container_avatar">
          <Link to={`${post.User.Username}`}>
            <img
              className="post_container_avatar_img"
              src={post?.User?.AvatarPath}
              alt="avatar"
            />
          </Link>
          <div className="post_container_user">
            <Link
              to={`${post.User.Username}`}
              className="post_container_user_name"
            >
              {post.User.Name}
            </Link>
            <span
              className="post_container_user_date"
              onClick={handleClickPost}
            >
              {moment(moment(post.Datetime, "DD-MM-YYYY HH:mm:ss")).format(
                "DD MMMM"
              )}
              {" ("}
              {caculateDate(moment(post.Datetime, "DD-MM-YYYY HH:mm:ss"))}
              {")"}
            </span>
          </div>
        </div>
        <div onClick={handleClickPost} className="post_container_content">
          <span className="post_container_content_title">{post.Title}</span>
          <Link className="post_container_content_cate">
            <span className="post_container_content_cate_link">
              #{post?.ConcernCategory?.Name}
            </span>
          </Link>
          <div className="post_container_content_more">
            <span className="post_container_content_more_like">
              <HeartIcon />{" "}
              {post?.BlogReactions.TotalLike + post?.BlogReactions.TotalDislike}{" "}
              lượt tương tác
            </span>
            <span className="post_container_content_more_comment">
              <CommentIcon />{" "}
              {post?.BlogComments
                ? post?.BlogComments.length
                : post?.TotalBlogComment}{" "}
              lượt bình luận
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post;
