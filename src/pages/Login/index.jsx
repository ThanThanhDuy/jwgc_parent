import React from "react";
import { Helmet } from "react-helmet";
import { Formik } from "formik";
import { Button, Form } from "reactstrap";
import InputField from "../../components/InputField/index";
import { useNavigate } from "react-router-dom";
import "./index.scss";

function Login() {
  const navigate = useNavigate();

  return (
    <div>
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
          <div className="pageLogin--container__form">
            <div className="pageLogin--container__form__input">
              <Formik
                initialValues={{ username: "", password: "" }}
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
                  setErrors(errors);
                  if (check) {
                    navigate("/home");
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
                    <Button
                      className="pageLogin--container__form__btnSubmit"
                      type="submit"
                      onClick={handleSubmit}
                    >
                      Đăng nhập
                    </Button>
                  </Form>
                )}
              </Formik>
            </div>
            <div className="pageLogin--container__forgotPassword">
              {/* eslint-disable-next-line */}
              <a href="">Quên mật khẩu?</a>
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