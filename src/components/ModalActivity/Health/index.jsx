import React, { useEffect, useState } from "react";
import "./index.scss";
import {
  Row,
  Col,
  ConfigProvider,
  Modal,
  Slider,
  Input,
  Select,
  InputNumber,
  Result,
  Button,
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
import {
  LIST_SYMPTOM,
  LIST_VACCINE_CHILD,
  VACCINE,
} from "../../../constants/activity";

import { DatePicker, Segmented } from "antd";
import activityService from "../../../services/activity";
import { reloadState } from "../../../stores/activity";
import moment from "moment";
import dayjs from "dayjs";
const { RangePicker } = DatePicker;

const marks2 = {
  34: "34",
  35: "35",
  36: "36",
  37: "37",
  38: "38",
  39: "39",
  40: "40",
  41: "41",
  42: "42",
};

const marks__status = {
  0: "Không",
  1: "Nhẹ",
  2: "Vừa phải",
  3: "Nặng",
};

const options__2 = [
  {
    label: `ml`,
    value: `ml`,
  },
  {
    label: `oz`,
    value: `oz`,
  },
  {
    label: `mcg`,
    value: `mcg`,
  },
  {
    label: `mg`,
    value: `mg`,
  },
  {
    label: `gram`,
    value: `gram`,
  },
  {
    label: `Thìa cà phê`,
    value: `Thìa cà phê`,
  },
  {
    label: `Thìa canh`,
    value: `Thìa canh`,
  },
  {
    label: `Giọt`,
    value: `Giọt`,
  },
  {
    label: `Gói`,
    value: `Gói`,
  },
  {
    label: `Viên nén`,
    value: `Viên nén`,
  },
  {
    label: `Viên con nhộng`,
    value: `Viên con nhộng`,
  },
];

const options__guide = [
  {
    label: `Không`,
    value: `Không`,
  },
  {
    label: `Trước khi ăn`,
    value: `Trước khi ăn`,
  },
  {
    label: `Cùng bữa ăn`,
    value: `Cùng bữa ăn`,
  },
  {
    label: `Sau khi ăn`,
    value: `Sau khi ăn`,
  },
];

function Health({
  open,
  activitySelect,
  color,
  cateCode,
  typeApi,
  itemSelected,
}) {
  const [type, setType] = useState("Nhiệt độ");
  const [medicine, setMedicine] = useState("");
  const [amount, setAmount] = useState(0);
  const [sliderValue2, setSliderValue2] = useState(36.8);
  const [sliderValueStatus, setSliderValueStatus] = useState(0);
  const [date, setDate] = useState(null);
  const [note, setNote] = useState("");
  const [statusDate, setStatusDate] = useState("");
  const [statusMedicine, setStatusMedicine] = useState("");
  const [statusVaccine, setStatusVaccine] = useState("");
  const [unit, setUnit] = useState("ml");
  const [guide, setGuide] = useState("Không");
  const [symptom, setSymptom] = useState("Không triệu chứng");
  const [vaccine, setVaccine] = useState(null);
  const [statusModal, setStatusModal] = useState(null);
  const [error, setError] = useState("");
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [confirmLoadingDelete, setConfirmLoadingDelete] = useState(false);
  const [reload, setReload] = useRecoilState(reloadState);
  const [file, setFile] = useState(null);
  const [avatar, setAvatar] = useState("");

  const setopenModalActivitySelect = useSetRecoilState(
    openModalActivitySelectState
  );
  const setActivitySelect = useSetRecoilState(activitySelectState);
  const childSelect = useRecoilValue(childSelectState);

  useEffect(() => {
    setType(itemSelected?.Data.type ? itemSelected?.Data.type : "Nhiệt độ");
    setDate(itemSelected?.Data.date);
    console.log(itemSelected?.Data.date);
    setNote(itemSelected?.Data.note);
    if (itemSelected?.Data.type === "Nhiệt độ") {
      setSliderValue2(itemSelected?.Data.temperature);
    } else if (itemSelected?.Data.type === "Triệu chứng") {
      setSymptom(itemSelected?.Data.symptom);
      setSliderValueStatus(itemSelected?.Data.status);
    } else if (itemSelected?.Data.type === "Tiêm chủng") {
      setVaccine(itemSelected?.Data.vaccine);
    } else if (itemSelected?.Data.type === "Thuốc") {
      setMedicine(itemSelected?.Data.medicine);
      setAmount(itemSelected?.Data.amount);
      setUnit(itemSelected?.Data.unit);
      setGuide(itemSelected?.Data.guide);
    }
  }, [itemSelected]);

  const handleOk = async () => {
    setConfirmLoading(true);
    if (date === null) {
      setStatusDate("error");
      setConfirmLoading(false);
      const el = document.querySelector(".ant-modal-wrap");
      el.scrollTop = 0;
      return;
    }
    const data = {};
    data.type = type;
    data.note = note;
    data.time = date;
    switch (type) {
      case "Nhiệt độ":
        data.temperature = sliderValue2;
        data.unit = "°C";
        break;
      case "Thuốc":
        if (!medicine) {
          setStatusMedicine("error");
          setConfirmLoading(false);
          return;
        }
        data.medicine = medicine;
        data.amount = amount;
        data.unit = unit;
        data.guide = guide;
        break;
      case "Triệu chứng":
        if (!medicine) {
          setStatusMedicine("error");
          setConfirmLoading(false);
          return;
        }
        data.symptom = symptom;
        data.status = sliderValueStatus;
        break;
      case "Vaccine":
        if (!vaccine) {
          setStatusVaccine("error");
          const el = document.querySelector(".ant-modal-wrap");
          el.scrollTop = 0;
          setConfirmLoading(false);
          return;
        }
        data.vaccine = vaccine;
        break;
      default:
        break;
    }
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
    setActivitySelect("");
  };
  const onChangeSegmented = (value) => {
    const el = document.querySelectorAll(
      ".containerModal__box__health__control .ant-segmented-item"
    );
    if (value === "Nhiệt độ") {
      el[0].style.color = "#fff";
      el[1].style.color = "#282828";
      el[2].style.color = "#282828";
      el[3].style.color = "#282828";
    } else if (value === "Thuốc") {
      el[0].style.color = "#282828";
      el[1].style.color = "#fff";
      el[2].style.color = "#282828";
      el[3].style.color = "#282828";
    } else if (value === "Triệu chứng") {
      el[0].style.color = "#282828";
      el[1].style.color = "#282828";
      el[2].style.color = "#fff";
      el[3].style.color = "#282828";
    } else {
      el[0].style.color = "#282828";
      el[1].style.color = "#282828";
      el[2].style.color = "#282828";
      el[3].style.color = "#fff";
    }
    setType(value);
  };

  const onChangeSlider2 = (newValue) => {
    setSliderValue2(newValue);
  };

  const onChangeSliderStatus = (newValue) => {
    setSliderValueStatus(newValue);
  };

  const onChangeDate = (date, dateString) => {
    setStatusDate("");
    setDate(dateString);
  };

  const onChangeTextArea = (e) => {
    setNote(e.target.value);
  };

  const handleChangeUnit = (value) => {
    setUnit(value);
  };

  const handleChangeGuide = (value) => {
    setGuide(value);
  };

  const handleChangeSymptom = (value) => {
    setSymptom(value);
  };

  const handleChangeVaccine = (value) => {
    setVaccine(value);
    setStatusVaccine("");
  };

  const handleDelete = async () => {
    setConfirmLoadingDelete(true);
    const res = await activityService.deleteActivity(itemSelected.Code);
    if (res && res.StatusCode === 200) {
      handleCancel();
      setReload(!reload);
    } else {
      setError(res.Message);
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
        className="containerModal__health"
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
          <div className="containerModal__box__health">
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
            <div className="containerModal__box__health__control">
              {typeApi !== "update" && (
                <Segmented
                  block
                  options={["Nhiệt độ", "Thuốc", "Triệu chứng", "Vaccine"]}
                  onChange={onChangeSegmented}
                />
              )}
              <div className="containerModal__box__health__control__content">
                {type === "Nhiệt độ" && (
                  <div className="containerModal__box__health__control__content__box">
                    <Row className="containerModal__box__health__control__content__box__item">
                      <Col span={12}>Nhiệt độ</Col>
                      <Col
                        className="containerModal__box__health__control__content__box__item__unit"
                        span={12}
                      >
                        {sliderValue2}°C
                      </Col>
                    </Row>

                    <Row
                      className="containerModal__box__health__control__content__box__item"
                      style={{ marginTop: "16px" }}
                    >
                      <Slider
                        min={34}
                        max={42}
                        step={0.1}
                        style={{ width: "100%" }}
                        marks={marks2}
                        value={sliderValue2}
                        onChange={onChangeSlider2}
                      />
                    </Row>
                  </div>
                )}
                {type === "Thuốc" && (
                  <div className="containerModal__box__health__control__content__box">
                    <Row className="containerModal__box__health__control__content__box__item">
                      <Col span={8}>Thuốc</Col>
                      <Col
                        className="containerModal__box__health__control__content__box__item__unit"
                        span={16}
                      >
                        <Input
                          placeholder="Nhập tên thuốc"
                          value={medicine}
                          onChange={(e) => setMedicine(e.target.value)}
                          status={statusMedicine}
                        />
                      </Col>
                    </Row>
                    {statusMedicine === "error" && (
                      <Row>
                        <Col span={16} offset={8}>
                          <p
                            style={{
                              marginTop: "5px",
                              marginLeft: "5px",
                              color: "#ff4d4f",
                              marginBottom: "0px",
                            }}
                          >
                            Vui lòng nhập tên thuốc
                          </p>
                        </Col>
                      </Row>
                    )}
                    <Row
                      className="containerModal__box__health__control__content__box__item"
                      style={{ marginTop: "16px" }}
                    >
                      <Col span={8}>Liều lượng</Col>
                      <Col span={7}>
                        <InputNumber
                          min={0}
                          max={1000}
                          style={{
                            width: "100%",
                          }}
                          placeholder="Nhập liều lượng"
                          value={amount}
                          onChange={(e) => setAmount(e)}
                        />
                      </Col>
                      <Col span={8} offset={1}>
                        <Select
                          defaultValue="ml"
                          style={{
                            width: "100%",
                          }}
                          onChange={handleChangeUnit}
                          options={options__2}
                          value={unit}
                        />
                      </Col>
                    </Row>
                    <Row
                      style={{ marginTop: "16px" }}
                      className="containerModal__box__health__control__content__box__item"
                    >
                      <Col span={8}>Hướng dẫn</Col>
                      <Col
                        className="containerModal__box__health__control__content__box__item__unit"
                        span={16}
                      >
                        <Select
                          defaultValue="Không"
                          style={{
                            width: "100%",
                          }}
                          onChange={handleChangeGuide}
                          options={options__guide}
                          value={guide}
                        />
                      </Col>
                    </Row>
                  </div>
                )}
                {type === "Triệu chứng" && (
                  <div className="containerModal__box__health__control__content__box">
                    <Row className="containerModal__box__health__control__content__box__item">
                      <Col span={8}>Triệu chứng</Col>
                      <Col
                        className="containerModal__box__health__control__content__box__item__unit"
                        span={16}
                      >
                        <Select
                          style={{ width: "100%" }}
                          showSearch
                          placeholder="Chọn triệu chứng"
                          filterOption={(input, option) =>
                            (option?.label ?? "")
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                          options={LIST_SYMPTOM}
                          value={symptom}
                          onChange={handleChangeSymptom}
                        />
                      </Col>
                    </Row>

                    <Row
                      className="containerModal__box__health__control__content__box__item"
                      style={{ marginTop: "16px" }}
                    >
                      <Col span={8}>Mức độ</Col>
                      <Col
                        className="containerModal__control__content__box__item__unit"
                        span={16}
                      >
                        {marks__status[sliderValueStatus]}
                      </Col>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          width: "100%",
                          marginTop: "16px",
                        }}
                      >
                        <Slider
                          min={0}
                          max={3}
                          step={1}
                          style={{ width: "80%" }}
                          marks={marks__status}
                          value={sliderValueStatus}
                          onChange={onChangeSliderStatus}
                        />
                      </div>
                    </Row>
                  </div>
                )}
                {type === "Vaccine" && (
                  <div className="containerModal__box__health__control__content__box">
                    <Row className="containerModal__box__health__control__content__box__item">
                      <Col span={8}>Vaccine</Col>
                      <Col
                        className="containerModal__box__health__control__content__box__item__unit"
                        span={16}
                      >
                        <Select
                          style={{ width: "100%" }}
                          showSearch
                          placeholder="Chọn vaccine"
                          filterOption={(input, option) =>
                            (option?.label ?? "")
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                          options={LIST_VACCINE_CHILD}
                          value={vaccine}
                          onChange={handleChangeVaccine}
                          status={statusVaccine}
                        />
                      </Col>
                    </Row>
                    {statusVaccine === "error" && (
                      <Row>
                        <Col span={16} offset={8}>
                          <p
                            style={{
                              marginTop: "5px",
                              marginLeft: "5px",
                              color: "#ff4d4f",
                              marginBottom: "0px",
                            }}
                          >
                            Vui lòng chọn vaccine
                          </p>
                        </Col>
                      </Row>
                    )}
                    <div className="divider-30"></div>
                    {VACCINE.map((item, index) => (
                      <Row
                        key={`d${index}`}
                        className="containerModal__box__health__control__content__box__item"
                      >
                        <Col
                          className="containerModal__box__health__control__content__box__item__title"
                          span={24}
                        >
                          {item.month}
                        </Col>
                        <Col
                          className="containerModal__box__health__control__content__box__item__title__note"
                          span={24}
                        >
                          {item.note}
                        </Col>
                        <Col span={24}>
                          {item.vaccine.map((item, index) => (
                            <div key={`e${index}`}>
                              <Row className="containerModal__box__health__control__content__box__item__content">
                                <Col
                                  className="containerModal__box__health__control__content__box__item__content__left"
                                  span={10}
                                >
                                  {item.name}
                                </Col>
                                <Col
                                  className="containerModal__box__health__control__content__box__item__content__right"
                                  span={12}
                                  offset={2}
                                >
                                  {item.note}
                                </Col>
                              </Row>
                              <div className="divider-10"></div>
                            </div>
                          ))}
                        </Col>
                      </Row>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="containerModal__box__health__textarea">
              <TextareaAutosize
                placeholder="Ghi chú (không bắt buộc)"
                className="containerModal__box__health__textarea__input__box"
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
            className="containerModal__result__health"
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

export default Health;
