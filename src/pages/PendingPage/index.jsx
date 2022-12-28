import React, { useEffect, useState } from "react";
import "./index.scss";
import DisplayBlog from "../../components/DisplayBlog";
import Author from "../../components/Author";
import { Link } from "react-router-dom";
import { BLOG, STATUS_BLOG, STATUS_BLOG_DETAIL } from "../../constants/blog";
import { useParams } from "react-router-dom";
import blogService from "../../services/blog";
import { CATE_ICON } from "../../assets/icons/cateIcon";
import { Helmet } from "react-helmet";

const dataAuthor = [
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

function PendingPage() {
  const [cateBlog, setCateBlog] = useState(0);
  const [blog, setBlog] = useState({});
  const [userAuthor, setUserAuthor] = useState({});
  const [loading, setLoading] = useState(false);
  const params = useParams();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
    const handleGetBlog = async () => {
      setLoading(true);
      const data = {
        Code: params.codeBlog,
        Title: "",
        Status: "",
        ConcernCategoryCode: "",
        Page: BLOG.pageDefault,
        PageSize: 1,
      };
      const res = await blogService.getMyBlog(data);
      if (res && res.StatusCode === 200) {
        console.log(res);
        setTimeout(() => {
          setBlog(res.Data?.Items[0]);
          setCateBlog({
            Id: res.Data?.Items[0]?.ConcernCategory.Id,
            Label: res.Data?.Items[0]?.ConcernCategory.Name,
            Icon: CATE_ICON[res.Data?.Items[0]?.ConcernCategory.Name],
          });
          setUserAuthor(res.Data?.Items[0]?.User);
          setLoading(false);
        }, 500);
      } else {
        setLoading(false);
      }
    };
    handleGetBlog();
  }, [params.codeBlog]);

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>
          {decodeURIComponent(params.titleBlog?.replaceAll("-", "%20"))}
        </title>
      </Helmet>
      <div className="blog__container">
        <div style={{ minWidth: "58.91px", maxWidth: "58.91px" }}></div>
        <div>
          {blog && (
            <div
              className={`blog__container__noti ${
                STATUS_BLOG_DETAIL[blog.Status].classBackground
              }`}
            >
              <div
                className={`blog__container__noti__title ${
                  STATUS_BLOG_DETAIL[blog.Status].classTitle
                }`}
              >
                <span>{STATUS_BLOG_DETAIL[blog.Status].title}</span>
              </div>
              <div className="blog__container__noti__des">
                <ul>
                  <li>{STATUS_BLOG_DETAIL[blog.Status].des}</li>
                </ul>
              </div>
            </div>
          )}
          <div className="blog__container__main">
            <div className="blog__container__main__content">
              <DisplayBlog
                titleBlog={blog?.Title}
                cateBlog={cateBlog}
                contentBlog={blog?.Content}
                loading={loading}
              />
            </div>
          </div>
        </div>

        <div className="blog__container__author">
          <Author user={userAuthor} />
          <div className="blog__author">
            <div className="blog__author__header">
              <p>Bài viết khác của</p>
              <Link>{userAuthor.Name}</Link>
            </div>
            <div className="rank__container__list">
              {dataAuthor.map((item, index) => {
                return (
                  <Link className="rank__container__list__item" key={index}>
                    <span>{item.Name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PendingPage;
