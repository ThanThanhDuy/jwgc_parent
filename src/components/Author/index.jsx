import React from "react";
import "./index.scss";
import { Link } from "react-router-dom";
import moment from "moment";
import userAvatar from "../../assets/icons/user.png";
import localService from "../../services/local";

function Author({ user }) {
  return (
    <div className="author__container">
      <div className="author__container__header">
        <Link>
          <img
            className="author__container__header__avatar"
            src={user?.AvatarPath ? user?.AvatarPath : userAvatar}
            alt="author"
          />
        </Link>
        <div className="author__container__header__name">
          <Link>{user.Name}</Link>
        </div>
      </div>
      {user.Code && user.Code !== localService.getUser()?.Code && (
        <div className="author__container__follow">
          <div className="author__container__follow__btn">
            <span>Theo dõi</span>
          </div>
        </div>
      )}
      <div className="author__container__infor">
        <div className="author__container__infor__item">
          <p className="author__container__infor__item__title">Ngày tham gia</p>
          <p className="author__container__infor__item__content">
            {`Ngày ${moment().format("DD")} tháng ${moment().format(
              "MM"
            )} năm ${moment().format("YYYY")}`}
          </p>
        </div>
        <div className="author__container__infor__item">
          <p className="author__container__infor__item__title">Số bài viết</p>
          <p className="author__container__infor__item__content">23 bài viết</p>
        </div>
      </div>
    </div>
  );
}

export default Author;
