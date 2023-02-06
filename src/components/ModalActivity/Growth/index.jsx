import React, { useState } from "react";
import "./index.scss";
import {
  Row,
  Col,
  ConfigProvider,
  Modal,
  InputNumber,
  Button,
  Result,
} from "antd";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  activitySelectState,
  childSelectState,
  openModalActivitySelectState,
} from "../../../stores/child";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import "dayjs/locale/vi";
import locale from "antd/es/date-picker/locale/vi_VN";

import { DatePicker } from "antd";
import activityService from "../../../services/activity";

function Growth({ open, activitySelect, color, cateCode }) {
  const [weight, setWeight] = useState(0);
  const [height, setHeight] = useState(0);
  const [headCircumference, setHeadCircumference] = useState(0);
  const [date, setDate] = useState(null);
  const [note, setNote] = useState("");
  const [statusDate, setStatusDate] = useState("");
  const [statusWeight, setStatusWeight] = useState("");
  const [statusHeight, setStatusHeight] = useState("");
  const [statusHead, setStatusHead] = useState("");
  const [statusModal, setStatusModal] = useState(null);
  const [error, setError] = useState("");
  const [confirmLoading, setConfirmLoading] = useState(false);

  const setopenModalActivitySelect = useSetRecoilState(
    openModalActivitySelectState
  );
  const setActivitySelect = useSetRecoilState(activitySelectState);
  const childSelect = useRecoilValue(childSelectState);

  const handleOk = async () => {
    setConfirmLoading(true);
    let check = true;
    if (date === null) {
      setStatusDate("error");
      setConfirmLoading(false);
      check = false;
    }
    if (!weight) {
      setStatusWeight("error");
      setConfirmLoading(false);
      check = false;
    }
    if (!height) {
      setStatusHeight("error");
      setConfirmLoading(false);
      check = false;
    }
    if (!headCircumference) {
      setStatusHead("error");
      setConfirmLoading(false);
      check = false;
    }
    if (!check) {
      return;
    }
    const data = {};
    data.weight = weight;
    data.height = height;
    data.headCircumference = headCircumference;
    const res = await activityService.recordActivity(
      cateCode,
      childSelect.Code,
      date,
      data,
      null
    );
    if (res && res.StatusCode === 200) {
      setStatusModal("success");
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

  const onChangeTextArea = (e) => {
    setNote(e.target.value);
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
        className="containerModal__growth"
        title={activitySelect}
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Lưu"
        cancelText="Hủy"
        confirmLoading={confirmLoading}
        footer={statusModal === null ? undefined : null}
      >
        {statusModal === null && (
          <div className="containerModal__box__growth">
            <DatePicker
              showTime
              locale={locale}
              style={{ width: "100%", height: "40px", color: "#000" }}
              placeholder="Chọn thời gian"
              onChange={onChangeDate}
              status={statusDate}
              className="containerModal__box__growth__date"
              format="DD-MM-YYYY HH:mm:ss"
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
            <div className="containerModal__box__growth__control">
              <div className="containerModal__box__growth__control__content">
                <div className="containerModal__box__growth__control__content__box">
                  <Row className="containerModal__box__growth__control__content__box__item">
                    <Col span={8}>Cân nặng</Col>
                    <Col offset={7} span={6}>
                      <InputNumber
                        min={0}
                        max={100}
                        style={{
                          width: "100%",
                        }}
                        placeholder="Nhập cân nặng"
                        value={weight}
                        onChange={(e) => {
                          setWeight(e);
                          setStatusWeight("");
                        }}
                      />
                    </Col>
                    <Col span={2} offset={1}>
                      Kg
                    </Col>
                  </Row>
                  <Row className="containerModal__box__growth__control__content__box__item">
                    <Col offset={15}>
                      {statusWeight === "error" && (
                        <p
                          style={{
                            marginTop: "5px",
                            marginLeft: "5px",
                            color: "#ff4d4f",
                            marginBottom: "0px",
                          }}
                        >
                          Vui lòng nhập cân nặng
                        </p>
                      )}
                    </Col>
                  </Row>

                  <Row
                    className="containerModal__box__growth__control__content__box__item"
                    style={{ marginTop: "16px" }}
                  >
                    <Col span={8}>Chiều cao</Col>
                    <Col offset={7} span={6}>
                      <InputNumber
                        min={0}
                        max={200}
                        style={{
                          width: "100%",
                        }}
                        placeholder="Nhập chiều cao"
                        value={height}
                        onChange={(e) => {
                          setHeight(e);
                          setStatusHeight("");
                        }}
                      />
                    </Col>
                    <Col span={2} offset={1}>
                      Cm
                    </Col>
                  </Row>
                  <Row className="containerModal__box__growth__control__content__box__item">
                    <Col offset={15}>
                      {statusHeight === "error" && (
                        <p
                          style={{
                            marginTop: "5px",
                            marginLeft: "5px",
                            color: "#ff4d4f",
                            marginBottom: "0px",
                          }}
                        >
                          Vui lòng nhập chiều cao
                        </p>
                      )}
                    </Col>
                  </Row>
                  <Row
                    className="containerModal__box__growth__control__content__box__item"
                    style={{ marginTop: "16px" }}
                  >
                    <Col span={8}>Chu vi đầu</Col>
                    <Col offset={7} span={6}>
                      <InputNumber
                        min={0}
                        max={1000}
                        style={{
                          width: "100%",
                        }}
                        placeholder="Nhập chu vi đầu"
                        value={headCircumference}
                        onChange={(e) => {
                          setHeadCircumference(e);
                          setStatusHead("");
                        }}
                      />
                    </Col>
                    <Col span={2} offset={1}>
                      Cm
                    </Col>
                  </Row>
                  <Row className="containerModal__box__growth__control__content__box__item">
                    <Col offset={15}>
                      {statusHead === "error" && (
                        <p
                          style={{
                            marginTop: "5px",
                            marginLeft: "5px",
                            color: "#ff4d4f",
                            marginBottom: "0px",
                          }}
                        >
                          Vui lòng nhập chu vi đầu
                        </p>
                      )}
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
            <div className="containerModal__box__growth__textarea">
              <TextareaAutosize
                placeholder="Ghi chú (không bắt buộc)"
                className="containerModal__box__growth__textarea__input__box"
                minRows={5}
                onChange={onChangeTextArea}
              />
            </div>
          </div>
        )}
        {statusModal !== null && (
          <Result
            className="containerModal__result__growth"
            status={statusModal}
            title={`Ghi lại hành trình cho trẻ ${
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

export default Growth;
