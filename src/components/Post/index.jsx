import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./index.scss";
import moment from "moment";
import { caculateDate } from "../../utils/Date";
import { ReactComponent as HeartIcon } from "../../assets/icons/heart.svg";
import { ReactComponent as CommentIcon } from "../../assets/icons/comment.svg";
import { useSetRecoilState } from "recoil";
import { scrollPositionState } from "../../stores/blog";
import {
  currentPageProfileState,
  scrollPositionProfileState,
} from "../../stores/profile";

function Post({ post }) {
  const navigate = useNavigate();
  const setScrollPosition = useSetRecoilState(scrollPositionState);
  const setScrollPositionProfile = useSetRecoilState(
    scrollPositionProfileState
  );
  const location = useLocation();
  const setCurrentPageProfile = useSetRecoilState(currentPageProfileState);

  const handleClickPost = () => {
    if (location?.pathname.includes("home")) {
      setScrollPosition(window.pageYOffset);
    } else {
      setScrollPositionProfile(window.pageYOffset);
    }
    if (post.Status === 1) {
      navigate(
        `/blog/${encodeURIComponent(post.User.Name)?.replaceAll(
          "%20",
          "-"
        )}/${encodeURIComponent(post.Title)?.replaceAll("%20", "-")}/${
          post.Code
        }`
      );
    } else {
      navigate(
        `/pending/${encodeURIComponent(post.Title)?.replaceAll("%20", "-")}/${
          post.Code
        }`
      );
    }
  };

  const handleProfile = () => {
    setCurrentPageProfile(1);
    setScrollPositionProfile(0);
    navigate(`/profile/${post.User?.UserName}`);
  };

  return (
    <div className="post">
      <div className="post_container">
        <div className="post_container_avatar">
          <span onClick={handleProfile}>
            <img
              className="post_container_avatar_img"
              src={post?.User?.AvatarPath}
              alt="avatar"
            />
          </span>
          <div className="post_container_user">
            <span className="post_container_user_name" onClick={handleProfile}>
              {post.User.Name}
            </span>
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
