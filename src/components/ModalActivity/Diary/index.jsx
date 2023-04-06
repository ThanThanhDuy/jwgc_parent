import React, { useEffect, useState } from "react";
import "./index.scss";
import {
  Row,
  Col,
  ConfigProvider,
  Modal,
  Slider,
  Result,
  Button,
  notification,
} from "antd";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  activitySelectState,
  childSelectState,
  openModalActivitySelectState,
} from "../../../stores/child";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import "dayjs/locale/vi";
import locale from "antd/es/date-picker/locale/vi_VN";

import { DatePicker, TimePicker } from "antd";
import activityService from "../../../services/activity";
import { itemSelectedState, reloadState } from "../../../stores/activity";
import dayjs from "dayjs";

function Diary({
  open,
  activitySelect,
  color,
  cateCode,
  typeApi,
  itemSelected,
}) {
  const [date, setDate] = useState(null);
  const [note, setNote] = useState("");
  const [statusDate, setStatusDate] = useState("");
  const [statusModal, setStatusModal] = useState(null);
  const [error, setError] = useState("");
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [confirmLoadingDelete, setConfirmLoadingDelete] = useState(false);
  const [reload, setReload] = useRecoilState(reloadState);
  const setItemSelected = useSetRecoilState(itemSelectedState);

  const setopenModalActivitySelect = useSetRecoilState(
    openModalActivitySelectState
  );
  const setActivitySelect = useSetRecoilState(activitySelectState);
  const childSelect = useRecoilValue(childSelectState);

  useEffect(() => {
    console.log(itemSelected);
    setDate(itemSelected?.Data.date);
    setNote(itemSelected?.Data.note);
    setImage(itemSelected?.FilePath);
  }, [itemSelected]);

  const handleOk = async () => {
    setConfirmLoading(true);
    let check = true;
    if (date === null) {
      setStatusDate("error");
      setConfirmLoading(false);
      check = false;
    }
    if (!check) {
      return;
    }
    const data = {};
    data.note = note;
    data.date = date;

    let res;
    if (typeApi !== "update") {
      res = await activityService.recordActivity(
        cateCode,
        childSelect.Code,
        date,
        data,
        file
      );
    } else {
      res = await activityService.updateActivity(
        itemSelected.Code,
        date,
        data,
        file
      );
    }
    if (res && res.StatusCode === 200) {
      setStatusModal("success");
      setReload(!reload);
    } else {
      setStatusModal("error");
      setError(res.Message);
    }
    setConfirmLoading(false);
  };

  const handleCancel = () => {
    setopenModalActivitySelect(false);
    setImage(null);
    setFile(null);
    setDate(null);
    setActivitySelect("");
    setItemSelected("");
  };

  const onChangeDate = (date, dateString) => {
    setStatusDate("");
    setDate(dateString);
  };

  const onChangeTextArea = (e) => {
    setNote(e.target.value);
  };

  const handleFileSelected = (e) => {
    const file = e.target.files[0];
    setFile(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImage(reader.result);
    };
  };

  const handleDelete = async () => {
    setConfirmLoadingDelete(true);
    const res = await activityService.deleteActivity(itemSelected.Code);
    if (res && res.StatusCode === 200) {
      handleCancel();
      setReload(!reload);
      notification.success({
        message: "Xóa thành công",
        description: res.Message,
      });
    } else {
      setError(res.Message);
      notification.error({
        message: "Xóa thất bại",
        description: res.Message,
      });
    }
    setConfirmLoadingDelete(false);
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: color,
        },
      }}
    >
      <Modal
        className="containerModal__diary"
        title={activitySelect}
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Lưu"
        cancelText="Hủy"
        confirmLoading={confirmLoading}
        footer={
          statusModal === null
            ? typeApi === "update"
              ? [
                  <Button key="back" onClick={handleCancel}>
                    Hủy
                  </Button>,
                  <Button
                    danger
                    loading={confirmLoadingDelete}
                    onClick={handleDelete}
                  >
                    Xóa
                  </Button>,
                  <Button
                    key="submit"
                    type="primary"
                    loading={confirmLoading}
                    onClick={handleOk}
                  >
                    Lưu
                  </Button>,
                ]
              : [
                  <Button key="back" onClick={handleCancel}>
                    Hủy
                  </Button>,
                  <Button
                    key="submit"
                    type="primary"
                    loading={confirmLoading}
                    onClick={handleOk}
                  >
                    Lưu
                  </Button>,
                ]
            : null
        }
      >
        {statusModal === null && (
          <div className="containerModal__box__diary">
            <Row>
              <Col span={24}>
                <DatePicker
                  showTime
                  locale={locale}
                  style={{ width: "100%", height: "40px" }}
                  placeholder="Chọn thời gian"
                  onChange={onChangeDate}
                  status={statusDate}
                  format="DD-MM-YYYY HH:mm:ss"
                  value={date ? dayjs(date, "DD-MM-YYYY HH:mm:ss") : null}
                />
              </Col>
            </Row>
            {statusDate === "error" && (
              <p
                style={{
                  marginTop: "5px",
                  marginLeft: "5px",
                  color: "#ff4d4f",
                }}
              >
                Vui lòng chọn thời gian
              </p>
            )}
            <Row>
              <Col span={24}>
                <div
                  style={{ width: "100%" }}
                  className="containerModal__box__diary__image"
                  id="avatar"
                >
                  {image && <img src={image} alt="" />}
                  <div className="updateprofile__container__box__main__user__avatar__input">
                    <input
                      onChange={handleFileSelected}
                      type="file"
                      accept="image/png, image/jpeg"
                    />
                  </div>
                </div>
              </Col>
            </Row>
            <div className="containerModal__box__diary__textarea">
              <TextareaAutosize
                placeholder="Ghi chú (không bắt buộc)"
                className="containerModal__box__diary__textarea__input__box"
                minRows={5}
                onChange={onChangeTextArea}
                value={note}
              />
            </div>
          </div>
        )}
        {statusModal !== null && (
          <Result
            className="containerModal__result__diary"
            status={statusModal}
            title={`${
              typeApi === "update" ? "Cập nhật" : "Ghi lại"
            } hành trình cho trẻ ${
              statusModal === "success" ? "thành công" : "thất bại"
            }`}
            subTitle={error}
            extra={[
              <Button
                onClick={() => {
                  setStatusModal(null);
                }}
                color={color}
                type="primary"
                key="console"
              >
                {statusModal === "success" ? "Tiếp tục" : "Thử lại"}
              </Button>,
              <Button onClick={handleCancel}>Thoát</Button>,
            ]}
          />
        )}
      </Modal>
    </ConfigProvider>
  );
}

export default Diary;
