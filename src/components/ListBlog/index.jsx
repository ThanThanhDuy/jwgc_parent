import React from "react";
import Post from "../Post";
import "./index.scss";

const data = [
  {
    Code: "1",
    Title:
      "Bình sữa bằng nhựa có tốt không? Các loại bình sữa bằng nhựa tốt nhất cho bé",
    Category: "1",
    CategoryName: "Chăm sóc bữa ăn cho bé",
    Like: 103,
    Comment: 10,
    Dislike: 12,
    TimePost: "2022-12-10T12:42:00",
    User: {
      Name: "Nguyễn Thị Thanh Như",
      Avatar: "https://i.pravatar.cc/150?img=1",
      bio: "Mẹ của 2 con gái",
      joinDate: "2020-10-08T03:37:00",
    },
  },
  {
    Code: "2",
    Title: "Chăm sóc cho bé trong mùa Đông",
    Category: "6",
    CategoryName: "Tip, mẹo vặt",
    Like: 51,
    Comment: 3,
    Dislike: 2,
    TimePost: "2022-12-12T13:00:00",
    User: {
      Name: "Nguyễn Vũ Thanh Tùng",
      Avatar: "https://i.pravatar.cc/150?img=2",
      bio: "Bỗ của những đứa trẻ",
      joinDate: "2020-10-08T03:37:00",
    },
  },
];

// eslint-disable-next-line
const cate = [
  {
    Label: "Trang chủ",
    Code: "1",
  },
  {
    label: "Cho bé ăn",
    code: "2",
  },
  {
    label: "Cho bé ngủ",
    code: "3",
  },
  {
    Label: "Vui chơi cùng bé",
    Code: "4",
  },
  {
    Label: "Học tập cùng bé",
    Code: "5",
  },
  {
    Label: "Tip, mẹo vặt",
    Code: "6",
  },
];

function ListBlog() {
  return (
    <div className="listblog__container">
      {data.map((item, index) => {
        return <Post post={item} key={item.Code} />;
      })}
    </div>
  );
}

export default ListBlog;
