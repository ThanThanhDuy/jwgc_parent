import React, { useEffect, useState } from "react";
import "./index.scss";
import { Segmented, notification, Row, Col, Button } from "antd";
import childrenService from "../../services/children";
import { Empty } from "antd";
import { UilPlus } from "@iconscout/react-unicons";
import CardChildren from "../CardChildren";
import { useRecoilState } from "recoil";
import {
  childSelectState,
  listChildState,
  typeState,
} from "../../stores/child";
import { Modal, Radio, Form as FormAntd, DatePicker } from "antd";
import { Formik } from "formik";
import moment from "moment";
import dayjs from "dayjs";
import { Form } from "reactstrap";
import InputField from "../InputField";
import "dayjs/locale/vi";
import locale from "antd/es/date-picker/locale/vi_VN";
import { ExclamationCircleFilled } from "@ant-design/icons";

const dateFormat = "DD-MM-YYYY";
const { confirm } = Modal;

function SidebarChildren() {
  const [listChild, setListChild] = useRecoilState(listChildState);
  const [loading, setLoading] = useState(false);
  const [childSelect, setChildSelect] = useRecoilState(childSelectState);
  const [type, setType] = useRecoilState(typeState);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [gender, setGender] = useState(1);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [date, setDate] = useState("");
  const [file, setFile] = useState(null);
  const [errorsAddchild, setErrorsAddchild] = useState([]);

  const showModal = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setErrorsAddchild([]);
    document.getElementById("fileSelectAddChild").value = "";
    setAvatar("");
    setName("");
    setDate(moment().format(dateFormat));
    setFile(null);
    setGender(0);
    setOpen(false);
  };

  useEffect(() => {
    const handleGetChildren = async () => {
      setLoading(true);
      if (type === "Cha mẹ") {
        const res = await childrenService.getChildrenParent();
        if (res && res.StatusCode === 200) {
          setListChild(res.Data);
          if (res.Data.length > 0) {
            if (childSelect === null) {
              setChildSelect(res.Data[0]);
            }
          }
        } else {
          notification.error({
            message: "Không thể lấy danh sách trẻ",
            description: res.Message,
          });
        }
      } else {
        const res = await childrenService.getChildrenNanny();
        if (res && res.StatusCode === 200) {
          setListChild(res.Data);
          if (res.Data.length > 0) {
            if (childSelect === null) {
              setChildSelect(res.Data[0]);
            }
          }
        } else {
          notification.error({
            message: "Không thể lấy danh sách trẻ",
            description: res.Message,
          });
        }
      }
      setLoading(false);
    };
    handleGetChildren();
    // eslint-disable-next-line
  }, [type]);

  const onChangeSegmented = (value) => {
    const el = document.querySelectorAll(" .ant-segmented-item");
    if (value === "Cha mẹ") {
      el[0].style.color = "#fff";
      el[1].style.color = "#282828";
    } else {
      el[1].style.color = "#fff";
      el[0].style.color = "#282828";
      setChildSelect(null);
    }
    setType(value);
  };

  const onChangeGender = (e) => {
    setGender(e.target.value);
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

  const onChangeDate = (date, dateString) => {
    setDate(dateString);
  };

  const handleAddChild = async (name, dateOfBirth, gender) => {
    confirm({
      title: "Bạn có chắc chắn muốn thêm hành trình cho trẻ này không?",
      icon: <ExclamationCircleFilled />,
      async onOk() {
        setConfirmLoading(true);
        const res = await childrenService.addChild({
          name,
          dateOfBirth,
          gender,
          file,
        });
        if (res && res.StatusCode === 200) {
          notification.success({
            message: "Thêm hành trình thành công",
          });
          setOpen(false);
          setConfirmLoading(false);
          setErrorsAddchild([]);
          setAvatar("");
          setName("");
          setDate(moment().format(dateFormat));
          setFile(null);
          setGender(0);
          document.getElementById("fileSelectAddChild").value = "";
          setListChild([...listChild, res.Data]);
        } else {
          setConfirmLoading(false);
          setErrorsAddchild(res.Message);
        }
      },
    });
  };
  return (
    <div className="sidebar__children__container">
      <div style={{ padding: "16px 16px 0" }}>
        <Segmented
          size="large"
          block
          options={["Cha mẹ", "Bảo mẫu"]}
          value={type}
          onChange={onChangeSegmented}
        />
      </div>
      <div>
        {type === "Cha mẹ" && (
          <div className="childrenContainer__header">
            <div
              className="jwgc__btn__outline childrenContainer__header__btn"
              onClick={showModal}
            >
              <UilPlus />
              <span>Thêm hành trình của trẻ</span>
            </div>
          </div>
        )}
        <div
          className={`sidebar__children__container__list__${
            type === "Cha mẹ" ? "parent" : "nanny"
          }`}
        >
          {loading ? null : (
            <>
              {listChild.length > 0 ? (
                listChild.map((item, index) => (
                  <div key={item.Code}>
                    <CardChildren
                      child={item}
                      childSelect={childSelect}
                      index={index}
                    />
                    {index !== listChild.length - 1 && (
                      <div className="divider-10"></div>
                    )}
                  </div>
                ))
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={<span>Không có trẻ nào</span>}
                />
              )}
            </>
          )}
        </div>
      </div>
      <Modal
        okText="Thêm"
        cancelText="Hủy"
        open={open}
        footer={null}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <div
          className="updateprofile__container__box__main__user__box"
          style={{ marginTop: "32px" }}
        >
          {errorsAddchild?.length > 0 && (
            <div className="createBlog__container__editor__title__error">
              <div className="createBlog__container__editor__title__error__label">
                Rất tiếc, đã xảy ra lỗi:
              </div>
              <ul className="createBlog__container__editor__title__error__list">
                {errorsAddchild.map((error, index) => (
                  <li
                    className="createBlog__container__editor__title__error__list__item"
                    key={index}
                  >
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <Formik
            enableReinitialize
            initialValues={{
              name: name,
              dateOfBirth: date ? date : moment().format(dateFormat),
              gender: gender,
            }}
            onSubmit={(values, { setErrors }) => {
              let check = true;
              let errors = {};
              if (!values.name) {
                errors.name = "Họ và tên không được để trống";
                check = false;
              }
              if (values.dateOfBirth) {
                if (
                  dayjs(values.dateOfBirth, dateFormat).isAfter(dayjs()) ||
                  dayjs(values.dateOfBirth, dateFormat).isBefore(
                    dayjs().subtract(100, "year")
                  )
                ) {
                  errors.dateOfBirth = "Ngày sinh không hợp lệ";
                  check = false;
                }
              }
              setErrors(errors);
              if (check) {
                handleAddChild(values.name, values.dateOfBirth, values.gender);
              }
            }}
          >
            {({ values, errors, handleChange, handleSubmit }) => (
              <Form>
                <InputField
                  placeholder="Họ và tên"
                  id="name"
                  type="text"
                  value={values.name}
                  handleChange={(e) => {
                    handleChange(e);
                    setName(e.target.value);
                  }}
                  validate={{}}
                  height={40}
                  errors={errors.name}
                  maxLength={20}
                  label="Họ và tên"
                />
                <Row gutter={100}>
                  <Col span={12}>
                    <label
                      className="inputProfile__label"
                      htmlFor="birthday"
                      style={{ marginBottom: "8px" }}
                    >
                      Ngày sinh
                    </label>
                    <FormAntd.Item
                      validateStatus={errors.dateOfBirth && "error"}
                      help={errors.dateOfBirth}
                    >
                      <DatePicker
                        id="birthday"
                        placeholder="Ngày sinh"
                        style={{ width: "100%", height: "40px" }}
                        locale={locale}
                        value={dayjs(values.dateOfBirth, dateFormat)}
                        format={dateFormat}
                        onChange={onChangeDate}
                      />
                    </FormAntd.Item>
                  </Col>
                  <Col span={12}>
                    <label
                      className="inputProfile__label"
                      htmlFor="gender"
                      style={{ marginBottom: "8px" }}
                    >
                      Giới tính
                    </label>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        height: "40px",
                      }}
                    >
                      <Radio.Group
                        id="gender"
                        onChange={onChangeGender}
                        value={values.gender}
                      >
                        <Radio value={0}>Bé gái</Radio>
                        <Radio value={1}>Bé trai</Radio>
                      </Radio.Group>
                    </div>
                  </Col>
                </Row>
                <div>
                  <label
                    className="inputProfile__label"
                    htmlFor="avatar"
                    style={{ marginBottom: "8px" }}
                  >
                    Ảnh của bé
                  </label>
                  <div
                    className="updateprofile__container__box__main__user__avatar"
                    id="avatar"
                  >
                    <img src={avatar} alt="" />
                    <div className="updateprofile__container__box__main__user__avatar__input">
                      <input
                        id="fileSelectAddChild"
                        onChange={handleFileSelected}
                        type="file"
                        accept="image/png, image/jpeg"
                      />
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    justifyContent: "flex-end",
                    marginTop: "32px",
                  }}
                >
                  <Button onClick={handleCancel}>Hủy</Button>
                  <Button type="primary" onClick={handleSubmit}>
                    Thêm
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </Modal>
    </div>
  );
}

export default SidebarChildren;
