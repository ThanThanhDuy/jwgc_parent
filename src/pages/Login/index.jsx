import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Formik } from "formik";
import { Button, Form } from "reactstrap";
import InputField from "../../components/InputField/index";
import { Link, useNavigate } from "react-router-dom";
import "./index.scss";
import authService from "../../services/auth";
import localService from "../../services/local";
import Loading from "../../components/Loading";
import Alert from "@mui/material/Alert";
import { useRecoilState } from "recoil";
// import { useSetRecoilState } from "recoil";
// import { isAuthState } from "../../stores/auth";
import { usernameState } from "../../stores/auth";
import { getMessagingToken } from "../../utils/noti";

function Login() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useRecoilState(usernameState);
  // const setIsAuth = useSetRecoilState(isAuthState);

  const handleLogin = async (username, password) => {
    setLoading(true);
    const fcmToken = await getMessagingToken();
    const DEVICE_TYPE = 3;
    const res = await authService.login(
      username,
      password,
      fcmToken,
      DEVICE_TYPE
    );
    if (res && res.StatusCode === 200) {
      localService.setUser(JSON.stringify(res.Data?.User));
      localService.setAccessToken(res.Data?.AccessToken);
      setTimeout(() => {
        setErrors([]);
        setLoading(false);
        // setIsAuth(true);
        setUsername("");
        navigate("/home");
      }, 1000);
    } else if (res.StatusCode === 403) {
      setTimeout(() => {
        setLoading(false);
        setErrors(["Tài khoản chưa được kích hoạt, vui lòng kiểm tra email"]);
      }, 1000);
    } else {
      setTimeout(() => {
        setLoading(false);
        setErrors([res.Message]);
      }, 1000);
    }
  };

  return (
    <div>
      {username && (
        <Alert onClose={() => {}}>
          Bạn đã đăng ký tài khoản thành công. Vui lòng kiểm tra email để kích
          hoạt tài khoản
        </Alert>
      )}
      <Helmet>
        <meta charSet="utf-8" />
        <title>Đăng nhập</title>
      </Helmet>
      <div className="pageLogin">
        <div className="pageLogin--title">
          <p className="pageLogin--title__hightLabel">Baby Community</p>
          <span className="pageLogin--title__lowLabel">
            Baby Community giúp các bố mẹ kết nối <br /> và chia sẻ những khó
            khăn với nhau.
          </span>
        </div>
        <div className="pageLogin--container">
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
          <div className="pageLogin--container__form">
            <div className="pageLogin--container__form__input">
              <Formik
                initialValues={{
                  username: username ? username : "",
                  password: "",
                }}
                onSubmit={(values, { setErrors }) => {
                  let check = true;
                  let errors = {};
                  if (!values.username) {
                    errors.username = "Tài khoản không được để trống";
                    check = false;
                  }
                  if (!values.password) {
                    errors.password = "Mật khẩu không được để trống";
                    check = false;
                  }
                  setErrors(errors);
                  if (check) {
                    handleLogin(values.username, values.password);
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
                      handleChange={handleChange}
                      validate={{}}
                      height={50}
                      errors={errors.username}
                      maxLength={20}
                    />
                    <InputField
                      placeholder="Mật khẩu"
                      id="password"
                      type="password"
                      value={values.password}
                      handleChange={handleChange}
                      validate={{}}
                      height={50}
                      errors={errors.password}
                      maxLength={20}
                    />
                    <button
                      className="pageLogin--container__form__btnSubmit"
                      type="submit"
                      onClick={handleSubmit}
                    >
                      <div className="pageLogin--container__form__btnSubmit__box">
                        <span>{loading ? "Đang đăng nhập" : "Đăng nhập"}</span>
                        {loading && <Loading />}
                      </div>
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
            <div className="pageLogin--container__forgotPassword">
              {/* eslint-disable-next-line */}
              <Link to="/forgot-password">Quên mật khẩu?</Link>
            </div>
            <div className="divider-30" />
            <div className="pageLogin--container__btn">
              <Button
                className="pageLogin--container__btn__btnRegiter"
                type="submit"
                color="#ebecfe"
                onClick={() => {
                  navigate("/register");
                }}
              >
                Tạo tài khoản mới
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
