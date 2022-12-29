import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Formik } from "formik";
import { Button, Form } from "reactstrap";
import InputField from "../../components/InputField/index";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";
import authService from "../../services/auth";
import "./index.scss";
import { useSetRecoilState } from "recoil";
import { usernameState } from "../../stores/auth";

function Register() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const setUsername = useSetRecoilState(usernameState);

  const handleRegister = async (username, password, fullname, email) => {
    setLoading(true);
    const res = await authService.register(username, password, fullname, email);
    if (res && res.StatusCode === 200) {
      setTimeout(() => {
        setErrors([]);
        setLoading(false);
        setUsername(username);
        // setIsAuth(true);
        navigate("/login");
      }, 1500);
    } else {
      setTimeout(() => {
        setLoading(false);
        setErrors([res.Message]);
      }, 1500);
    }
  };

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Đăng nhập</title>
      </Helmet>
      <div className="pageRegister">
        <div className="pageRegister--title">
          <p className="pageRegister--title__hightLabel">Baby Community</p>
          <span className="pageRegister--title__lowLabel">
            Baby Community giúp các bố mẹ kết nối <br /> và chia sẻ những khó
            khăn với nhau.
          </span>
        </div>
        <div className="pageRegister--container">
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
          <div className="pageRegister--container__form">
            <div className="pageRegister--container__form__input">
              <Formik
                initialValues={{
                  username: "",
                  password: "",
                  repassword: "",
                  fullname: "",
                  email: "",
                }}
                onSubmit={(values, { setErrors }) => {
                  let check = true;
                  let errors = {};
                  if (!values.password) {
                    errors.password = "Mật khẩu không được để trống";
                    check = false;
                  }
                  if (!values.username) {
                    errors.username = "Tài khoản không được để trống";
                    check = false;
                  }
                  if (!values.fullname) {
                    errors.fullname = "Họ và tên không được để trống";
                    check = false;
                  }
                  if (!values.email) {
                    errors.email = "Email không được để trống";
                    check = false;
                  }
                  if (!values.repassword) {
                    errors.repassword = "Mật khẩu không được để trống";
                    check = false;
                  } else if (values.repassword !== values.password) {
                    errors.repassword = "Mật khẩu không trùng khớp";
                    check = false;
                  }
                  setErrors(errors);
                  if (check) {
                    handleRegister(
                      values.username,
                      values.password,
                      values.fullname,
                      values.email
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
                      handleChange={handleChange}
                      validate={{}}
                      height={50}
                      errors={errors.username}
                      maxLength={30}
                    />
                    <InputField
                      placeholder="Họ và tên"
                      id="fullname"
                      type="text"
                      value={values.fullname}
                      handleChange={handleChange}
                      validate={{}}
                      height={50}
                      errors={errors.fullname}
                      maxLength={30}
                    />
                    <InputField
                      placeholder="Email"
                      id="email"
                      type="email"
                      value={values.email}
                      handleChange={handleChange}
                      validate={{}}
                      height={50}
                      errors={errors.email}
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
                      maxLength={50}
                    />
                    <InputField
                      placeholder="Nhập lại mật khẩu"
                      id="repassword"
                      type="password"
                      value={values.repassword}
                      handleChange={handleChange}
                      validate={{}}
                      height={50}
                      errors={errors.repassword}
                    />
                    <button
                      className="pageRegister--container__form__btnSubmit"
                      type="submit"
                      onClick={handleSubmit}
                    >
                      <div className="pageRegister--container__form__btnSubmit__box">
                        <span>{loading ? "Đang đăng ký" : "Đăng ký"}</span>
                        {loading && <Loading />}
                      </div>
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
            {/* <div className="pageRegister--container__forgotPassword">
              <a href="">Quên mật khẩu?</a>
            </div> */}
            <div className="divider-30" />
            <div className="pageRegister--container__btn">
              <Button
                className="pageRegister--container__btn__btnRegiter"
                type="submit"
                color="#ebecfe"
                onClick={() => {
                  navigate("/login");
                }}
              >
                Đã có tài khoản?
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
