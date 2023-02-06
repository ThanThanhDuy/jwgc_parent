import React, { useEffect } from "react";
import "./index.scss";
import { Link } from "react-router-dom";
import family from "../../assets/images/family.jpg";

function Rank() {
  useEffect(() => {
    document
      .getElementsByClassName("rank__container__tab__item")[0]
      .classList.add("rank__container__tab__item__active");
    const tabs = document.getElementsByClassName("rank__container__tab__item");
    for (let i = 0; i < tabs.length; i++) {
      tabs[i].addEventListener("click", function () {
        for (let j = 0; j < tabs.length; j++) {
          tabs[j].classList.remove("rank__container__tab__item__active");
        }
        this.classList.add("rank__container__tab__item__active");
      });
    }
  }, []);

  const data = [
    {
      Code: "1",
      Name: "Sữa Aptamil Essensis có tăng cân không?",
    },
    {
      Code: "2",
      Name: "Pediakid là thuốc gì? Có nên cho bé sử dụng hay không?",
    },
    {
      Code: "3",
      Name: "4 cách phân biệt bình moyuum thật giả chỉ trong 1 phút",
    },
    {
      Code: "4",
      Name: "Đối mặt với Khủng hoảng tuổi lên 2 của con, mẹ phải làm sao?",
    },
    {
      Code: "5",
      Name: "Những sai lầm khi sử dụng men vi sinh cho bé sơ sinh",
    },
  ];

  return (
    <div className="rank__container">
      <div className="rank__container__cover">
        <img src={family} alt="family" />
      </div>
      <div className="rank__container__title">
        <span>Xếp hạng</span>
      </div>
      <div className="rank__container__tab">
        <div className="rank__container__tab__item">
          <span>Tất cả</span>
        </div>
        <div className="rank__container__tab__item">
          <span>Năm</span>
        </div>
        <div className="rank__container__tab__item">
          <span>Tháng</span>
        </div>
        <div className="rank__container__tab__item">
          <span>Tuần</span>
        </div>
      </div>
      <div className="rank__container__list">
        {data.map((item, index) => {
          return (
            <Link className="rank__container__list__item" key={index} to="#">
              <span>{item.Name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default Rank;
