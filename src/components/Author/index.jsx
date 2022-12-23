import React from "react";
import "./index.scss";
import { Link } from "react-router-dom";
import moment from "moment";

function Author() {
  return (
    <div className="author__container">
      <div className="author__container__header">
        <Link>
          <img
            className="author__container__header__avatar"
            src="https://picsum.photos/200/300"
            alt="author"
          />
        </Link>
        <div className="author__container__header__name">
          <Link>Nguyễn Thị Thanh Như</Link>
        </div>
      </div>
      <div className="author__container__follow">
        <div className="author__container__follow__btn">
          <span>Theo dõi</span>
        </div>
      </div>
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
