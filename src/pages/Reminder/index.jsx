import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import "./index.scss";
import childrenService from "../../services/children";
import userAvatar from "../../assets/icons/user.png";
import { caculateAge } from "../../utils/Date";
import {
  Badge,
  Calendar,
  Modal,
  Form as FormAntd,
  DatePicker,
  TimePicker,
  Row,
  Col,
  Button,
  Select,
  Result,
  Table,
  Tag,
  Space,
} from "antd";
import moment from "moment";
import "dayjs/locale/vi";
import locale from "antd/es/date-picker/locale/vi_VN";
import { Formik } from "formik";
import dayjs from "dayjs";
import InputField from "../../components/InputField";
import { Form } from "reactstrap";
import { TextareaAutosize } from "@mui/material";
import reminderService from "../../services/reminder";
import activityService from "../../services/activity";
import { UilEdit } from "@iconscout/react-unicons";
import { ACTIVITY } from "../../constants/activity";

const dateFormat = "DD-MM-YYYY";

const getFisrtandLastDay = (newValue) => {
  const dayInWeek = moment(
    dayjs(
      dayjs(
        `01-${newValue.format("MM")}-${newValue.format("YYYY")}`,
        dateFormat
      )
    ).format(dateFormat),
    dateFormat
  ).isoWeekday();
  const date = moment(
    `01-${newValue.format("MM")}-${newValue.format("YYYY")}`,
    dateFormat
  );
  const lastDayOfMonth = moment(
    `15-${newValue.format("MM")}-${newValue.format("YYYY")}`,
    dateFormat
  ).endOf("month");
  const dayInLastMonth = moment(lastDayOfMonth).isoWeekday();
  const firstDate = date.subtract(dayInWeek - 1, "days").format(dateFormat);
  const lastDate = lastDayOfMonth
    .add(7 - dayInLastMonth + 7, "days")
    .format(dateFormat);

  return {
    firstDate,
    lastDate,
  };
};

