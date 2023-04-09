import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import userService from "../../services/user";
import "./index.scss";
import { Formik } from "formik";
import { Form } from "reactstrap";
import InputField from "../../components/InputField/index";
import {
  Col,
  DatePicker,
  notification,
  Row,
  Upload,
  Alert,
  Button,
} from "antd";
import moment from "moment";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/vi";
import locale from "antd/es/date-picker/locale/vi_VN";
import { Radio, Form as FormAntd } from "antd";
import Loading from "../../components/Loading/index";
import { UilPlus } from "@iconscout/react-unicons";
import paymentService from "../../services/payment";

dayjs.extend(customParseFormat);
const dateFormat = "DD-MM-YYYY";

function Career() {
  const [user, setUser] = useState({});
  const [userDetail, setUserDetail] = useState({});
  const [gender, setGender] = useState(1);
  const [avatar, setAvatar] = useState("");
  const [date, setDate] = useState("");
  const [isChangeUser, setIsChangeUser] = useState(false);
  const [loadingUser, setLoadingUser] = useState(false);
  const [file, setFile] = useState(null);
  const [errorsUser, setErrorsUser] = useState([]);
  const [isSendLinkEmail, setIsSendLinkEmail] = useState(false);
  const [isSendLinkPhone, setIsSendLinkPhone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUrlFront, setImageUrlFront] = useState("");
  const [fileFront, setFileFront] = useState(null);
  const [imageUrlBe, setImageUrlBe] = useState("");
  const [fileBe, setFileBe] = useState(null);
  const [isEditImgFront, setIsEditImgFront] = useState(false);
  const [isEditImgBe, setIsEditImgBe] = useState(false);
  const [linkMomo, setLinkMomo] = useState("");

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  useEffect(() => {
    const handleGetProfile = async () => {
      const res = await userService.getProfile();
      if (res && res.StatusCode === 200) {
        setUser(res.Data);
        setAvatar(res.Data.AvatarPath);
        if (res.Data.UserDetail) {
          setUserDetail(res.Data.UserDetail);
          setDate(res.Data.UserDetail.VerifiedDateOfBirth);
          setGender(res.Data.UserDetail.Gender);
          if (res.Data.UserFiles.length > 0) {
            res.Data.UserFiles.forEach((item) => {
              if (item.Type === 1) {
                setImageUrlFront(item.FilePath);
              } else {
                setImageUrlBe(item.FilePath);
              }
            });
          }
        }
        if (res.Data.NannyStatus === 4) {
          const getLinkMomo = async () => {
            const resMomo = await paymentService.getLinkMomo(
              window.location.href
            );
            if (resMomo && resMomo.StatusCode === 200) {
              setLinkMomo(resMomo.Data.WebLink);
            }
          };
          getLinkMomo();
        }
      }
    };
    handleGetProfile();
  }, []);

  const handleSave = async (id, name, address, dateOfBirth, gender) => {
    setLoadingUser(true);
    const data = {
      Name: name,
      Gender: gender,
      DateOfBirth: dateOfBirth,
      IdentityCardNumber: id,
      PlaceOfResidence: address,
    };
    isEditImgFront && (data.ForegroundIdentityCardImage = fileFront);
    isEditImgBe && (data.BackgroundIdentityCardImage = fileBe);
    const res = await userService.verifyNanny({
      Name: name,
      Gender: gender,
      DateOfBirth: dateOfBirth,
      IdentityCardNumber: id,
      PlaceOfResidence: address,
      ForegroundIdentityCardImage: fileFront,
      BackgroundIdentityCardImage: fileBe,
    });
    if (res && res.StatusCode === 200) {
      setTimeout(() => {
        notification.open({
          type: "success",
          message: "Cập nhật thông tin thành công, vui lòng chờ xét duyệt",
        });
        setIsChangeUser(false);
        setLoadingUser(false);
        setErrorsUser([]);
      }, 1000);
    } else {
      setTimeout(() => {
        setErrorsUser([res.Message]);
        setLoadingUser(false);
      }, 1000);
    }
  };

  const onChangeGender = (e) => {
    setGender(e.target.value);
    setIsChangeUser(true);
  };

  const handleFileSelected = (e) => {
    const file = e.target.files[0];
    setFile(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setAvatar(reader.result);
      setIsChangeUser(true);
    };
  };

  // const onChangeDate = (date, dateString) => {
  //   setDate(dateString);
  //   setIsChangeUser(true);
  // };

  const handleChangeImageFront = (info) => {
    getBase64(info.file.originFileObj, (url) => {
      setImageUrlFront(url);
      setFileFront(info.file);
      setIsEditImgFront(true);
      setIsChangeUser(true);
    });
  };

  const handleChangeImageBe = (info) => {
    getBase64(info.file.originFileObj, (url) => {
      setImageUrlBe(url);
      setFileBe(info.file);
      setIsEditImgBe(true);
      setIsChangeUser(true);
    });
  };

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Hỗ trợ việc làm</title>
      </Helmet>
      {user.NannyStatus === 2 && (
        <Alert
          type="info"
          showIcon
          message="Thông tin của bạn đang được xét duyệt, vui lòng chờ trong giây lát."
        />
      )}
      {user.NannyStatus === 4 && (
        <Alert
          type="success"
          showIcon
          message="Thông tin của bạn đã được xác thực, vui lòng thanh toán."
          action={
            <Button size="small" type="text">
              Thanh toán
            </Button>
          }
        />
      )}
      {user.NannyStatus === 1 && (
        <Alert
          type="success"
          showIcon
          message="Thông tin của bạn đã được xác thực. Bạn đã thanh toán thành công. Hiện tại bạn có thể nhận việc."
        />
      )}
      {user.NannyStatus === 3 && (
        <Alert
          type="error"
          showIcon
          message="Thông tin của bạn đã bị từ chối, vui lòng cập nhật lại."
        />
      )}
      <div className="updatecareer__container">
        <div className="updatecareer__container__box">
          {/* <div className="updatecareer__container__box__title">
            <span>Cập nhật hồ sơ việc làm</span>
          </div> */}
          <div className="updatecareer__container__box__main">
            <div className="updatecareer__container__box__main__user">
              {errorsUser.length > 0 && (
                <div className="createBlog__container__editor__title__error">
                  <div className="createBlog__container__editor__title__error__label">
                    Rất tiếc, đã xảy ra lỗi:
                  </div>
                  <ul className="createBlog__container__editor__title__error__list">
                    {errorsUser.map((error, index) => (
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
              <div
                className="updatecareer__container__box__main__user__title"
                style={{ paddingTop: errorsUser.length > 0 ? "0px" : "24px" }}
              >
                <span>Thông tin căn cước</span>
              </div>
              <div className="updatecareer__container__box__main__user__box">
                <Formik
                  enableReinitialize
                  initialValues={{
                    name: userDetail?.VerifiedName
                      ? userDetail.VerifiedName
                      : "",
                    id: userDetail?.IdentityCardNumber
                      ? userDetail.IdentityCardNumber
                      : "",
                    address: userDetail?.PlaceOfResidence
                      ? userDetail.PlaceOfResidence
                      : "",
                    dateOfBirth: date ? date : moment().format(dateFormat),
                    gender: gender,
                    fileFront: "",
                    fileBe: "",
                  }}
                  onSubmit={(values, { setErrors }) => {
                    let check = true;
                    let errors = {};
                    if (!values.name) {
                      errors.name = "Họ và tên không được để trống";
                      check = false;
                    }
                    if (values.dateOfBirth) {
                      if (
                        dayjs(values.dateOfBirth, dateFormat).isAfter(
                          dayjs()
                        ) ||
                        dayjs(values.dateOfBirth, dateFormat).isBefore(
                          dayjs().subtract(100, "year")
                        )
                      ) {
                        errors.dateOfBirth =
                          "Ngày sinh không hợp lệ. Vui lòng nhập lại";
                        check = false;
                      } else if (
                        dayjs(values.dateOfBirth, dateFormat).isAfter(
                          dayjs().subtract(18, "year")
                        )
                      ) {
                        errors.dateOfBirth = "Bạn phải đủ 18 tuổi để đăng ký";
                        check = false;
                      }
                    }
                    if (!values.id) {
                      errors.id = "Số căn cước không được để trống";
                      check = false;
                    } else if (values.id && values.id.length < 12) {
                      errors.id = "Số căn cước không hợp lệ";
                      check = false;
                    } else if (!/^[0-9]*$/.test(values.id)) {
                      errors.id = "Số căn cước không hợp lệ";
                      check = false;
                    }

                    if (!values.address) {
                      errors.address = "Địa chỉ không được để trống";
                      check = false;
                    }

                    if (user.NannyStatus === 0) {
                      if (fileFront === null) {
                        errors.fileFront = "Ảnh mặt trước không được để trống";
                        check = false;
                      }
                      if (fileBe === null) {
                        errors.fileBe = "Ảnh mặt sau không được để trống";
                        check = false;
                      }
                    }
                    setErrors(errors);
                    if (check) {
                      handleSave(
                        values.id,
                        values.name,
                        values.address,
                        values.dateOfBirth,
                        values.gender
                      );
                    }
                  }}
                >
                  {({
                    values,
                    errors,
                    handleChange,
                    handleSubmit,
                    setFieldValue,
                    setFieldError,
                  }) => (
                    <Form>
                      <Row gutter={50} style={{ marginBottom: "16px" }}>
                        <Col span={12}>
                          <InputField
                            placeholder="Số căn cước"
                            id="id"
                            type="text"
                            value={values.id}
                            handleChange={(e) => {
                              handleChange(e);
                              setIsChangeUser(true);
                            }}
                            validate={{}}
                            height={40}
                            errors={errors.id}
                            maxLength={12}
                            label="Số căn cước"
                          />
                        </Col>
                        <Col span={12}>
                          <InputField
                            placeholder="Họ và tên"
                            id="name"
                            type="text"
                            value={values.name}
                            handleChange={(e) => {
                              handleChange(e);
                              setIsChangeUser(true);
                            }}
                            validate={{}}
                            height={40}
                            errors={errors.name}
                            label="Họ và tên"
                          />
                        </Col>
                      </Row>
                      <Row style={{ marginBottom: "16px" }}>
                        <Col span={24}>
                          <InputField
                            placeholder="Nơi thường trú"
                            id="address"
                            type="text"
                            value={values.address}
                            handleChange={(e) => {
                              handleChange(e);
                              setIsChangeUser(true);
                            }}
                            validate={{}}
                            height={40}
                            errors={errors.address}
                            label="Nơi thường trú"
                          />
                        </Col>
                      </Row>
                      <Row gutter={50} style={{ marginBottom: "16px" }}>
                        <Col span={12}>
                          <label
                            className="inputProfile__label"
                            htmlFor="birthday"
                          >
                            Ngày sinh
                          </label>
                          <FormAntd.Item
                            validateStatus={errors.dateOfBirth && "error"}
                            help={errors.dateOfBirth}
                          >
                            <DatePicker
                              id="birthday"
                              placeholder="Ngày sinh"
                              style={{ width: "100%", height: "40px" }}
                              locale={locale}
                              value={dayjs(values.dateOfBirth, dateFormat)}
                              format={dateFormat}
                              onChange={(date, dateString) => {
                                // setDate(dateString);
                                setFieldValue("dateOfBirth", dateString);
                                setIsChangeUser(true);
                              }}
                            />
                          </FormAntd.Item>
                        </Col>
                        <Col span={12}>
                          <label
                            className="inputProfile__label"
                            htmlFor="gender"
                          >
                            Giới tính
                          </label>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              height: "40px",
                            }}
                          >
                            <Radio.Group
                              id="gender"
                              onChange={(e) => {
                                setFieldValue("gender", e.target.value);
                                setIsChangeUser(true);
                              }}
                              value={values.gender}
                            >
                              <Radio value={0}>Nữ</Radio>
                              <Radio value={1}>Nam</Radio>
                            </Radio.Group>
                          </div>
                        </Col>
                      </Row>
                      <Row gutter={50} style={{ marginTop: "16px" }}>
                        <Col
                          span={12}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            width: "100%",
                          }}
                        >
                          <label
                            className="inputProfile__label"
                            htmlFor="birthday"
                          >
                            Ảnh mặt trước
                          </label>
                          <FormAntd.Item
                            validateStatus={errors.fileFront && "error"}
                            help={errors.fileFront}
                          >
                            <Upload
                              name="cccdFront"
                              beforeUpload={(file) => {
                                setFileFront(file);
                              }}
                              onChange={(info) => {
                                getBase64(info.file.originFileObj, (url) => {
                                  setImageUrlFront(url);
                                  // setFileFront(info.file);
                                  setIsEditImgFront(true);
                                  setIsChangeUser(true);
                                  setFieldError("fileFront", "");
                                });
                              }}
                              style={{ width: "100%" }}
                              showUploadList={false}
                            >
                              {imageUrlFront ? (
                                <img
                                  src={imageUrlFront}
                                  alt="avatar"
                                  style={{
                                    width: "100%",
                                    height: "250px",
                                    borderRadius: "5px",
                                    border: "1.5px solid #d9d9d9",
                                  }}
                                />
                              ) : (
                                <div
                                  style={{
                                    width: "100%",
                                    height: "250px",
                                    border: errors.fileFront
                                      ? "1.5px dashed #ff4d4f"
                                      : "1.5px dashed #d9d9d9",
                                    borderRadius: "5px",
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  <UilPlus size={32} color="#d9d9d9" />
                                </div>
                              )}
                            </Upload>
                          </FormAntd.Item>
                        </Col>
                        <Col
                          span={12}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            width: "100%",
                          }}
                        >
                          <FormAntd.Item
                            validateStatus={errors.fileBe && "error"}
                            help={errors.fileBe}
                          >
                            <label
                              className="inputProfile__label"
                              htmlFor="birthday"
                            >
                              Ảnh mặt sau
                            </label>
                            <Upload
                              name="cccdFront"
                              beforeUpload={(file) => {
                                setFileBe(file);
                              }}
                              onChange={(info) => {
                                getBase64(info.file.originFileObj, (url) => {
                                  setImageUrlBe(url);
                                  // setFileBe(info.file);
                                  setIsEditImgBe(true);
                                  setIsChangeUser(true);
                                  setFieldError("fileBe", "");
                                });
                              }}
                              style={{ width: "100%" }}
                              showUploadList={false}
                            >
                              {imageUrlBe ? (
                                <img
                                  src={imageUrlBe}
                                  alt="avatar"
                                  style={{
                                    width: "100%",
                                    height: "250px",
                                    borderRadius: "5px",
                                    border: "1.5px solid #d9d9d9",
                                  }}
                                />
                              ) : (
                                <div
                                  style={{
                                    width: "100%",
                                    height: "250px",
                                    border: errors.fileFront
                                      ? "1.5px dashed #ff4d4f"
                                      : "1.5px dashed #d9d9d9",
                                    borderRadius: "5px",
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  <UilPlus size={32} color="#d9d9d9" />
                                </div>
                              )}
                            </Upload>
                          </FormAntd.Item>
                        </Col>
                      </Row>
                      <button
                        className="pageLogin--container__form__btnSubmit"
                        type="submit"
                        onClick={handleSubmit}
                      >
                        <div className="pageLogin--container__form__btnSubmit__box">
                          <span>
                            {loadingUser
                              ? "Đang cập nhật thông tin"
                              : "Cập nhật thông tin"}
                          </span>
                          {loadingUser && <Loading />}
                        </div>
                      </button>
                      {user.NannyStatus === 4 && (
                        <a
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            border: "2px solid #008516",
                            width: "100%",
                            marginTop: "20px",
                            height: "50px",
                            fontSize: "20px",
                            fontWeight: "500",
                            borderRadius: "8px",
                            color: "#008516",
                            textDecoration: "none",
                          }}
                          href={linkMomo}
                          target="_blank"
                        >
                          <span>Thanh toán</span>
                        </a>
                      )}
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Career;
