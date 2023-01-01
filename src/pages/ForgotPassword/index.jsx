import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Formik } from "formik";
import { Form } from "reactstrap";
import InputField from "../../components/InputField/index";
// import { useNavigate } from "react-router-dom";
import "./index.scss";
import authService from "../../services/auth";
import Loading from "../../components/Loading";
import Alert from "@mui/material/Alert";

function ForgotPassword() {
  // const navigate = useNavigate();
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  // const setIsAuth = useSetRecoilState(isAuthState);

  const handleSendMail = async (username, email) => {
    setLoading(true);
    const res = await authService.sendLinkToResetPassword(email, username);
    if (res && res.StatusCode === 200) {
      console.log(res);
      setTimeout(() => {
        setErrors([]);
        setLoading(false);
        setIsSuccess(true);
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
      {isSuccess && (
        <Alert severity="success" onClose={() => {}}>
          Một email đã được gửi đến email của bạn. Vui lòng kiểm tra email để
          lấy lại mật khẩu.
        </Alert>
      )}
      <Helmet>
        <meta charSet="utf-8" />
        <title>Quên mật khẩu</title>
      </Helmet>
      <div className="pageLogin">
        <div className="pageLogin--title">
          <p className="pageLogin--title__hightLabel">Quên mật khẩu</p>
          <span className="pageLogin--title__lowLabel">
            Bạn đã quên mật khẩu ư? Đừng lo, hãy nhập email kèm
            <br /> tài khoản của bạn vào ô bên cạnh. Chúng tôi sẽ gửi
            <br /> một email cho bạn để đặt lại mật khẩu.
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
                  username: "",
                  email: "",
                }}
                onSubmit={(values, { setErrors }) => {
                  let check = true;
                  let errors = {};
                  if (!values.username) {
                    errors.username = "Tài khoản không được để trống";
                    check = false;
                  }
                  if (!values.email) {
                    errors.email = "Email không được để trống";
                    check = false;
                  }
                  setErrors(errors);
                  if (check) {
                    handleSendMail(values.username, values.email);
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
                      placeholder="Email"
                      id="email"
                      type="text"
                      value={values.email}
                      handleChange={handleChange}
                      validate={{}}
                      height={50}
                      errors={errors.email}
                      maxLength={50}
                    />
                    <button
                      className="pageLogin--container__form__btnSubmit"
                      type="submit"
                      onClick={handleSubmit}
                    >
                      <div className="pageLogin--container__form__btnSubmit__box">
                        <span>{loading ? "Đang gửi" : "Gửi"}</span>
                        {loading && <Loading />}
                      </div>
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
