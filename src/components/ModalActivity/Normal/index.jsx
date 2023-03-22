import React, { useEffect, useState } from "react";
import "./index.scss";
import {
  Row,
  Col,
  Select,
  ConfigProvider,
  Modal,
  Slider,
  Button,
  Result,
  notification,
} from "antd";
import { useSetRecoilState, useRecoilValue, useRecoilState } from "recoil";
import {
  activitySelectState,
  childSelectState,
  openModalActivitySelectState,
} from "../../../stores/child";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import "dayjs/locale/vi";
import locale from "antd/es/date-picker/locale/vi_VN";

import { DatePicker, Segmented, TimePicker } from "antd";
import activityService from "../../../services/activity";
import { UilArrowRight } from "@iconscout/react-unicons";
import dayjs from "dayjs";
import { reloadState } from "../../../stores/activity";

const marks3 = {
  0: "0g",
  50: "50g",
  100: "100g",
  150: "150g",
  200: "200g",
  250: "250g",
  300: "300g",
  350: "350g",
};

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

const options__3 = [
  {
    label: `Rau củ`,
    value: `Rau củ`,
  },
  {
    label: `Trái cây`,
    value: `Trái cây`,
  },
  {
    label: `Sản phẩm từ sữa`,
    value: `Sản phẩm từ sữa`,
  },
  {
    label: `Ngũ cốc`,
    value: `Ngũ cốc`,
  },
  {
    label: `Thịt & đạm`,
    value: `Thịt & đạm`,
  },
  {
    label: `Thực phẩm bổ sung`,
    value: `Thực phẩm bổ sung`,
  },
  {
    label: `Khác`,
    value: `Khác`,
  },
];

const options__2 = [
  {
    label: `Sữa mẹ`,
    value: `Sữa mẹ`,
  },
  {
    label: `Công thức`,
    value: `Công thức`,
  },
  {
    label: `Khác`,
    value: `Khác`,
  },
];

const formatDay = "DD-MM-YYYY";

