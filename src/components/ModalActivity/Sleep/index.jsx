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
import dayjs from "dayjs";
import activityService from "../../../services/activity";
import { UilArrowRight } from "@iconscout/react-unicons";
import { reloadState } from "../../../stores/activity";

const formatDay = "DD-MM-YYYY";

function Sleep({
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
  const [statusTimeStart, setStatusTimeStart] = useState("");
  const [statusTimeFinish, setStatusTimeFinish] = useState("");
  const [statusModal, setStatusModal] = useState(null);
  const [error, setError] = useState("");
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [confirmLoadingDelete, setConfirmLoadingDelete] = useState(false);
  const [timeStart, setTimeStart] = useState(null);
  const [timeFinish, setTimeFinish] = useState(null);
  const [errorTimeFinish, setErrorTimeFinish] = useState("");
  const [reload, setReload] = useRecoilState(reloadState);

  const setopenModalActivitySelect = useSetRecoilState(
    openModalActivitySelectState
  );
  const setActivitySelect = useSetRecoilState(activitySelectState);
  const childSelect = useRecoilValue(childSelectState);

  useEffect(() => {
    setTimeStart(itemSelected?.Data.timeStart);
    setTimeFinish(itemSelected?.Data.timeFinish);
    setDate(itemSelected?.Data.date);
    setNote(itemSelected?.Data.note);
  }, [itemSelected]);

  const handleOk = async () => {
    setConfirmLoading(true);
    let check = true;
    if (date === null) {
      setStatusDate("error");
      setConfirmLoading(false);
      check = false;
    }
    if (timeStart === null) {
      setStatusTimeStart("error");
      setConfirmLoading(false);
      check = false;
    }
    if (timeFinish === null) {
      setStatusTimeFinish("error");
      setErrorTimeFinish("Vui lòng chọn thời gian");
      setConfirmLoading(false);
      check = false;
    }
    if (timeFinish && timeStart) {
      if (
        dayjs(timeFinish, "HH:mm:ss").isBefore(dayjs(timeStart, "HH:mm:ss"))
      ) {
        setStatusTimeFinish("error");
        setErrorTimeFinish("Thời gian kết thúc phải sau thời gian bắt đầu");
        setConfirmLoading(false);
        check = false;
      }
    }
    if (!check) {
      return;
    }
    const data = {};
    data.note = note;
    data.date = date;
    data.timeStart = timeStart;
    data.timeFinish = timeFinish;
    let res;
    if (typeApi !== "update") {
      res = await activityService.recordActivity(
        cateCode,
        childSelect.Code,
        `${date} ${timeStart}`,
        data,
        null
      );
    } else {
      res = await activityService.updateActivity(
        itemSelected.Code,
        `${date} ${timeStart}`,
        data,
        null
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
    setActivitySelect("");
  };

  const onChangeDate = (date, dateString) => {
    setStatusDate("");
    setDate(dateString);
  };

  const onChangeTimeStart = (time, timeString) => {
    setStatusTimeStart("");
    setTimeStart(timeString);
  };

  const onChangeTimeFinish = (time, timeString) => {
    setStatusTimeFinish("");
    setTimeFinish(timeString);
  };

  const onChangeTextArea = (e) => {
    setNote(e.target.value);
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
        className="containerModal__sleep"
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
          <div className="containerModal__box__sleep">
            <Row>
              <Col span={8}>
                <DatePicker
                  locale={locale}
                  style={{ width: "100%", height: "40px" }}
                  placeholder="Chọn ngày"
                  onChange={onChangeDate}
                  status={statusDate}
                  format="DD-MM-YYYY"
                  value={date ? dayjs(date, formatDay) : null}
                />
              </Col>
              <Col span={6} offset={2}>
                <TimePicker
                  locale={locale}
                  style={{ width: "100%", height: "40px" }}
                  placeholder="Chọn giờ bắt đầu"
                  onChange={onChangeTimeStart}
                  status={statusTimeStart}
                  value={timeStart ? dayjs(timeStart, "HH:mm:ss") : null}
                />
              </Col>
              <Col
                span={2}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <UilArrowRight />
              </Col>
              <Col span={6}>
                <TimePicker
                  locale={locale}
                  style={{ width: "100%", height: "40px" }}
                  placeholder="Chọn giờ kết thúc"
                  onChange={onChangeTimeFinish}
                  status={statusTimeFinish}
                  value={timeFinish ? dayjs(timeFinish, "HH:mm:ss") : null}
                />
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                {statusDate === "error" && (
                  <p
                    style={{
                      marginTop: "5px",
                      marginLeft: "5px",
                      color: "#ff4d4f",
                    }}
                  >
                    Vui lòng chọn ngày
                  </p>
                )}
              </Col>
              <Col span={6} offset={2}>
                {statusTimeStart === "error" && (
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
              </Col>
              <Col
                span={2}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              ></Col>
              <Col span={6}>
                {statusTimeFinish === "error" && (
                  <p
                    style={{
                      marginTop: "5px",
                      marginLeft: "5px",
                      color: "#ff4d4f",
                    }}
                  >
                    {errorTimeFinish}
                  </p>
                )}
              </Col>
            </Row>

            <div className="containerModal__box__sleep__textarea">
              <TextareaAutosize
                placeholder="Ghi chú (không bắt buộc)"
                className="containerModal__box__sleep__textarea__input__box"
                minRows={5}
                onChange={onChangeTextArea}
                value={note}
              />
            </div>
          </div>
        )}
        {statusModal !== null && (
          <Result
            className="containerModal__result__sleep"
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

export default Sleep;
