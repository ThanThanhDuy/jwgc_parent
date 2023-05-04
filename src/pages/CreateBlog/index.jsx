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
  cateDisplayState,
} from "../../stores/blog";
import moment from "moment";
import cateBlogService from "../../services/cateBlog";
import { CATE_ICON } from "../../assets/icons/cateIcon";
import blogService from "../../services/blog";
import { Modal, notification } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

function CreateBlog() {
  const isEdit = useRecoilValue(isEditState);
  const [title, setTitle] = useRecoilState(titleBlogState);
  const [data, setData] = useRecoilState(contentBlogState);
  const [isLoadingSaveDraft, setIsLoadingSaveDraft] = useState(false);
  const [isSavedDraft, setIsSavedDraft] = useState(false);
  const [isLoadingDeleteDraft, setIsLoadingDeleteDraft] = useState(false);
  const [isDeletedDraft, setIsDeletedDraft] = useState(false);
  const [errors, setErrors] = useState([]);
  const [cate, setCate] = useRecoilState(cateBlogState);
  const [cateDisplay, setCateDisplay] = useRecoilState(cateDisplayState);
  const [dateDraft, setDateDraft] = useState("");
  const [dataCate, setDataCate] = useState([]);
  const navigate = useNavigate();

  useLayoutEffect(() => {
    const handleGetCateBlog = async () => {
      const res = await cateBlogService.getCateBlog();
      if (res && res.StatusCode === 200) {
        setCate(res.Data[0].Id);
        setCateDisplay({
          Id: res.Data[0].Id,
          Label: res.Data[0].Name,
          Icon: CATE_ICON[res.Data[0].Name],
        });
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
        const item = res.Data.find((item) => item.Id === Number(blogCategory));
        setCateDisplay({
          Id: item.Id,
          Label: item.Name,
          Icon: CATE_ICON[item.Name],
        });
      }
      const dateSaveDraft = localService.getDateSaveDraft();
      if (dateSaveDraft) {
        setDateDraft(dateSaveDraft);
      }
    };
    handleGetCateBlog();

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
    let date = new Date();
    let error = [];
    if (title !== "") {
      Modal.confirm({
        title: "Bạn có chắc chắn muốn lưu nháp",
        icon: <ExclamationCircleOutlined />,
        content: "Bài viết sẽ được lưu vào danh sách nháp",
        okText: "Lưu",
        cancelText: "Hủy",
        async onOk() {
          setIsLoadingSaveDraft(true);
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
          notification.open({
            type: "success",
            message: "Lưu nháp thành công",
          });
        },
      });
    } else {
      error.push("Tiêu đề: không được để trống");
      setErrors(error);
      setIsLoadingSaveDraft(false);
    }
    setTimeout(() => {
      setIsSavedDraft(false);
    }, 2000);
  };

  const handleDeleteDraft = () => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xóa bản nháp này không?",
      icon: <ExclamationCircleOutlined />,
      content: "Bản nháp sẽ bị xóa vĩnh viễn",
      okText: "Xóa",
      cancelText: "Hủy",
      onOk() {
        if (isDeletedDraft) return;
        setIsLoadingDeleteDraft(true);
        localService.removeblogContent();
        localService.removeblogTitle();
        localService.removeBlogCategory();
        setTimeout(() => {
          setIsDeletedDraft(true);
          setIsLoadingDeleteDraft(false);
          setDateDraft("");
          setData("");
          setTitle("");
          localService.removeDateSaveDraft();
          setCate(dataCate[0].Id);
          const item = dataCate.find((item) => item.Id === 0);
          setCateDisplay({
            Id: item.Id,
            Label: item.Label,
            Icon: CATE_ICON[item.Label],
          });
        }, 1000);
        setTimeout(() => {
          // openNotificationWithIcon("success", "Xóa bản nháp thành công");
          notification.open({
            type: "success",
            message: "Xóa bản nháp thành công",
          });
        }, 1001);

        setTimeout(() => {
          setIsDeletedDraft(false);
        }, 2000);
      },
    });
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
      Modal.confirm({
        title: "Bạn có chắc chắn muốn đăng bài viết này không?",
        icon: <ExclamationCircleOutlined />,
        content: "Bài viết sẽ được kiểm duyệt trước khi được đăng",
        okText: "Đăng",
        cancelText: "Hủy",
        async onOk() {
          const { Code } = dataCate.find((item) => item.Id === cate);
          const res = await blogService.publishBlog(title, Code, data);
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
            navigate(
              `/pending/${encodeURIComponent(res.Data.Title)?.replaceAll(
                "%20",
                "-"
              )}/${res.Data.Code}`
            );
            notification.open({
              type: "success",
              message: "Đăng bài viết thành công",
              description: res.Message,
            });
          } else {
            setErrors([res.Message]);
            notification.open({
              type: "error",
              message: "Đăng bài viết thất bại",
              description: res.Message,
            });
          }
        },
      });
    }
  };

  return (
    <>
      <div className="createBlog__container">
        <Helmet>
          <meta charSet="utf-8" />
          <title>Tạo blog</title>
        </Helmet>
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
              width: "1500px",
              alignItems: "center",
              marginTop: "20px",
            }}
          >
            <div className="createBlog__container__editor__control">
              {!isLoadingSaveDraft && !isLoadingDeleteDraft && (
                <div
                  className="createBlog__container__editor__control__save"
                  onClick={handleSaveBlog}
                >
                  Đăng bài
                </div>
              )}
              {/* {!isLoadingDeleteDraft && (
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
              )}
              {!isLoadingSaveDraft && localService.getDateSaveDraft() && (
                <div
                  className={`createBlog__container__editor__control__deletedraft ${
                    isLoadingDeleteDraft
                      ? "createBlog__container__editor__control__deletedraft__deleting"
                      : ""
                  }`}
                  onClick={handleDeleteDraft}
                >
                  {isLoadingDeleteDraft
                    ? "Đang xóa nháp..."
                    : isDeletedDraft
                    ? "Đã xóa nháp"
                    : "Xóa nháp"}
                  {isDeletedDraft && <UilCheck color="green" />}
                </div>
              )} */}
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
    </>
  );
}

export default CreateBlog;