function ModalNormal({
  open,
  activitySelect,
  color,
  cateCode,
  typeApi,
  itemSelected,
}) {
  const [type, setType] = useState("Sữa mẹ");
  const [value__3, setValue__3] = useState([]);
  const [value__2, setValue__2] = useState(null);
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
  const [reload, setReload] = useRecoilState(reloadState);

  const setopenModalActivitySelect = useSetRecoilState(
    openModalActivitySelectState
  );
  const setActivitySelect = useSetRecoilState(activitySelectState);
  const childSelect = useRecoilValue(childSelectState);

  useEffect(() => {
    setType(itemSelected?.Data.type ? itemSelected?.Data.type : "Sữa mẹ");
    setTimeStart(itemSelected?.Data.timeStart);
    setTimeFinish(itemSelected?.Data.timeFinish);
    setDate(itemSelected?.Data.date);
    setNote(itemSelected?.Data.note);
    if (itemSelected?.Data.type === "Sữa bình") {
      setValue__2(itemSelected?.Data.material);
      setSliderValue2(itemSelected?.Data.amount);
    } else if (itemSelected?.Data.type === "Ăn dặm") {
      setValue__3(itemSelected?.Data.material);
      setSliderValue3(itemSelected?.Data.amount);
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
      case "Sữa bình":
        data.material = value__2;
        data.amount = sliderValue2;
        data.unit = "ml";
        break;
      case "Ăn dặm":
        data.material = value__3;
        data.amount = sliderValue3;
        data.unit = "g";
        break;
      default:
        data.material = null;
        data.amount = 0;
        data.unit = null;
        break;
    }
    // console.log(cateCode, childSelect.Code, date[0], data, null);
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
    setStatusModal(null);
  };
  const onChangeSegmented = (value) => {
    const el = document.querySelectorAll(
      ".containerModal__control .ant-segmented-item"
    );
    if (value === "Sữa mẹ") {
      el[0].style.color = "#fff";
      el[1].style.color = "#282828";
      el[2].style.color = "#282828";
      el[3].style.color = "#282828";
    } else if (value === "Sữa bình") {
      el[1].style.color = "#fff";
      el[0].style.color = "#282828";
      el[2].style.color = "#282828";
      el[3].style.color = "#282828";
    } else if (value === "Ăn dặm") {
      el[2].style.color = "#fff";
      el[0].style.color = "#282828";
      el[1].style.color = "#282828";
      el[3].style.color = "#282828";
    } else if (value === "Khác") {
      el[3].style.color = "#fff";
      el[0].style.color = "#282828";
      el[1].style.color = "#282828";
      el[2].style.color = "#282828";
    }
    setType(value);
  };

  const selectProps__3 = {
    mode: "multiple",
    style: {
      width: "100%",
    },
    value: value__3,
    options: options__3,
    onChange: (newValue) => {
      setValue__3(newValue);
    },
    placeholder: "Chọn",
    maxTagCount: "responsive",
  };

  const onChangeSlider3 = (newValue) => {
    setSliderValue3(newValue);
  };

  const onChangeSlider2 = (newValue) => {
    setSliderValue2(newValue);
  };

  const handleChange2 = (value) => {
    setValue__2(value);
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
        confirmLoading={confirmLoading}
        className="containerModal__eat"
        title={activitySelect}
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Lưu"
        cancelText="Hủy"
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
          <div className="containerModal">
            {/* <RangePicker
              showTime
              placeholder={["Thời gian bắt đầu", "Thời gian kết thúc"]}
              style={{ width: "100%", height: "40px" }}
              locale={locale}
              onChange={onChangeDate}
              status={statusDate}
              onOpenChange={() => setStatusDate("")}
            /> */}
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

            <div className="containerModal__control">
              {typeApi !== "update" && (
                <Segmented
                  value={type}
                  block
                  options={["Sữa mẹ", "Sữa bình", "Ăn dặm", "Khác"]}
                  onChange={onChangeSegmented}
                />
              )}
              <div className="containerModal__control__content">
                {type === "Sữa bình" && (
                  <div className="containerModal__control__content__box">
                    <Row className="containerModal__control__content__box__item">
                      <Col span={8}>Nguyên liệu</Col>
                      <Col
                        span={16}
                        style={{
                          width: "100%",
                        }}
                      >
                        <Select
                          placeholder="Chọn"
                          style={{
                            width: "100%",
                          }}
                          onChange={handleChange2}
                          options={options__2}
                          value={value__2}
                        />
                      </Col>
                    </Row>
                    <div
                      className="divider-10"
                      style={{ margin: "16px 0" }}
                    ></div>
                    <Row
                      className="containerModal__control__content__box__item"
                      style={{ marginTop: "16px" }}
                    >
                      <Col span={12}>Số lượng</Col>
                      <Col
                        className="containerModal__control__content__box__item__unit"
                        span={12}
                      >
                        {sliderValue2}ml
                      </Col>
                    </Row>
                    <Row
                      className="containerModal__control__content__box__item"
                      style={{ marginTop: "16px" }}
                    >
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
                  </div>
                )}
                {type === "Ăn dặm" && (
                  <div className="containerModal__control__content__box">
                    <Row className="containerModal__control__content__box__item">
                      <Col span={8}>Nguyên liệu</Col>
                      <Col span={16}>
                        <Select {...selectProps__3} />
                      </Col>
                    </Row>
                    <div
                      className="divider-10"
                      style={{ margin: "16px 0" }}
                    ></div>
                    <Row
                      className="containerModal__control__content__box__item"
                      style={{ marginTop: "16px" }}
                    >
                      <Col span={12}>Số lượng</Col>
                      <Col
                        className="containerModal__control__content__box__item__unit"
                        span={12}
                      >
                        {sliderValue3}g
                      </Col>
                    </Row>

                    <Row
                      className="containerModal__control__content__box__item"
                      style={{ marginTop: "16px" }}
                    >
                      <Slider
                        min={0}
                        max={350}
                        step={5}
                        style={{ width: "100%" }}
                        marks={marks3}
                        value={sliderValue3}
                        onChange={onChangeSlider3}
                      />
                    </Row>
                  </div>
                )}
              </div>
            </div>
            <div className="containerModal__textarea">
              <TextareaAutosize
                placeholder="Ghi chú (không bắt buộc)"
                className="containerModal__textarea__input__box"
                minRows={5}
                onChange={onChangeTextArea}
                value={note}
              />
            </div>
          </div>
        )}
        {statusModal !== null && (
          <Result
            className="containerModal__result"
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

export default ModalNormal;
