import React, { useEffect, useState } from "react";
import "./index.scss";
import {
  Row,
  Col,
  ConfigProvider,
  Modal,
  Rate,
  Button,
  Result,
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
import { WarningOutlined } from "@ant-design/icons";
import { UilTear } from "@iconscout/react-unicons";

import { DatePicker, Segmented } from "antd";
import { COLOR_DIAPER } from "../../../constants/activity";
import activityService from "../../../services/activity";
import moment from "moment";
import { reloadState } from "../../../stores/activity";
import dayjs from "dayjs";

function Diaper({
  open,
  activitySelect,
  color,
  cateCode,
  typeApi,
  itemSelected,
}) {
  const [type, setType] = useState("Ướt");
  const [valueDrop1, setValueDrop1] = useState(0);
  const [valueDrop2, setValueDrop2] = useState(0);
  const [date, setDate] = useState(null);
  const [note, setNote] = useState("");
  const [statusDate, setStatusDate] = useState("");
  const [statusModal, setStatusModal] = useState(null);
  const [colorDiaper1, setColorDiaper1] = useState("");
  const [colorDiaper2, setColorDiaper2] = useState("");
  const [error, setError] = useState("");
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [confirmLoadingDelete, setConfirmLoadingDelete] = useState(false);
  const [reload, setReload] = useRecoilState(reloadState);

  const setopenModalActivitySelect = useSetRecoilState(
    openModalActivitySelectState
  );
  const setActivitySelect = useSetRecoilState(activitySelectState);
  const childSelect = useRecoilValue(childSelectState);
  const [file, setFile] = useState(null);
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    setType(itemSelected?.Data.type ? itemSelected?.Data.type : "Ướt");
    setDate(itemSelected?.Data.date);
    setNote(itemSelected?.Data.note);
    if (itemSelected?.Data.type === "Ướt") {
      setValueDrop1(itemSelected?.Data.status);
    } else if (itemSelected?.Data.type === "Có phân") {
      setColorDiaper1(itemSelected?.Data.color);
    } else if (itemSelected?.Data.type === "Hỗn hợp") {
      setValueDrop2(itemSelected?.Data.status);
      setColorDiaper2(itemSelected?.Data.color);
    }
  }, [itemSelected]);

  const handleOk = async () => {
    setConfirmLoading(true);
    if (date === null) {
      setStatusDate("error");
      setConfirmLoading(false);
      return;
    }
    const data = {};
    data.type = type;
    data.note = note;
    data.date = date;
    switch (type) {
      case "Ướt":
        data.status = valueDrop1;
        break;
      case "Có phân":
        data.color = colorDiaper1;
        break;
      case "Hỗn hợp":
        data.status = valueDrop2;
        data.color = colorDiaper2;
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
    setStatusModal(null);
    setActivitySelect("");
  };
  const onChangeSegmented = (value) => {
    const el = document.querySelectorAll(
      ".containerModal__box__diaper__control .ant-segmented-item"
    );
    if (value === "Ướt") {
      el[0].style.color = "#fff";
      el[1].style.color = "#282828";
      el[2].style.color = "#282828";
      el[3].style.color = "#282828";
    } else if (value === "Có phân") {
      el[0].style.color = "#282828";
      el[1].style.color = "#fff";
      el[2].style.color = "#282828";
      el[3].style.color = "#282828";
    } else if (value === "Hỗn hợp") {
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

  const onChangeValueDrop1 = (newValue) => {
    setValueDrop1(newValue);
  };

  const onChangeValueDrop2 = (newValue) => {
    setValueDrop2(newValue);
  };

  const onChangeDate = (date, dateString) => {
    setStatusDate("");
    setDate(dateString);
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
        className="containerModal__diaper"
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
          <div className="containerModal__box__diaper">
            <DatePicker
              showTime
              locale={locale}
              style={{ width: "100%", height: "40px" }}
              placeholder="Chọn thời gian"
              onChange={onChangeDate}
              status={statusDate}
              format="DD-MM-YYYY HH:mm:ss"
              value={date ? dayjs(date, "DD-MM-YYYY HH:mm:ss") : null}
              disabledDate={(current) => {
                return current && current > dayjs().endOf("day");
              }}
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
            <div className="containerModal__box__diaper__control">
              {typeApi !== "update" && (
                <Segmented
                  block
                  options={["Ướt", "Có phân", "Hỗn hợp", "Khô"]}
                  onChange={onChangeSegmented}
                />
              )}
              <div className="containerModal__box__diaper__control__content">
                {type === "Ướt" && (
                  <div className="containerModal__box__diaper__control__content__box">
                    <Row className="containerModal__box__diaper__control__content__box__item">
                      <Col span={12}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            flexDirection: "column",
                          }}
                        >
                          <span>Tình trạng ướt</span>
                          <span style={{ fontSize: "12px" }}>
                            (Không bắt buộc)
                          </span>
                        </div>
                      </Col>
                      <Col
                        style={{ display: "flex", justifyContent: "flex-end" }}
                        span={12}
                      >
                        <Rate
                          character={<UilTear />}
                          count={3}
                          style={{ color: "#79b9ff" }}
                          value={valueDrop1}
                          onChange={onChangeValueDrop1}
                        />
                      </Col>
                    </Row>
                  </div>
                )}
                {type === "Có phân" && (
                  <div className="containerModal__box__diaper__control__content__box">
                    <Row className="containerModal__box__diaper__control__content__box__item">
                      <Col span={8}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            flexDirection: "column",
                          }}
                        >
                          <span>Màu phân</span>
                          <span style={{ fontSize: "12px" }}>
                            (Không bắt buộc)
                          </span>
                        </div>
                      </Col>
                      <Col span={16}>
                        <div
                          style={{
                            display: "flex",
                            gap: "16px",
                            justifyContent: "flex-end",
                          }}
                        >
                          {COLOR_DIAPER.map((item, index) => (
                            <div
                              key={index}
                              style={{
                                backgroundColor: item,
                                width: "28px",
                                height: "28px",
                                borderRadius: "50%",
                                cursor: "pointer",
                              }}
                              className={
                                colorDiaper1 === item
                                  ? "containerModal__box__diaper__control__content__box__item__active"
                                  : ""
                              }
                              onClick={() => setColorDiaper1(item)}
                            ></div>
                          ))}
                        </div>
                      </Col>
                    </Row>
                    {(colorDiaper1 === COLOR_DIAPER[3] ||
                      colorDiaper1 === COLOR_DIAPER[4] ||
                      colorDiaper1 === COLOR_DIAPER[5]) && (
                      <Row style={{ marginTop: "16px" }}>
                        <Col span={24}>
                          <div
                            style={{
                              fontSize: "12px",
                              display: "flex",
                              justifyContent: "center",
                              color: "#ff4974",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            <WarningOutlined />
                            Bạn nên đưa bé đến trung tâm y tế để kiểm tra sức
                            khỏe.
                          </div>
                        </Col>
                      </Row>
                    )}
                  </div>
                )}
                {type === "Hỗn hợp" && (
                  <div className="containerModal__box__diaper__control__content__box">
                    <Row className="containerModal__box__diaper__control__content__box__item">
                      <Col span={12}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            flexDirection: "column",
                          }}
                        >
                          <span>Tình trạng ướt</span>
                          <span style={{ fontSize: "12px" }}>
                            (Không bắt buộc)
                          </span>
                        </div>
                      </Col>
                      <Col
                        style={{ display: "flex", justifyContent: "flex-end" }}
                        span={12}
                      >
                        <Rate
                          character={<UilTear />}
                          count={3}
                          style={{ color: "#79b9ff" }}
                          value={valueDrop2}
                          onChange={onChangeValueDrop2}
                        />
                      </Col>
                    </Row>
                    <div
                      className="divider-10"
                      style={{ margin: "16px 0" }}
                    ></div>
                    <Row className="containerModal__box__diaper__control__content__box__item">
                      <Col span={8}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            flexDirection: "column",
                          }}
                        >
                          <span>Màu phân</span>
                          <span style={{ fontSize: "12px" }}>
                            (Không bắt buộc)
                          </span>
                        </div>
                      </Col>
                      <Col span={16}>
                        <div
                          style={{
                            display: "flex",
                            gap: "16px",
                            justifyContent: "flex-end",
                          }}
                        >
                          {COLOR_DIAPER.map((item, index) => (
                            <div
                              key={index}
                              style={{
                                backgroundColor: item,
                                width: "28px",
                                height: "28px",
                                borderRadius: "50%",
                                cursor: "pointer",
                              }}
                              className={
                                colorDiaper2 === item
                                  ? "containerModal__box__diaper__control__content__box__item__active"
                                  : ""
                              }
                              onClick={() => setColorDiaper2(item)}
                            ></div>
                          ))}
                        </div>
                      </Col>
                    </Row>
                    {(colorDiaper2 === COLOR_DIAPER[3] ||
                      colorDiaper2 === COLOR_DIAPER[4] ||
                      colorDiaper2 === COLOR_DIAPER[5]) && (
                      <Row style={{ marginTop: "16px" }}>
                        <Col span={24}>
                          <div
                            style={{
                              fontSize: "12px",
                              display: "flex",
                              justifyContent: "center",
                              color: "#ff4974",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            <WarningOutlined />
                            Bạn nên đưa bé đến trung tâm y tế để kiểm tra sức
                            khỏe.
                          </div>
                        </Col>
                      </Row>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="containerModal__box__diaper__textarea">
              <TextareaAutosize
                placeholder="Ghi chú (không bắt buộc)"
                className="containerModal__box__diaper__textarea__input__box"
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
            className="containerModal__result__diaper"
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

export default Diaper;
