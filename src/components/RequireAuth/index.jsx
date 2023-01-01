import React from "react";
import { Modal } from "antd";
import { useRecoilState } from "recoil";
import { isOpenModalRequireAuthState } from "../../stores/auth";

function RequireAuth() {
  const [isOpenModalRequireAuth, setIsOpenModalRequireAuth] = useRecoilState(
    isOpenModalRequireAuthState
  );
  const handleCancel = () => {
    setIsOpenModalRequireAuth(false);
  };

  return (
    <Modal
      title="Basic Modal"
      open={isOpenModalRequireAuth}
      onCancel={handleCancel}
      footer={null}
    >
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </Modal>
  );
}

export default RequireAuth;