function Reminder() {
  const [listChild, setListChild] = useState([]);
  const [listCate, setListCate] = useState([]);
  const [listCalendar, setListCalendar] = useState([]);
  const [childSelect, setChildSelect] = useState(null);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [confirmLoadingDelete, setConfirmLoadingDelete] = useState(false);
  const [errorsAddReminder, setErrorsAddReminder] = useState([]);
  const [label, setLabel] = useState("");
  const [time, setTime] = useState(null);
  const [date, setDate] = useState(null);
  const [note, setNote] = useState("");
  const [cate, setCate] = useState("");
  const [type, setType] = useState("1");
  const [result, setResult] = useState(false);
  const [dateSelected, setDateSelected] = useState(() => dayjs());
  const [reminderDate, setReminderDate] = useState([]);
  const [isUpdate, setIsUpdate] = useState(false);
  const [rowSelect, setRowSelect] = useState(null);
  const [mess, setMess] = useState("");

  const columns = [
    {
      title: "Thời gian",
      dataIndex: "Time",
      key: "Time",
      width: "10%",
    },
    {
      title: "Tiêu đề",
      dataIndex: "Label",
      key: "Label",
      width: "25%",
    },
    {
      title: "Hoạt động",
      dataIndex: "cateName",
      key: "cateName",
      width: "20%",
      render: (_, record) => (
        <span
          style={{
            fontWeight: "500",
            color: ACTIVITY.find((item) => item.title === record.cateName)
              .color,
          }}
        >
          {record.cateName}
        </span>
      ),
    },
    {
      title: "Ghi chú",
      key: "Note",
      dataIndex: "Note",
      width: "35%",
    },
    {
      title: "",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          {childSelect?.type === "parent" && (
            <UilEdit
              size={18}
              className="iconEditReminder"
              onClick={() => {
                setLabel(record.Label);
                setTime(dayjs(record.Time, "HH:mm:ss"));
                setDate(dayjs(record.Date, "DD-MM-YYYY"));
                setNote(record.Note);
                setCate(
                  listCate.find((item) => item.Name === record.cateName).Code
                );
                setOpen(true);
                setIsUpdate(true);
                setRowSelect(record);
              }}
            />
          )}
          {/* <a className="linkSuccess">Hoàn thành</a> */}
        </Space>
      ),
    },
  ];

  const getReminder = async (firstDate, lastDate) => {
    const res = await reminderService.getReminder({
      ChildCode: childSelect.Code,
      From: firstDate,
      To: lastDate,
    });
    if (res.StatusCode === 200) {
      let data = {};
      res.Data.Items.forEach((item) => {
        if (data[item.Date]) {
          data[item.Date] = {
            count: data[item.Date].count + 1,
            type: "warning",
            content: `${data[item.Date].count + 1} nhắc nhở`,
          };
        } else {
          data[item.Date] = {
            count: 1,
            type: "warning",
            content: `1 nhắc nhở`,
          };
        }
      });
      setListCalendar(data);
    }
  };

  useEffect(() => {
    const getListChild = async () => {
      const resParent = await childrenService.getChildrenParent();
      const resNanny = await childrenService.getChildrenNanny();
      if (resParent.StatusCode === 200 && resNanny.StatusCode === 200) {
        const resParentData = resParent.Data.map((item) => {
          return {
            ...item,
            type: "parent",
          };
        });
        const resNannyData = resNanny.Data.map((item) => {
          return {
            ...item,
            type: "nanny",
          };
        });
        setListChild([...resParentData, ...resNannyData]);
        setChildSelect(resParentData[0]);
      }
    };
    getListChild();
    const getListCate = async () => {
      const res = await activityService.getCateActivity();
      let data;
      if (res.StatusCode === 200) {
        data = [
          ...res.Data.map((item) => {
            return {
              ...item,
              label: item.Name,
              value: item.Code,
            };
          }),
        ];
      }
      setListCate(data);
      setCate(data[0].value);
    };
    getListCate();
  }, []);

  useEffect(() => {
    if (childSelect) {
      const { firstDate, lastDate } = getFisrtandLastDay(dateSelected);
      getReminder(firstDate, lastDate);
      const getData = async () => {
        const res = await reminderService.getReminder({
          ChildCode: childSelect.Code,
          From: dateSelected.format(dateFormat),
          To: dateSelected.format(dateFormat),
        });
        if (res.StatusCode === 200) {
          const data = res.Data.Items.map((item) => {
            return {
              ...item,
              cateName: item?.ActivityCategory?.Name,
            };
          });
          setReminderDate(data);
        }
      };
      getData();
    }
  }, [childSelect, dateSelected]);

  const dateCellRender = (value) => {
    const listData = getListData(value);
    return (
      <ul className="events">
        {listData.map((item) => (
          <li key={item.content}>
            <Badge status={item.type} text={item.content} />
          </li>
        ))}
      </ul>
    );
  };

  const showModal = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setLabel("");
    setTime(null);
    setDate(null);
    setCate(listCate[0].value);
    setNote("");
    setOpen(false);
    setErrorsAddReminder([]);
    setResult(false);
    setIsUpdate(false);
    setConfirmLoading(false);
  };

  const onChangeDate = (date, dateString) => {
    setDate(dateString);
  };

  const onChangeTime = (time, timeString) => {
    setTime(timeString);
  };

  const addReminder = async (values) => {
    console.log({
      Label: values.label,
      Time: values.time,
      // Date: values.date,
      Type: Number(values.type),
      Note: values.note,
      ActivityCategoryCode: cate,
      ChildCode: childSelect.Code,
    });
    setConfirmLoading(true);
    const res = await reminderService.addReminder({
      Label: values.label,
      Time: values.time,
      // Date: values.date,
      Type: values.type,
      Note: values.note,
      ActivityCategoryCode: cate,
      ChildCode: childSelect.Code,
    });
    if (res.StatusCode === 200) {
      setResult(true);
      setConfirmLoading(false);
      setLabel("");
      setTime(null);
      setDate(null);
      setCate(listCate[0].value);
      setNote("");
      setErrorsAddReminder([]);
      const { firstDate, lastDate } = getFisrtandLastDay(dateSelected);
      getReminder(firstDate, lastDate);
      setMess("Thêm nhắc nhở thành công");
      const getData = async () => {
        const res = await reminderService.getReminder({
          ChildCode: childSelect.Code,
          From: dateSelected.format(dateFormat),
          To: dateSelected.format(dateFormat),
        });
        if (res.StatusCode === 200) {
          console.log(res.Data.Items);
          const data = res.Data.Items.map((item) => {
            return {
              ...item,
              cateName: item?.ActivityCategory?.Name,
            };
          });
          setReminderDate(data);
        }
      };
      getData();
    } else {
      setErrorsAddReminder([res.Message]);
      setConfirmLoading(false);
    }
  };

  const updateReminder = async (values) => {
    setConfirmLoading(true);
    const res = await reminderService.updateReminder({
      Code: rowSelect.Code,
      Label: values.label,
      Time:
        typeof values.time === "string"
          ? values.time
          : values.time.format("HH:mm:ss"),
      Note: values.note,
      ActivityCategoryCode: cate,
    });
    if (res.StatusCode === 200) {
      setResult(true);
      setConfirmLoading(false);
      setErrorsAddReminder([]);
      setMess("Cập nhật nhắc nhở thành công");
      const getData = async () => {
        const res = await reminderService.getReminder({
          ChildCode: childSelect.Code,
          From: dateSelected.format(dateFormat),
          To: dateSelected.format(dateFormat),
        });
        if (res.StatusCode === 200) {
          const data = res.Data.Items.map((item) => {
            return {
              ...item,
              cateName: item?.ActivityCategory?.Name,
            };
          });
          setReminderDate(data);
        }
      };
      getData();
    } else {
      setErrorsAddReminder([res.Message]);
      setConfirmLoading(false);
    }
  };

  const handleChangeCate = (value) => {
    setCate(value);
  };

  const onSelect = async (newValue) => {
    setDateSelected(newValue);
  };

  const onPanelChange = (newValue) => {
    setDateSelected(newValue);
    const { firstDate, lastDate } = getFisrtandLastDay(newValue);
    getReminder(firstDate, lastDate);
  };

  const getListData = (value) => {
    return listCalendar[moment(value.toDate()).format("DD-MM-YYYY")]
      ? [listCalendar[moment(value.toDate()).format("DD-MM-YYYY")]]
      : [];
  };

  const handleDelete = async () => {
    setConfirmLoadingDelete(true);
    const res = await reminderService.deleteReminder(rowSelect.Code);
    if (res.StatusCode === 200) {
      setMess("Xóa nhắc nhở thành công");
      setResult(true);
      const getData = async () => {
        const res = await reminderService.getReminder({
          ChildCode: childSelect.Code,
          From: dateSelected.format(dateFormat),
          To: dateSelected.format(dateFormat),
        });
        if (res.StatusCode === 200) {
          const data = res.Data.Items.map((item) => {
            return {
              ...item,
              cateName: item?.ActivityCategory?.Name,
            };
          });
          setReminderDate(data);
          setConfirmLoadingDelete(false);
        } else {
          setConfirmLoadingDelete(false);
        }
      };
      getData();
    }
  };

  const handleChangeType = (value) => {
    setType(value);
  };

  return (
    <div className="containerReminder">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Nhắc nhở</title>
      </Helmet>
      <div className="containerReminder__main">
        <div className="containerReminder__main__left">
          {listChild.map((item, index) => (
            <div
              className={`cardChildren__container__main containerReminder__main__left__item ${
                index === 0 && "containerReminder__main__left__item--top"
              } ${
                index === listChild.length - 1 &&
                "containerReminder__main__left__item--bottom"
              } ${
                item.Code === childSelect.Code &&
                "containerReminder__main__left__item--active"
              }`}
              key={item.Code}
              onClick={() => setChildSelect(item)}
            >
              <div>
                <img
                  src={item.ImagePath ? item.ImagePath : userAvatar}
                  alt=""
                />
              </div>
              <div className="cardChildren__container__main__child">
                <div>
                  <span className="cardChildren__container__main__child__name">
                    {item.Name}
                  </span>
                </div>
                <div>
                  <div className="cardChildren__container__main__child__more">
                    <span className="cardChildren__container__main__child__more__age">
                      {caculateAge(item.DateOfBirth)}
                    </span>
                    <span className="cardChildren__container__main__child__more__dot">
                      •
                    </span>
                    <span className="cardChildren__container__main__child__more__gender">
                      {item.Gender === 0 && "Bé gái"}
                      {item.Gender === 1 && "Bé trai"}
                      {item.Gender === 2 && "Khác"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="containerReminder__main__right">
          <div className="containerReminder__main__right__name">
            <span className="activity__container__main__parent__header__title">
              {childSelect?.Name}
            </span>
            {childSelect?.type === "parent" && (
              <div onClick={showModal} className="jwgc__btn__outline">
                Thêm nhắc nhở
              </div>
            )}
          </div>

          <div className="containerReminder__main__right__calendar">
            {listChild.length > 0 && (
              <>
                <div className="divider-10"></div>
                <Calendar
                  locale={locale}
                  dateCellRender={dateCellRender}
                  onSelect={onSelect}
                  onPanelChange={onPanelChange}
                  value={dateSelected}
                />
              </>
            )}
          </div>
          {listChild.length > 0 && (
            <>
              <div className="divider-10"></div>
              <div>
                <p className="dateSelected">
                  Chi tiết ngày {dayjs(dateSelected).format(dateFormat)}
                </p>
                <Table
                  columns={columns}
                  dataSource={reminderDate}
                  pagination={false}
                  rowKey="Code"
                />
              </div>
            </>
          )}
        </div>
      </div>
      <Modal
        okText="Thêm"
        cancelText="Hủy"
        open={open}
        footer={null}
        onCancel={handleCancel}
        title={isUpdate ? "Cập nhật nhắc nhở" : "Thêm nhắc nhở"}
      >
        {!result ? (
          <div
            className="updateprofile__container__box__main__user__box"
            style={{ marginTop: "32px" }}
          >
            {errorsAddReminder?.length > 0 && (
              <div className="createBlog__container__editor__title__error">
                <div className="createBlog__container__editor__title__error__label">
                  Rất tiếc, đã xảy ra lỗi:
                </div>
                <ul className="createBlog__container__editor__title__error__list">
                  {errorsAddReminder.map((error, index) => (
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
                label: label,
                time: time,
                // date: date,
                note: note,
                type: type,
              }}
              onSubmit={(values, { setErrors }) => {
                let check = true;
                let errors = {};
                if (!values.label) {
                  errors.label = "Tiêu đề không được để trống";
                  check = false;
                }
                if (!values.time) {
                  errors.time = "Vui lòng chọn thời gian";
                  check = false;
                }
                // if (!values.date) {
                //   errors.date = "Vui lòng chọn ngày";
                //   check = false;
                // }
                setErrors(errors);
                if (check) {
                  if (isUpdate) {
                    updateReminder(values);
                  } else {
                    addReminder(values);
                  }
                }
              }}
            >
              {({ values, errors, handleChange, handleSubmit }) => (
                <Form>
                  <InputField
                    placeholder="Tiêu đề"
                    id="label"
                    type="text"
                    value={values.label}
                    handleChange={(e) => {
                      handleChange(e);
                      setLabel(e.target.value);
                    }}
                    validate={{}}
                    height={40}
                    errors={errors.label}
                    maxLength={20}
                    label="Tiêu đề"
                  />
                  <Row>
                    <Col span={24}>
                      <label
                        className="inputProfile__label"
                        htmlFor="birthday"
                        style={{ marginBottom: "8px" }}
                      >
                        Hoạt động
                      </label>
                      <Select
                        placeholder="Chọn"
                        className="selectReminder"
                        style={{
                          width: "100%",
                          height: "40px",
                        }}
                        onChange={handleChangeCate}
                        options={listCate}
                        value={cate}
                      />
                    </Col>
                  </Row>
                  <Row gutter={30} style={{ marginTop: "16px" }}>
                    <Col span={12}>
                      <label
                        className="inputProfile__label"
                        htmlFor="birthday"
                        style={{ marginBottom: "8px" }}
                      >
                        Loại nhắc nhở
                      </label>
                      <FormAntd.Item
                        validateStatus={errors.date && "error"}
                        help={errors.date}
                      >
                        {/* <DatePicker
                          id="date"
                          placeholder="Ngày"
                          style={{ width: "100%", height: "40px" }}
                          locale={locale}
                          value={
                            values.date ? dayjs(values.date, dateFormat) : null
                          }
                          format={dateFormat}
                          onChange={onChangeDate}
                          disabledDate={(d) =>
                            d.isBefore(moment().format("YYYY-MM-DD"))
                          }
                        /> */}
                        <Select
                          value={values.type}
                          style={{
                            width: "100%",
                          }}
                          onChange={handleChangeType}
                          options={[
                            {
                              value: "1",
                              label: "Trong ngày",
                            },
                            {
                              value: "2",
                              label: "Hàng ngày",
                            },
                          ]}
                        />
                      </FormAntd.Item>
                    </Col>
                    <Col span={12}>
                      <label
                        className="inputProfile__label"
                        htmlFor="birthday"
                        style={{ marginBottom: "8px" }}
                      >
                        Thời gian
                      </label>
                      <FormAntd.Item
                        validateStatus={errors.time && "error"}
                        help={errors.time}
                      >
                        <TimePicker
                          style={{ width: "100%", height: "40px" }}
                          value={
                            values.time ? dayjs(values.time, "HH:mm:ss") : null
                          }
                          locale={locale}
                          onChange={onChangeTime}
                        />
                      </FormAntd.Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={24}>
                      <label
                        className="inputProfile__label"
                        htmlFor="birthday"
                        style={{ marginBottom: "8px" }}
                      >
                        Ghi chú
                      </label>
                      <TextareaAutosize
                        placeholder="Ghi chú (không bắt buộc)"
                        className="reminder__note"
                        minRows={5}
                        value={values.note}
                        onChange={(e) => setNote(e.target.value)}
                      />
                    </Col>
                  </Row>

                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      justifyContent: "flex-end",
                      marginTop: "32px",
                    }}
                  >
                    <Button onClick={handleCancel}>Hủy</Button>
                    {isUpdate && (
                      <Button
                        loading={confirmLoadingDelete}
                        danger
                        type="primary"
                        onClick={handleDelete}
                      >
                        Xóa
                      </Button>
                    )}
                    <Button
                      loading={confirmLoading}
                      type="primary"
                      onClick={handleSubmit}
                    >
                      {isUpdate ? "Cập nhật" : "Thêm"}
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        ) : (
          <div>
            <Result
              status="success"
              title={mess}
              extra={[
                <Button
                  type="primary"
                  key="console"
                  onClick={() => {
                    if (!isUpdate) {
                      setResult(false);
                      setLabel("");
                      setTime(null);
                      setDate(null);
                      setCate(listCate[0].value);
                      setNote("");
                      setErrorsAddReminder([]);
                    } else {
                      setResult(false);
                      setErrorsAddReminder([]);
                    }
                  }}
                >
                  Quay Lại
                </Button>,
                <Button onClick={handleCancel} key="buy">
                  Thoát
                </Button>,
              ]}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Reminder;
