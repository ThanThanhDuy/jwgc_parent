import React, { useEffect } from "react";
import TabItem from "../TabItem";
import "./index.scss";
import dairy from "../../assets/icons/dairy.png";
import clock from "../../assets/icons/clock.png";
import children from "../../assets/icons/children.png";
import about from "../../assets/icons/about.png";
import contact from "../../assets/icons/contact.png";
import term from "../../assets/icons/term.png";
import { CATE_ICON } from "../../assets/icons/cateIcon";
import cateBlogService from "../../services/cateBlog";
import { useRecoilState } from "recoil";
import { cateDataState } from "../../stores/cate";
import hashtag from "../../assets/icons/hashtag.png";
import {
  cateSelectedState,
  currentPageState,
  listBlogState,
  pageCountState,
  searchValueState,
} from "../../stores/blog";
import blogService from "../../services/blog";
import { BLOG } from "../../constants/blog";

function Sidebar() {
  const data_jwgc = [
    {
      Icon: children,
      label: "Chăm sóc trẻ",
      code: "1",
      link: "/children-care",
    },
    {
      Icon: dairy,
      label: "Dòng thời gian",
      code: "2",
      link: "/history",
    },
    {
      Icon: clock,
      label: "Nhắc nhở",
      code: "3",
      link: "/reminder",
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

  const [dataCate, setDataCate] = useRecoilState(cateDataState);
  const [cateSelected, setCatesSelected] = useRecoilState(cateSelectedState);
  const [listBlog, setListBlog] = useRecoilState(listBlogState);
  const [pageCount, setPageCount] = useRecoilState(pageCountState);
  const [currentPage, setCurrentPage] = useRecoilState(currentPageState);
  const [searchValue, setSearchValue] = useRecoilState(searchValueState);

  useEffect(() => {
    if (dataCate.length === 0) {
      const handleGetCateBlog = async () => {
        const res = await cateBlogService.getCateBlog();
        if (res && res.StatusCode === 200) {
          let data = res?.Data.map((item) => {
            return {
              Id: item.Id,
              Label: item.Name,
              Code: item.Code,
              Icon: CATE_ICON[item.Name] ? CATE_ICON[item.Name] : hashtag,
            };
          });
          data.unshift({
            Id: -1,
            Label: "Trang chủ",
            Code: "-1",
            Icon: CATE_ICON["Trang chủ"],
          });
          setDataCate(data);
        }
      };
      handleGetCateBlog();
    }
    // eslint-disable-next-line
  }, []);

  const handleItem = async (item, index) => {
    setCatesSelected(item);
    const data = {
      Code: "",
      Title: searchValue,
      ConcernCategoryCode: item.Code === "-1" ? "" : item.Code,
      Page: 1,
      PageSize: BLOG.pageSizeDefault,
    };
    const res = await blogService.getBlog(data);
    if (res && res.StatusCode === 200) {
      setListBlog(res.Data?.Items);
      setPageCount(res.Data?.TotalPagesCount);
      if (currentPage < res.Data?.TotalPagesCount) {
        setCurrentPage(1);
      }
    }
  };

  return (
    <div>
      <p className="sidebar_titleGroup">Blog</p>
      {dataCate.map((item, index) => {
        return (
          <div key={item.Code} onClick={() => handleItem(item, index)}>
            <TabItem
              key={item.Code}
              Icon={item.Icon}
              label={item.Label}
              active={item.Code === cateSelected.Code}
              div={true}
            />
          </div>
        );
      })}
      <p className="sidebar_titleGroup" style={{ marginTop: "30px" }}>
        Đồng hành cùng bé
      </p>
      {data_jwgc.map((item, index) => {
        return (
          <TabItem
            key={item.code}
            Icon={item.Icon}
            label={item.label}
            link={item.link}
          />
        );
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
