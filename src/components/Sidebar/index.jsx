import React from "react";
import TabItem from "../TabItem";
import "./index.scss";
import babysleep from "../../assets/icons/babysleep.png";
import babyeat from "../../assets/icons/babyeat.png";
import babyplay from "../../assets/icons/babyplay.png";
import babylearn from "../../assets/icons/babylearn.png";
import tip from "../../assets/icons/tip.png";
import home from "../../assets/icons/house.png";
import dairy from "../../assets/icons/dairy.png";
import clock from "../../assets/icons/clock.png";
import about from "../../assets/icons/about.png";
import contact from "../../assets/icons/contact.png";
import term from "../../assets/icons/term.png";

function Sidebar() {
  const data = [
    {
      Icon: home,
      label: "Trang chủ",
      code: "1",
    },
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

  const data_jwgc = [
    {
      Icon: dairy,
      label: "Nhật ký",
      code: "1",
    },
    {
      Icon: clock,
      label: "Hẹn giờ",
      code: "2",
    },
  ];

  const other = [
    {
      Icon: about,
      label: "Về chúng tôi",
      code: "1",
    },
    {
      Icon: contact,
      label: "Liên hệ",
      code: "2",
    },
    {
      Icon: term,
      label: "Điều khoản sử dụng",
      code: "3",
    },
  ];

  return (
    <div>
      <p className="sidebar_titleGroup">Blog</p>
      {data.map((item, index) => {
        return <TabItem key={item.code} Icon={item.Icon} label={item.label} />;
      })}
      <p className="sidebar_titleGroup" style={{ marginTop: "30px" }}>
        Đồng hành cùng bé
      </p>
      {data_jwgc.map((item, index) => {
        return <TabItem key={item.code} Icon={item.Icon} label={item.label} />;
      })}
      <p className="sidebar_titleGroup" style={{ marginTop: "30px" }}>
        Khác
      </p>
      {other.map((item, index) => {
        return <TabItem key={item.code} Icon={item.Icon} label={item.label} />;
      })}
    </div>
  );
}

export default Sidebar;
