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
  cateSelectedState,
  currentPageState,
  listBlogState,
  pageCountState,
  scrollPositionState,
  searchValueState,
} from "../../stores/blog";

function Home() {
  const [listBlog, setListBlog] = useRecoilState(listBlogState);
  const [pageCount, setPageCount] = useRecoilState(pageCountState);
  const [currentPage, setCurrentPage] = useRecoilState(currentPageState);
  const scrollPosition = useRecoilValue(scrollPositionState);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useRecoilState(searchValueState);
  const [cateSelected, setCateSelected] = useRecoilState(cateSelectedState);

  useEffect(() => {
    const handleGetBlog = async () => {
      setLoading(true);
      let dataTmp = [];
      for (let i = 1; i <= currentPage; i++) {
        const data = {
          Code: "",
          Title: searchValue,
          ConcernCategoryCode: "",
          Page: i,
          PageSize: BLOG.pageSizeDefault,
        };
        const res = await blogService.getBlog(data);
        if (res && res.StatusCode === 200) {
          if (res.Data?.Items.length > 0) {
            if (dataTmp.length === 0) {
              dataTmp = res.Data?.Items;
            } else {
              dataTmp = dataTmp.concat(res.Data?.Items);
            }
            setPageCount(res.Data?.TotalPagesCount);
          }
        }
      }
      setListBlog(dataTmp);
      setLoading(false);
      const scroll = new Promise((resolve) => {
        setTimeout(() => {
          window.scrollTo({
            top: scrollPosition,
            left: 0,
            behavior: "instant",
          });
          resolve();
        }, 0);
      });
      await scroll;
    };
    handleGetBlog();
    // eslint-disable-next-line
  }, []);

  const handleLoadMore = async () => {
    const data = {
      Code: "",
      Title: searchValue,
      ConcernCategoryCode: cateSelected.Code,
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
    <>
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
    </>
  );
}

export default Home;
