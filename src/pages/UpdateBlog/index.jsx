import React, { useState, useLayoutEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import EditorBlog from "../../components/Editor";
import { isEditState } from "../../stores/editor";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import "./index.scss";
import localService from "../../services/local";
import CateSelect from "../../components/CateSelect";
import DisplayBlog from "../../components/DisplayBlog";
import {
  titleBlogState,
  contentBlogState,
  cateBlogState,
  cateDisplayState,
} from "../../stores/blog";
import cateBlogService from "../../services/cateBlog";
import { CATE_ICON } from "../../assets/icons/cateIcon";
import blogService from "../../services/blog";
import { notification } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { BLOG } from "../../constants/blog";

function UpdateBlog() {
  const isEdit = useRecoilValue(isEditState);
  const [title, setTitle] = useRecoilState(titleBlogState);
  const [data, setData] = useRecoilState(contentBlogState);
  const [errors, setErrors] = useState([]);
  const [cate, setCate] = useRecoilState(cateBlogState);
  const [cateDisplay, setCateDisplay] = useRecoilState(cateDisplayState);
  const [dataCate, setDataCate] = useState([]);
  const [haveData, setHaveData] = useState(true);
  const navigate = useNavigate();
  const params = useParams();

  useLayoutEffect(() => {
    const handleGetCateBlog = async () => {
      const res = await cateBlogService.getCateBlog();
      if (res && res.StatusCode === 200) {
        setDataCate(
          res?.Data.map((item) => {
            return {
              Id: item.Id,
              Label: item.Name,
              Code: item.Code,
              Icon: CATE_ICON[item.Name],
            };
          })
        );
      }
    };
    handleGetCateBlog();
    const getMyBlogByCode = async () => {
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
        if (res.Data.Items.length > 0) {
          setTitle(res.Data.Items[0].Title);
          setData(res.Data.Items[0].Content);
          setCate(res.Data.Items[0].ConcernCategory.Id);
          setCateDisplay({
            Id: res.Data?.Items[0]?.ConcernCategory.Id,
            Label: res.Data?.Items[0]?.ConcernCategory.Name,
            Icon: CATE_ICON[res.Data?.Items[0]?.ConcernCategory.Name],
          });
        } else {
          setHaveData(false);
        }
      }
    };
    getMyBlogByCode();

    // eslint-disable-next-line
  }, []);

  function handleTitle(element) {
    if (errors.length > 0) {
      setErrors([]);
    }
    setTitle(element.value);
  }

  const onChangeEditor = ({ data }) => {
    if (errors.length > 0) {
      setErrors([]);
    }
    setData(data);
  };

  const handleChangeCate = (value) => {
    setCate(value);
    const item = dataCate.find((item) => item.Id === value);
    setCateDisplay({
      Id: item.Id,
      Label: item.Label,
      Icon: CATE_ICON[item.Label],
    });
  };

  const handleSaveBlog = async () => {
    let error = [];
    if (title === "") {
      error.push("Tiêu đề: không được để trống");
    }
    if (data === "") {
      error.push("Nội dung: không được để trống");
    }
    if (error.length > 0) {
      setErrors(error);
    } else {
      const { Code } = dataCate.find((item) => item.Id === cate);
      const res = await blogService.updateBlog(
        params.codeBlog,
        title,
        Code,
        data
      );
      if (res && res.StatusCode === 200) {
        setCate(dataCate[0].Id);
        setCateDisplay({
          Id: dataCate[0].Id,
          Label: dataCate[0].Label,
          Icon: CATE_ICON[dataCate[0].Label],
        });
        localService.removeAll();
        setData("");
        setTitle("");
        navigate(`/pending/${title}/${params.codeBlog}`);
        notification.open({
          type: "success",
          message: "Cập nhật bài viết thành công",
          description: res.Message,
        });
      } else {
        setErrors([res.Message]);
        notification.open({
          type: "error",
          message: "Cập nhật bài viết thất bại",
          description: res.Message,
        });
      }
    }
  };

  return (
    <>
      {/* {contextHolder} */}
      <div className="createBlog__container">
        {haveData ? (
          <>
            {isEdit ? (
              <div className="createBlog__container__editor">
                {errors.length > 0 && (
                  <div className="createBlog__container__editor__title__error">
                    <div className="createBlog__container__editor__title__error__label">
                      Rất tiếc, đã xảy ra lỗi:
                    </div>
                    <ul className="createBlog__container__editor__title__error__list">
                      {errors.map((error, index) => (
                        <li
                          className="createBlog__container__editor__title__error__list__item"
                          key={index}
                        >
                          {error}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="createBlog__container__editor__title">
                  <TextareaAutosize
                    className="createBlog__container__editor__title__text"
                    placeholder="Tiêu đề bài viết"
                    value={title}
                    onChange={(e) => handleTitle(e.target)}
                  />
                </div>
                <div className="createBlog__container__editor__cate">
                  <CateSelect
                    dataCate={dataCate}
                    onChange={handleChangeCate}
                    value={cate}
                  />
                </div>
                <EditorBlog onChangeEditor={onChangeEditor} data={data} />
              </div>
            ) : (
              <div className="createBlog__container__preview">
                <DisplayBlog
                  titleBlog={title}
                  cateBlog={cateDisplay}
                  contentBlog={data}
                />
              </div>
            )}
            {isEdit && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "900px",
                  alignItems: "center",
                  marginTop: "20px",
                }}
              >
                <div className="createBlog__container__editor__control">
                  <div
                    className="createBlog__container__editor__control__save"
                    onClick={handleSaveBlog}
                  >
                    Cập nhật
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div>Không có dữ liệu</div>
        )}
      </div>
    </>
  );
}

export default UpdateBlog;
