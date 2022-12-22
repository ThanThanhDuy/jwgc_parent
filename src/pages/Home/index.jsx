import React from "react";
import Sidebar from "../../components/Sidebar";
import "./index.scss";
import ListPost from "../../components/ListBlog";
import Rank from "../../components/Rank";
import { Helmet } from "react-helmet";

function Home() {
  return (
    <div className="home__container">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Trang chủ</title>
      </Helmet>
      <Sidebar />
      <ListPost />
      <Rank />
    </div>
  );
}

export default Home;
