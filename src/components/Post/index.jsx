import React, { useState, useEffect } from "react";
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
import { STATUS_BLOG_DETAIL } from "../../constants/blog";

function Post({ post }) {
  const navigate = useNavigate();
  const setScrollPosition = useSetRecoilState(scrollPositionState);
  const setScrollPositionProfile = useSetRecoilState(
    scrollPositionProfileState
  );
  const location = useLocation();
  const setCurrentPageProfile = useSetRecoilState(currentPageProfileState);
  const [countComment, setCountComment] = useState(0);

  useEffect(() => {
    setCountComment(
      post?.BlogComments?.TotalChild
        ? post?.BlogComments?.TotalChild
        : post?.TotalBlogComment
    );
    // eslint-disable-next-line
  }, []);

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
        }/${encodeURIComponent(post.User.UserName)?.replaceAll("%20", "-")}`
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
      {(post?.Status === 2 || post?.Status === 3) && (
        <div
          className={`post__container__noti ${
            STATUS_BLOG_DETAIL[post.Status].classBackground
          }`}
        >
          <div
            className={`post__container__noti__title ${
              STATUS_BLOG_DETAIL[post.Status].classTitle
            }`}
          >
            <span>{STATUS_BLOG_DETAIL[post.Status].title}</span>
          </div>
        </div>
      )}
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
              <CommentIcon /> {countComment} lượt bình luận
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post;
