import React from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import "./index.scss";

function SuccessPageResetPassword() {
  const navigate = useNavigate();

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Đặt lại mật khẩu thành công</title>
      </Helmet>
      <div className="resetpassword__success">
        <div className="resetpassword__success__title">
          <span>Đặt lại mật khẩu thành công</span>
        </div>
        <div className="resetpassword__success__content">
          <span>
            Mật khẩu của bạn đã được đặt lại thành công. Vui lòng đăng nhập nhập
            lại hoặc quay lại trang chủ.
          </span>
        </div>
        <div className="resetpassword__success__control">
          <div>
            <button
              onClick={() => {
                navigate("/home");
              }}
              className="jwgc__btn__primary"
            >
              Trang chủ
            </button>
          </div>
          <div>
            <button
              onClick={() => {
                navigate("/login");
              }}
              className="jwgc__btn__outline"
            >
              Đăng nhập
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuccessPageResetPassword;
