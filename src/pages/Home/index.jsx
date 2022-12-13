import React from "react";
import Sidebar from "../../components/Sidebar";
import "./index.scss";
import ListPost from "../../components/ListBlog";
import Rank from "../../components/Rank";

function Home() {
  return (
    <div className="home__container">
      <Sidebar />
      <ListPost />
      <Rank />
    </div>
  );
}

export default Home;
