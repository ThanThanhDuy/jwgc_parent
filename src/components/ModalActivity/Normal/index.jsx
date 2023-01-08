import React from "react";
import "./index.scss";
import { Modal } from "antd";
import { useSetRecoilState } from "recoil";
import {
  activitySelectState,
  openModalActivitySelectState,
} from "../../../stores/child";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import "dayjs/locale/vi";
import locale from "antd/es/date-picker/locale/vi_VN";

import { DatePicker } from "antd";
const { RangePicker } = DatePicker;

function ModalNormal({ open, activitySelect }) {
  const setopenModalActivitySelect = useSetRecoilState(
    openModalActivitySelectState
  );
  const setActivitySelect = useSetRecoilState(activitySelectState);
  const handleOk = () => {};

  const handleCancel = () => {
    setopenModalActivitySelect(false);
    setActivitySelect("");
  };

  return (
    <Modal
      title={activitySelect}
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Lưu"
      cancelText="Hủy"
    >
      <div className="containerModal">
        <RangePicker
          showTime
          placeholder={["Thời gian bắt đầu", "Thời gian kết thúc"]}
          style={{ width: "100%", height: "40px" }}
          locale={locale}
        />
        <div className="containerModal__textarea">
          <TextareaAutosize
            placeholder="Ghi chú"
            className="containerModal__textarea__input"
            minRows={5}
          />
        </div>
      </div>
    </Modal>
  );
}

export default ModalNormal;
