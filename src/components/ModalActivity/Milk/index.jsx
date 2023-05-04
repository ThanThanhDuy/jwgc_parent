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
import activityService from "../../../services/activity";

import { DatePicker, Segmented, TimePicker } from "antd";
import { UilArrowRight } from "@iconscout/react-unicons";
import dayjs from "dayjs";
import { reloadState } from "../../../stores/activity";

const marks2 = {
  0: "0ml",
  50: "50ml",
  100: "100ml",
  150: "150ml",
  200: "200ml",
  250: "250ml",
  300: "300ml",
  350: "350ml",
};

const formatDay = "DD-MM-YYYY";

function Milk({
  open,
  activitySelect,
  color,
  cateCode,
  typeApi,
  itemSelected,
}) {
  const [type, setType] = useState("Vắt sữa");
  const [sliderValue3, setSliderValue3] = useState(0);
  const [sliderValue2, setSliderValue2] = useState(0);
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
  const [file, setFile] = useState(null);
  const [avatar, setAvatar] = useState("");

  const setopenModalActivitySelect = useSetRecoilState(
    openModalActivitySelectState
  );
  const setActivitySelect = useSetRecoilState(activitySelectState);
  const childSelect = useRecoilValue(childSelectState);
  const [reload, setReload] = useRecoilState(reloadState);

  useEffect(() => {
    setType(itemSelected?.Data.type ? itemSelected?.Data.type : "Vắt sữa");
    setTimeStart(itemSelected?.Data.timeStart);
    setTimeFinish(itemSelected?.Data.timeFinish);
    setDate(itemSelected?.Data.date);
    setNote(itemSelected?.Data.note);
    if (itemSelected?.Data.type === "Vắt sữa") {
      setSliderValue3(itemSelected?.Data.right);
      setSliderValue2(itemSelected?.Data.left);
    }
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
    data.type = type;
    data.note = note;
    data.date = date;
    data.timeStart = timeStart;
    data.timeFinish = timeFinish;
    switch (type) {
      case "Vắt sữa":
        data.left = sliderValue2;
        data.right = sliderValue3;
        data.unit = "ml";
        break;
      case "Trữ sữa":
        data.left = sliderValue2;
        data.right = sliderValue3;
        data.unit = "ml";
        break;
      default:
        break;
    }
    let res;
    if (typeApi !== "update") {
      res = await activityService.recordActivity(
        cateCode,
        childSelect.Code,
        `${date} ${timeStart}`,
        data,
        file
      );
    } else {
      res = await activityService.updateActivity(
        itemSelected.Code,
        `${date} ${timeStart}`,
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
    setStatusModal(null);
    setActivitySelect("");
  };
  const onChangeSegmented = (value) => {
    const el = document.querySelectorAll(
      ".containerModal__box__milk__control .ant-segmented-item"
    );
    if (value === "Vắt sữa") {
      el[0].style.color = "#fff";
      el[1].style.color = "#282828";
    } else if (value === "Trữ sữa") {
      el[1].style.color = "#fff";
      el[0].style.color = "#282828";
    }
    setType(value);
  };

  const onChangeSlider3 = (newValue) => {
    setSliderValue3(newValue);
  };

  const onChangeSlider2 = (newValue) => {
    setSliderValue2(newValue);
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

  const handleFileSelected = (e) => {
    const file = e.target.files[0];
    setFile(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setAvatar(reader.result);
    };
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
        className="containerModal__milk"
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
          <div className="containerModal__box__milk">
            {/* <RangePicker
              showTime
              placeholder={["Thời gian bắt đầu", "Thời gian kết thúc"]}
              style={{ width: "100%", height: "40px" }}
              locale={locale}
              onChange={onChangeDate}
              status={statusDate}
              onOpenChange={() => setStatusDate("")}
            />
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
            )} */}
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
                  disabledDate={(current) => {
                    return current && current > dayjs().endOf("day");
                  }}
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
            <div className="containerModal__box__milk__control">
              {/* {typeApi !== "update" && (
                <Segmented
                  block
                  options={["Vắt sữa", "Trữ sữa"]}
                  onChange={onChangeSegmented}
                />
              )} */}

              <div className="containerModal__box__milk__control__content">
                {type === "Vắt sữa" && (
                  <div className="containerModal__box__milk__control__content__box">
                    <Row className="containerModal__box__milk__control__content__box__item">
                      <Col span={12}>Số lượng</Col>
                      <Col
                        className="containerModal__box__milk__control__content__box__item__unit"
                        span={12}
                      >
                        {sliderValue2 + sliderValue3}ml
                      </Col>
                    </Row>
                    <div
                      className="divider-10"
                      style={{ margin: "16px 0" }}
                    ></div>
                    <Row
                      className="containerModal__box__milk__control__content__box__item"
                      style={{ marginTop: "16px" }}
                    >
                      <Col span={12}>Trái</Col>
                      <Col
                        className="containerModal__box__milk__control__content__box__item__unit"
                        span={12}
                      >
                        {sliderValue2}ml
                      </Col>
                      <Slider
                        min={0}
                        max={350}
                        step={5}
                        style={{ width: "100%" }}
                        marks={marks2}
                        value={sliderValue2}
                        onChange={onChangeSlider2}
                      />
                    </Row>
                    <div
                      className="divider-10"
                      style={{ margin: "16px 0" }}
                    ></div>
                    <Row
                      className="containerModal__box__milk__control__content__box__item"
                      style={{ marginTop: "16px" }}
                    >
                      <Col span={12}>Phải</Col>
                      <Col
                        className="containerModal__box__milk__control__content__box__item__unit"
                        span={12}
                      >
                        {sliderValue3}ml
                      </Col>
                      <Slider
                        min={0}
                        max={350}
                        step={5}
                        style={{ width: "100%" }}
                        marks={marks2}
                        value={sliderValue3}
                        onChange={onChangeSlider3}
                      />
                    </Row>
                  </div>
                )}
              </div>
            </div>
            <div className="containerModal__box__milk__textarea">
              <TextareaAutosize
                placeholder="Ghi chú (không bắt buộc)"
                className="containerModal__box__milk__textarea__input__box"
                minRows={5}
                onChange={onChangeTextArea}
                value={note}
              />
            </div>
            <div>
              <div
                className="updateprofile__container__box__main__user__avatar"
                id="avatar"
              >
                <img src={avatar} alt="" />
                <div className="updateprofile__container__box__main__user__avatar__input">
                  <input
                    onChange={handleFileSelected}
                    type="file"
                    accept="image/png, image/jpeg"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        {statusModal !== null && (
          <Result
            className="containerModal__result__milk"
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

export default Milk;
