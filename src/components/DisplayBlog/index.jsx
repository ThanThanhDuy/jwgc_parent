import React, { useEffect, useState } from "react";
import "./index.scss";
import babysleep from "../../assets/icons/babysleep.png";
import babyeat from "../../assets/icons/babyeat.png";
import babyplay from "../../assets/icons/babyplay.png";
import babylearn from "../../assets/icons/babylearn.png";
import tip from "../../assets/icons/tip.png";
import { Markup } from "interweave";

const data = [
  {
    Icon: babyeat,
    label: "Chăm sóc bữa ăn cho bé",
    code: "2",
  },
  {
    Icon: babysleep,
    label: "Chăm sóc giấc ngủ cho bé",
    code: "3",
  },
  {
    Icon: babyplay,
    label: "Vui chơi cùng bé",
    code: "4",
  },
  {
    Icon: babylearn,
    label: "Học tập cùng bé",
    code: "5",
  },
  {
    Icon: tip,
    label: "Tip, mẹo vặt",
    code: "6",
  },
];
function DisplayBlog({ titleBlog, cateBlog, contentBlog }) {
  const [cate, setCate] = useState(null);

  useEffect(() => {
    const cate = data.find((item) => Number(item.code) === cateBlog);
    if (cate) setCate(cate);
  }, [cateBlog]);

  return (
    <div className="displayBlog__container">
      <div className="displayBlog__container__title">
        <span>{titleBlog}</span>
      </div>
      <div className="displayBlog__container__cate">
        {titleBlog || contentBlog ? (
          <div className="displayBlog__container__cate__button">
            <img src={cate?.Icon} alt="" />
            <span>{cate?.label}</span>
          </div>
        ) : null}
      </div>
      <div className="displayBlog__container__content">
        <div className="ck-content">
          <Markup content={contentBlog} />
        </div>
      </div>
    </div>
  );
}

export default DisplayBlog;
