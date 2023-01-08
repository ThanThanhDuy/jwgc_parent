import React, { useState } from "react";
import "./index.scss";
import userAvatar from "../../assets/icons/user.png";
import { caculateAge } from "../../utils/Date";
import { useSetRecoilState, useRecoilState } from "recoil";
import { childSelectState, listChildState } from "../../stores/child";
import { UilEdit } from "@iconscout/react-unicons";
import {
  Modal,
  Radio,
  Form as FormAntd,
  DatePicker,
  Row,
  Col,
  Button,
  notification,
} from "antd";
import { Formik } from "formik";
import dayjs from "dayjs";
import { Form } from "reactstrap";
import InputField from "../InputField";
import "dayjs/locale/vi";
import locale from "antd/es/date-picker/locale/vi_VN";
import childrenService from "../../services/children";
import { ExclamationCircleFilled } from "@ant-design/icons";

const dateFormat = "DD-MM-YYYY";
const { confirm } = Modal;

function CardChildren({ child, childSelect, index }) {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [gender, setGender] = useState(child?.Gender);
  const [name, setName] = useState(child?.Name);
  const [avatar, setAvatar] = useState(child?.ImagePath);
  const [date, setDate] = useState(child?.DateOfBirth);
  const [file, setFile] = useState(null);
  const [errorsUpdatechild, setErrorsUpdatechild] = useState([]);
  const setChildSelect = useSetRecoilState(childSelectState);
  const [listChild, setListChild] = useRecoilState(listChildState);

  const showModal = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setErrorsUpdatechild([]);
    setGender(child?.Gender);
    setName(child?.Name);
    setAvatar(child?.ImagePath);
    setDate(child?.DateOfBirth);
    setOpen(false);
    document.getElementById("fileSelectUpdateChild").value = "";
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

  const handleUpdateChild = async (name, dateOfBirth, gender) => {
    confirm({
      title: "Bạn có chắc chắn muốn cập nhật thông tin trẻ này không?",
      icon: <ExclamationCircleFilled />,
      async onOk() {
        setConfirmLoading(true);
        const res = await childrenService.updateChild({
          code: child.Code,
          name,
          dateOfBirth,
          gender,
          file,
        });
        if (res && res.StatusCode === 200) {
          notification.success({
            message: "Cập nhật thông tin trẻ thành công",
          });
          setOpen(false);
          setConfirmLoading(false);
          document.getElementById("fileSelectUpdateChild").value = "";
          const indexFind = listChild?.findIndex(
            (item) => item.Code === child.Code
          );
          if (indexFind !== -1) {
            const newListChild = [...listChild];
            newListChild[indexFind] = { ...res.Data };
            setListChild(newListChild);
          }
          if (childSelect.Code === child.Code) {
            setChildSelect({ ...res.Data });
          }
        } else {
          setConfirmLoading(false);
          setErrorsUpdatechild(res.Message);
        }
      },
    });
  };

  const handleDeleteChild = async (e) => {
    e.preventDefault();
    confirm({
      title: "Bạn có chắc chắn muốn xóa trẻ này không?",
      icon: <ExclamationCircleFilled />,
      async onOk() {
        const res = await childrenService.deleteChild(child.Code);
        if (res && res.StatusCode === 200) {
          notification.success({
            message: "Xóa trẻ thành công",
          });
          const indexFind = listChild?.findIndex(
            (item) => item.Code === child.Code
          );
          if (indexFind !== -1) {
            const newListChild = [...listChild];
            newListChild.splice(indexFind, 1);
            setListChild(newListChild);
            if (childSelect.Code === child.Code) {
              setChildSelect({ ...newListChild[0] });
            }
          }
        } else {
          notification.error({
            message: res.Message,
          });
        }
      },
    });
  };

  return (
    <div
      className={`cardChildren__container ${
        child?.Code === childSelect?.Code && "cardChildren__container__active"
      }`}
      onClick={() => setChildSelect(child)}
    >
      <div className="cardChildren__container__main">
        <div>
          <img src={child.ImagePath ? child.ImagePath : userAvatar} alt="" />
        </div>
        <div className="cardChildren__container__main__child">
          <div>
            <span className="cardChildren__container__main__child__name">
              {child.Name}
            </span>
          </div>
          <div>
            <div className="cardChildren__container__main__child__more">
              <span className="cardChildren__container__main__child__more__age">
                {caculateAge(child.DateOfBirth)}
              </span>
              <span className="cardChildren__container__main__child__more__dot">
                •
              </span>
              <span className="cardChildren__container__main__child__more__gender">
                {child.Gender === 0 && "Bé gái"}
                {child.Gender === 1 && "Bé trai"}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="cardChildren__container__edit">
        <UilEdit
          className="cardChildren__container__edit__icon"
          onClick={showModal}
        />
      </div>
      <Modal
        title="Chỉnh sửa thông tin bé"
        okText="Lưu"
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
          {errorsUpdatechild.length > 0 && (
            <div className="createBlog__container__editor__title__error">
              <div className="createBlog__container__editor__title__error__label">
                Rất tiếc, đã xảy ra lỗi:
              </div>
              <ul className="createBlog__container__editor__title__error__list">
                {errorsUpdatechild.map((error, index) => (
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
              dateOfBirth: date,
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
                handleUpdateChild(
                  values.name,
                  values.dateOfBirth,
                  values.gender
                );
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
                    <img src={avatar ? avatar : userAvatar} alt="" />
                    <div className="updateprofile__container__box__main__user__avatar__input">
                      <input
                        id="fileSelectUpdateChild"
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
                  <button
                    className="jwgc__btn__danger"
                    style={{ padding: "4px 15px", fontSize: "14px" }}
                    onClick={(e) => handleDeleteChild(e)}
                  >
                    Xóa
                  </button>
                  <Button type="primary" onClick={handleSubmit}>
                    Lưu
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

export default CardChildren;
