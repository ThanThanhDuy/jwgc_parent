import React from "react";
import { Helmet } from "react-helmet";
import { Formik } from "formik";
import { Button, Form } from "reactstrap";
import InputField from "../../components/InputField/index";
import { useNavigate } from "react-router-dom";
import "./index.scss";

function Register() {
  const navigate = useNavigate();

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
          <div className="pageRegister--container__form">
            <div className="pageRegister--container__form__input">
              <Formik
                initialValues={{
                  username: "",
                  password: "",
                  repassword: "",
                  fullname: "",
                }}
                onSubmit={(values, { setErrors }) => {
                  let errors = {};
                  if (!values.password) {
                    errors.password = "Mật khẩu không được để trống";
                  }
                  if (!values.username) {
                    errors.username = "Tài khoản không được để trống";
                  }
                  if (!values.fullname) {
                    errors.fullname = "Họ và tên không được để trống";
                  }
                  if (!values.repassword) {
                    errors.repassword = "Mật khẩu không được để trống";
                  } else if (values.repassword !== values.password) {
                    errors.repassword = "Mật khẩu không trùng khớp";
                  }
                  setErrors(errors);
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
                      placeholder="Họ và tên"
                      id="fullname"
                      type="text"
                      value={values.fullname}
                      handleChange={handleChange}
                      validate={{}}
                      height={50}
                      errors={errors.fullname}
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
                    <InputField
                      placeholder="Nhập lại mật khẩu"
                      id="repassword"
                      type="password"
                      value={values.repassword}
                      handleChange={handleChange}
                      validate={{}}
                      height={50}
                      errors={errors.repassword}
                      maxLength={20}
                    />
                    <Button
                      className="pageRegister--container__form__btnSubmit"
                      type="submit"
                      onClick={handleSubmit}
                    >
                      Đăng ký
                    </Button>
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
