import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Formik } from "formik";
import { Form } from "reactstrap";
import InputField from "../../components/InputField/index";
import { useNavigate } from "react-router-dom";
import "./index.scss";
import Loading from "../../components/Loading";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../constants/commons";

function ResetPassword() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const params = useParams();

  const handleResetPassword = async (newpassword, renewpassword) => {
    if (newpassword === renewpassword) {
      setLoading(true);
      try {
        const res = await axios.put(
          `${BASE_URL}users/email/password/${params.token}`,
          {
            NewPassword: newpassword,
          }
        );
        if (res.data && res.data.StatusCode === 200) {
          setTimeout(() => {
            setErrors([]);
            navigate("/success-reset-password");
            setLoading(false);
          }, 1000);
        } else {
          setTimeout(() => {
            setLoading(false);
            setErrors([res.Message]);
          }, 1000);
        }
      } catch (error) {
        setTimeout(() => {
          setLoading(false);
          setErrors([error.response.data.Message]);
        }, 1000);
      }
    } else {
      setErrors(["Mật khẩu không trùng khớp"]);
    }
  };

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Đặt lại mật khẩu</title>
      </Helmet>
      <div className="pageLogin">
        <div className="pageLogin--title">
          <p className="pageLogin--title__hightLabel">Đặt lại mật khẩu</p>
          <span className="pageLogin--title__lowLabel">
            Bạn vui lòng nhập một mật khẩu mới vào ô bên cạnh.
            <br /> Chúng tôi sẽ tiến hành đặt lại mật khẩu mới cho bạn.
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
                  newpassword: "",
                  renewpassword: "",
                }}
                onSubmit={(values, { setErrors }) => {
                  let check = true;
                  let errors = {};
                  if (!values.newpassword) {
                    errors.newpassword = "Mật khẩu mới không thể để trống";
                    check = false;
                  }
                  if (!values.renewpassword) {
                    errors.renewpassword =
                      "Nhập lại mật khẩu không thể để trống";
                    check = false;
                  } else if (values.renewpassword !== values.newpassword) {
                    errors.renewpassword = "Mật khẩu không khớp";
                    check = false;
                  }
                  setErrors(errors);
                  if (check) {
                    handleResetPassword(
                      values.newpassword,
                      values.renewpassword
                    );
                  }
                }}
              >
                {({ values, errors, handleChange, handleSubmit }) => (
                  <Form>
                    <InputField
                      placeholder="Mật khẩu mới"
                      id="newpassword"
                      type="password"
                      value={values.newpassword}
                      handleChange={handleChange}
                      validate={{}}
                      height={50}
                      errors={errors.newpassword}
                      maxLength={20}
                    />
                    <InputField
                      placeholder="Nhập lại mật khẩu mới"
                      id="renewpassword"
                      type="password"
                      value={values.renewpassword}
                      handleChange={handleChange}
                      validate={{}}
                      height={50}
                      errors={errors.renewpassword}
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

export default ResetPassword;
