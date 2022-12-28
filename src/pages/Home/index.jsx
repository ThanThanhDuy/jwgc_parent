import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import "./index.scss";
import ListPost from "../../components/ListBlog";
import Rank from "../../components/Rank";
import { Helmet } from "react-helmet";
import blogService from "../../services/blog";
import { BLOG } from "../../constants/blog";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  listBlogState,
  pageCountState,
  currentPageState,
  scrollPositionState,
} from "../../stores/blog";

function Home() {
  const [listBlog, setListBlog] = useRecoilState(listBlogState);
  const [pageCount, setPageCount] = useRecoilState(pageCountState);
  const [currentPage, setCurrentPage] = useRecoilState(currentPageState);
  const scrollPosition = useRecoilValue(scrollPositionState);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (listBlog.length === 0) {
      const handleGetBlog = async () => {
        setLoading(true);
        const data = {
          Code: "",
          Title: "",
          ConcernCategoryCode: "",
          Page: BLOG.pageDefault,
          PageSize: BLOG.pageSizeDefault,
        };
        const res = await blogService.getBlog(data);
        if (res && res.StatusCode === 200) {
          setListBlog(res.Data?.Items);
          setPageCount(res.Data?.TotalPagesCount);
        }
        setLoading(false);
      };
      handleGetBlog();
    } else {
      window.scrollTo({
        top: scrollPosition,
        left: 0,
        behavior: "instant",
      });
    }
    // eslint-disable-next-line
  }, []);

  const handleLoadMore = async () => {
    const data = {
      Code: "",
      Title: "",
      ConcernCategoryCode: "",
      Page: currentPage + 1,
      PageSize: BLOG.pageSizeDefault,
    };
    const res = await blogService.getBlog(data);
    if (res && res.StatusCode === 200) {
      setListBlog(listBlog.concat(res.Data?.Items));
      setPageCount(res.Data?.TotalPagesCount);

      if (currentPage < res.Data?.TotalPagesCount) {
        setCurrentPage(currentPage + 1);
      }
    }
  };

  return (
    <div className="home__container">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Trang chủ</title>
      </Helmet>
      <Sidebar />
      <ListPost
        listBlog={listBlog}
        pageCount={pageCount}
        currentPage={currentPage}
        handleLoadMore={handleLoadMore}
        loading={loading}
      />
      <Rank />
    </div>
  );
}

export default Home;
