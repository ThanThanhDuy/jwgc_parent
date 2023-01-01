import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import userService from "../../services/user";
import "./index.scss";
import { Formik } from "formik";
import { Form } from "reactstrap";
import InputField from "../../components/InputField/index";
import { Col, DatePicker, notification, Row } from "antd";
import moment from "moment";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/vi";
import locale from "antd/es/date-picker/locale/vi_VN";
import { Radio, Form as FormAntd } from "antd";
import Loading from "../../components/Loading/index";
import Alert from "@mui/material/Alert";

dayjs.extend(customParseFormat);
const dateFormat = "DD-MM-YYYY";

function UpdateProfile() {
  const [user, setUser] = useState({});
  const [gender, setGender] = useState(1);
  const [avatar, setAvatar] = useState("");
  const [date, setDate] = useState("");
  const [isChangeUser, setIsChangeUser] = useState(false);
  const [isContact, setIsContact] = useState(false);
  const [isPassword, setIsPassword] = useState(false);
  const [loadingUser, setLoadingUser] = useState(false);
  const [loadingContact, setLoadingContact] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [file, setFile] = useState(null);
  const [errorsUser, setErrorsUser] = useState([]);
  const [errorsContact, setErrorsContact] = useState([]);
  const [errorsPassword, setErrorsPassword] = useState([]);
  const [isVerifyEmail, setIsVerifyEmail] = useState(false);
  const [isVerifyPhone, setIsVerifyPhone] = useState(false);
  const [isNeedVerifyEmail, setIsNeedVerifyEmail] = useState(true);
  const [isNeedVerifyPhone, setIsNeedVerifyPhone] = useState(true);
  const [isSendLinkEmail, setIsSendLinkEmail] = useState(false);
  const [isSendLinkPhone, setIsSendLinkPhone] = useState(false);

  useEffect(() => {
    const handleGetProfile = async () => {
      const res = await userService.getProfile();
      if (res && res.StatusCode === 200) {
        setUser(res.Data);
        setGender(res.Data.Gender);
        setAvatar(res.Data.AvatarPath);
        setDate(res.Data.DateOfBirth);
        setIsVerifyEmail(res.Data.VerifiedEmail);
        setIsVerifyPhone(res.Data.VerifiedPhoneNumber);
      }
    };
    handleGetProfile();
  }, []);

  const handleSaveUser = async (name, dateOfBirth, gender) => {
    setLoadingUser(true);
    const res = await userService.updateProfile({
      name,
      dateOfBirth,
      gender,
      file,
    });
    if (res && res.StatusCode === 200) {
      setTimeout(() => {
        notification.open({
          type: "success",
          message: "Cập nhật thông tin thành công",
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

  const handleUpdateContact = async (email, phoneNumber) => {
    setLoadingContact(true);
    if (email === user.Email) {
      email = null;
    }
    if (phoneNumber === user.PhoneNumber.replace("+84", "0")) {
      phoneNumber = null;
    }
    const res = await userService.updateProfile({ email, phoneNumber });
    if (res && res.StatusCode === 200) {
      setTimeout(() => {
        notification.open({
          type: "success",
          message: "Cập nhật thông tin thành công",
        });
        setIsContact(false);
        setLoadingContact(false);
        setErrorsContact([]);
      }, 1000);
    } else {
      setTimeout(() => {
        setErrorsContact([res.Message]);
        setLoadingContact(false);
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

  const onChangeDate = (date, dateString) => {
    setDate(dateString);
    setIsChangeUser(true);
  };

  const handleVerifyEmail = async () => {
    const res = await userService.sendLinkToVerifyEmail();
    if (res && res.StatusCode === 200) {
      setIsSendLinkEmail(true);
      setIsNeedVerifyEmail(false);
    } else {
      setTimeout(() => {
        setErrorsContact([res.Message]);
      }, 1000);
    }
  };

  const handleVerifyPhone = async () => {
    const res = await userService.sendLinkToVerifyPhone();
    if (res && res.StatusCode === 200) {
      setIsSendLinkPhone(true);
      setIsNeedVerifyPhone(false);
    } else {
      setTimeout(() => {
        setErrorsContact([res.Message]);
      }, 1000);
    }
  };

  const handleChangePassword = async (oldPassword, newPassword) => {
    setLoadingPassword(true);
    const res = await userService.updatePassword({
      oldPassword,
      newPassword,
    });
    if (res && res.StatusCode === 200) {
      setTimeout(() => {
        notification.open({
          type: "success",
          message: "Cập nhật mật khẩu thành công",
        });
        setIsPassword(false);
        setLoadingPassword(false);
        setErrorsPassword([]);
      }, 1000);
    }
    if (res && res.StatusCode === 400) {
      setTimeout(() => {
        setErrorsPassword([res.Message]);
        setLoadingPassword(false);
      }, 1000);
    }
  };

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Cập nhật thông tin cá nhân</title>
      </Helmet>
      {isSendLinkEmail && (
        <Alert>
          Một liên kết xác thực đã được gửi đến email của bạn. Vui lòng kiểm tra
        </Alert>
      )}
      {isSendLinkPhone && (
        <Alert>
          Một liên kết xác thực đã được gửi đến số điện thoại của bạn. Vui lòng
          kiểm tra
        </Alert>
      )}
      <div className="updateprofile__container">
        <div className="updateprofile__container__box">
          <div className="updateprofile__container__box__title">
            <span>
              Thông tin cá nhân của{" "}
              <Link
                to={`/profile/${user.UserName}`}
                className="updateprofile__container__box__title__username"
              >
                {user.Name}
              </Link>
            </span>
          </div>
          <div className="updateprofile__container__box__main">
            <div className="updateprofile__container__box__main__user">
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
                className="updateprofile__container__box__main__user__title"
                style={{ paddingTop: errorsUser.length > 0 ? "0px" : "24px" }}
              >
                <span>User</span>
              </div>
              <div className="updateprofile__container__box__main__user__box">
                <Formik
                  enableReinitialize
                  initialValues={{
                    name: user?.Name ? user.Name : "",
                    username: user?.UserName ? user.UserName : "",
                    dateOfBirth: date ? date : moment().format(dateFormat),
                    gender: gender ? gender : 1,
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
                      }
                    }
                    setErrors(errors);
                    if (check) {
                      handleSaveUser(
                        values.name,
                        values.dateOfBirth,
                        values.gender
                      );
                    }
                  }}
                >
                  {({ values, errors, handleChange, handleSubmit }) => (
                    <Form>
                      <InputField
                        placeholder="Tài khoản"
                        id="username"
                        type="text"
                        value={values.username}
                        handleChange={(e) => {
                          handleChange(e);
                        }}
                        validate={{}}
                        height={40}
                        errors={errors.username}
                        maxLength={20}
                        label="Tài khoản"
                        disabled={true}
                      />
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
                        maxLength={20}
                        label="Họ và tên"
                      />
                      <Row gutter={100} style={{ marginBottom: "16px" }}>
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
                              onChange={onChangeDate}
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
                              onChange={onChangeGender}
                              value={values.gender}
                            >
                              <Radio value={1}>Nữ</Radio>
                              <Radio value={2}>Nam</Radio>
                            </Radio.Group>
                          </div>
                        </Col>
                      </Row>
                      <div>
                        <label className="inputProfile__label" htmlFor="avatar">
                          Ảnh đại diện
                        </label>
                        <div
                          className="updateprofile__container__box__main__user__avatar"
                          id="avatar"
                        >
                          <img src={avatar} alt="" />
                          <div className="updateprofile__container__box__main__user__avatar__input">
                            <input
                              onChange={handleFileSelected}
                              type="file"
                              accept="image/png, image/jpeg"
                            />
                          </div>
                        </div>
                      </div>
                      {isChangeUser && (
                        <button
                          className="pageLogin--container__form__btnSubmit"
                          type="submit"
                          onClick={handleSubmit}
                        >
                          <div className="pageLogin--container__form__btnSubmit__box">
                            <span>
                              {loadingUser
                                ? "Đang lưu thay đổi"
                                : "Lưu thay đổi"}
                            </span>
                            {loadingUser && <Loading />}
                          </div>
                        </button>
                      )}
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
            <div
              className="updateprofile__container__box__main__contact"
              style={{
                paddingTop: errorsContact.length > 0 ? "0px" : "24px",
                marginBottom: "24px",
              }}
            >
              {errorsContact.length > 0 && (
                <div className="createBlog__container__editor__title__error">
                  <div className="createBlog__container__editor__title__error__label">
                    Rất tiếc, đã xảy ra lỗi:
                  </div>
                  <ul className="createBlog__container__editor__title__error__list">
                    {errorsContact.map((error, index) => (
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
              <div className="updateprofile__container__box__main__contact__title">
                <span>Liên hệ</span>
              </div>
              <div className="updateprofile__container__box__main__contact__box">
                <Formik
                  enableReinitialize
                  initialValues={{
                    email: user?.Email ? user.Email : "",
                    phone: user?.PhoneNumber
                      ? user.PhoneNumber?.replace("+84", "0")
                      : "",
                  }}
                  onSubmit={(values, { setErrors }) => {
                    let check = true;
                    let errors = {};
                    if (!values.email) {
                      errors.email = "Email không được để trống";
                      check = false;
                    } else if (
                      !/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/.test(
                        values.email
                      )
                    ) {
                      errors.email = "Email không đúng định dạng";
                      check = false;
                    }
                    setErrors(errors);
                    if (check) {
                      handleUpdateContact(values.email, values.phone);
                    }
                  }}
                >
                  {({ values, errors, handleChange, handleSubmit }) => (
                    <Form>
                      <Row>
                        <Col span={20}>
                          <InputField
                            placeholder="Email"
                            id="email"
                            type="email"
                            value={values.email}
                            handleChange={(e) => {
                              handleChange(e);
                              setIsContact(true);
                              if (e.target.value === user.Email) {
                                setIsNeedVerifyEmail(true);
                                return;
                              }
                              setIsNeedVerifyEmail(false);
                            }}
                            validate={{}}
                            height={40}
                            errors={errors.email}
                            maxLength={50}
                            verify={isVerifyEmail}
                            isNeedVerify={isNeedVerifyEmail}
                            label="Email"
                          />
                        </Col>
                        {isNeedVerifyEmail && !isVerifyEmail && (
                          <Col span={4}>
                            <div
                              className="btn__verify"
                              onClick={handleVerifyEmail}
                            >
                              <span>Xác thực</span>
                            </div>
                          </Col>
                        )}
                      </Row>
                      <Row>
                        <Col span={20}>
                          <InputField
                            placeholder="Số điện thoại"
                            id="phone"
                            type="text"
                            value={values.phone}
                            handleChange={(e) => {
                              handleChange(e);
                              setIsContact(true);

                              if (
                                e.target.value ===
                                user.PhoneNumber?.replace("+84", "0")
                              ) {
                                setIsNeedVerifyPhone(true);
                                return;
                              }
                              setIsNeedVerifyPhone(false);
                            }}
                            validate={{}}
                            height={40}
                            errors={errors.phone}
                            maxLength={10}
                            verify={isVerifyPhone}
                            isNeedVerify={isNeedVerifyPhone}
                            label="Số điện thoại"
                          />
                        </Col>
                        {isNeedVerifyPhone && !isVerifyPhone && (
                          <Col span={4}>
                            <div
                              className="btn__verify"
                              onClick={handleVerifyPhone}
                            >
                              <span>Xác thực</span>
                            </div>
                          </Col>
                        )}
                      </Row>
                      {isContact && (
                        <button
                          className="pageLogin--container__form__btnSubmit"
                          type="submit"
                          onClick={handleSubmit}
                        >
                          <div className="pageLogin--container__form__btnSubmit__box">
                            <span>
                              {loadingContact
                                ? "Đang lưu thay đổi"
                                : "Lưu thay đổi"}
                            </span>
                            {loadingContact && <Loading />}
                          </div>
                        </button>
                      )}
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
            <div
              className="updateprofile__container__box__main__contact"
              style={{ paddingTop: errorsPassword.length > 0 ? "0px" : "24px" }}
            >
              {errorsPassword.length > 0 && (
                <div className="createBlog__container__editor__title__error">
                  <div className="createBlog__container__editor__title__error__label">
                    Rất tiếc, đã xảy ra lỗi:
                  </div>
                  <ul className="createBlog__container__editor__title__error__list">
                    {errorsPassword.map((error, index) => (
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
              <div className="updateprofile__container__box__main__contact__title">
                <span>Mật khẩu</span>
              </div>
              <div className="updateprofile__container__box__main__contact__box">
                <Formik
                  enableReinitialize
                  initialValues={{
                    currentPassword: "",
                    newPassword: "",
                    reNewPassword: "",
                  }}
                  onSubmit={(values, { setErrors }) => {
                    let check = true;
                    let errors = {};
                    if (!values.currentPassword) {
                      errors.currentPassword =
                        "Vui lòng nhập mật khẩu hiện tại";
                      check = false;
                    }
                    if (!values.newPassword) {
                      errors.newPassword = "Vui lòng nhập mật khẩu mới của bạn";
                      check = false;
                    }
                    if (!values.reNewPassword) {
                      errors.reNewPassword =
                        "Vui lòng nhập lại mật khẩu mới của bạn";
                      check = false;
                    }
                    if (values.newPassword !== values.reNewPassword) {
                      errors.reNewPassword =
                        "Mật khẩu mới không khớp, vui lòng nhập lại";
                      check = false;
                    }
                    if (values.newPassword === values.currentPassword) {
                      errors.newPassword =
                        "Mật khẩu mới không được trùng với mật khẩu hiện tại";
                      check = false;
                    }

                    setErrors(errors);
                    if (check) {
                      handleChangePassword(
                        values.currentPassword,
                        values.newPassword
                      );
                    }
                  }}
                >
                  {({ values, errors, handleChange, handleSubmit }) => (
                    <Form>
                      <InputField
                        // placeholder="Mật khẩu hiện tại"
                        id="currentPassword"
                        type="password"
                        value={values.currentPassword}
                        handleChange={(e) => {
                          handleChange(e);
                          setIsPassword(true);
                        }}
                        validate={{}}
                        height={40}
                        errors={errors.currentPassword}
                        maxLength={50}
                        label="Mật khẩu hiện tại"
                      />
                      <InputField
                        // placeholder="Mật khẩu mới"
                        id="newPassword"
                        type="password"
                        value={values.newPassword}
                        handleChange={(e) => {
                          handleChange(e);
                          setIsPassword(true);
                        }}
                        validate={{}}
                        height={40}
                        errors={errors.newPassword}
                        maxLength={10}
                        label="Mật khẩu mới"
                      />
                      <InputField
                        // placeholder="Nhập lại mật khẩu mới"
                        id="reNewPassword"
                        type="password"
                        value={values.reNewPassword}
                        handleChange={(e) => {
                          handleChange(e);
                          setIsPassword(true);
                        }}
                        validate={{}}
                        height={40}
                        errors={errors.reNewPassword}
                        maxLength={10}
                        label="Nhập lại mật khẩu mới"
                      />

                      {isPassword && (
                        <button
                          className="pageLogin--container__form__btnSubmit"
                          type="submit"
                          onClick={handleSubmit}
                        >
                          <div className="pageLogin--container__form__btnSubmit__box">
                            <span>
                              {loadingPassword
                                ? "Đang lưu thay đổi"
                                : "Lưu thay đổi"}
                            </span>
                            {loadingPassword && <Loading />}
                          </div>
                        </button>
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

export default UpdateProfile;
