import React, { useState, useLayoutEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import EditorBlog from "../../components/Editor";
import { isEditState } from "../../stores/editor";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import "./index.scss";
import localService from "../../services/local";
import { UilCheck } from "@iconscout/react-unicons";
import CateSelect from "../../components/CateSelect";
import DisplayBlog from "../../components/DisplayBlog";
import {
  titleBlogState,
  contentBlogState,
  cateBlogState,
} from "../../stores/blog";
import moment from "moment";

function CreateBlog() {
  const isEdit = useRecoilValue(isEditState);
  // eslint-disable-next-line
  // const [title, setTitle] = useState("");
  // const [data, setData] = useState("");
  const [title, setTitle] = useRecoilState(titleBlogState);
  const [data, setData] = useRecoilState(contentBlogState);
  const [isLoadingSaveDraft, setIsLoadingSaveDraft] = useState(false);
  const [isSavedDraft, setIsSavedDraft] = useState(false);
  const [errors, setErrors] = useState([]);
  const [cate, setCate] = useRecoilState(cateBlogState);
  const [dateDraft, setDateDraft] = useState("");

  useLayoutEffect(() => {
    const blogContent = localService.getblogContent();
    if (blogContent) {
      setData(blogContent);
    }
    const blogTitle = localService.getblogTitle();
    if (blogTitle) {
      setTitle(blogTitle);
    }
    const blogCategory = localService.getBlogCategory();
    if (blogCategory) {
      setCate(Number(blogCategory));
    }
    const dateSaveDraft = localService.getDateSaveDraft();
    if (dateSaveDraft) {
      setDateDraft(dateSaveDraft);
    }
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

  const handleSaveDraft = () => {
    if (isSavedDraft) return;
    setIsLoadingSaveDraft(true);
    let date = new Date();
    let error = [];
    if (title !== "") {
      setDateDraft("Đang lưu...");
      localService.setblogContent(data);
      localService.setblogTitle(title);
      localService.setBlogCategory(cate);
      localService.setDateSaveDraft(date);
      setTimeout(() => {
        setIsSavedDraft(true);
        setIsLoadingSaveDraft(false);
        setDateDraft(date);
      }, 1000);
    } else {
      error.push("Tiêu đề: không được để trống");
      setErrors(error);
      setIsLoadingSaveDraft(false);
    }
    setTimeout(() => {
      setIsSavedDraft(false);
    }, 3000);
  };

  const handleChangeCate = (value) => {
    setCate(value);
  };

  const handleSaveBlog = () => {
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
      console.log(title);
      console.log(data);
      console.log(cate);
      console.log("Save blog");
    }
  };

  return (
    <div className="createBlog__container">
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
            <CateSelect onChange={handleChangeCate} value={cate} />
          </div>
          <EditorBlog onChangeEditor={onChangeEditor} data={data} />
        </div>
      ) : (
        <div className="createBlog__container__preview">
          <DisplayBlog titleBlog={title} cateBlog={cate} contentBlog={data} />
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
            {!isLoadingSaveDraft && (
              <div
                className="createBlog__container__editor__control__save"
                onClick={handleSaveBlog}
              >
                Đăng bài
              </div>
            )}
            <div
              className={`createBlog__container__editor__control__draft ${
                isLoadingSaveDraft
                  ? "createBlog__container__editor__control__draft__saving"
                  : ""
              }`}
              onClick={handleSaveDraft}
            >
              {isLoadingSaveDraft
                ? "Đang lưu nháp..."
                : isSavedDraft
                ? "Đã lưu nháp"
                : "Lưu nháp"}
              {isSavedDraft && <UilCheck color="green" />}
            </div>
          </div>
          <div>
            <span style={{ fontSize: "14px" }}>
              {dateDraft
                ? dateDraft === "Đang lưu..."
                  ? "Vui lòng đợi..."
                  : `Lần sửa cuối vào ngày ${moment(dateDraft).format(
                      "DD MMMM"
                    )} lúc ${moment(dateDraft).format("HH:mm")}`
                : ""}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateBlog;
