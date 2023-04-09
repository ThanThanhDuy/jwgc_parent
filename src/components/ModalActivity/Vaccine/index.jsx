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
  Tabs,
  Drawer,
  Select,
  Table,
  Tag,
  Space,
  Form,
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
import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs from "dayjs";
import vaccineService from "../../../services/vaccine";
import {
  UilEdit,
  UilTrashAlt,
  UilPlus,
  UilMinus,
} from "@iconscout/react-unicons";
import { Formik } from "formik";
import InputField from "../../InputField";
import { ExclamationCircleFilled } from "@ant-design/icons";

dayjs.extend(customParseFormat);
const dateFormat = "DD-MM-YYYY";

const { confirm } = Modal;

function Vaccine({
  open,
  activitySelect,
  color,
  cateCode,
  typeApi,
  itemSelected,
}) {
  const [type, setType] = useState("Vaccine khuyến nghị");
  const [statusDate, setStatusDate] = useState("");
  const [statusModal, setStatusModal] = useState(null);
  const [error, setError] = useState("");
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [confirmLoadingAdd, setConfirmLoadingAdd] = useState(false);
  const [tabSelect, setTabSelect] = useState("1");
  const [tabSelectOther, setTabSelectOther] = useState("1");
  const [listVaccineSystem, setListVaccineSystem] = useState([]);
  const [listVaccineDefine, setListVaccineDefine] = useState([]);
  const [listVaccineSystemChild, setListVaccineSystemChild] = useState([]);
  const [listVaccineDefineChild, setListVaccineDefineChild] = useState([]);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openDrawerAddVaccine, setOpenDrawerAddVaccine] = useState(false);
  const [vaccineSelected, setVaccineSelected] = useState(null);
  const [vaccineSelectedDefine, setVaccineSelectedDefine] = useState(null);
  const [statusVaccine, setStatusVaccine] = useState(true);
  const [date, setDate] = useState(dayjs().format(dateFormat));
  const [note, setNote] = useState("");
  const [nameVaccine, setNameVaccine] = useState("");
  const [noteVaccine, setNoteVaccine] = useState("");
  const [diseaseVaccine, setDiseaseVaccine] = useState("");
  const [basicAmount, setBasicAmount] = useState(1);
  const [editReordSystem, setEditReordSystem] = useState(false);
  const [confirmLoadingDeleteVaccine, setConfirmLoadingDeleteVaccine] =
    useState(false);
  const [typeImport, setTypeImport] = useState("system");
  const [editVaccineDefine, setEditVaccineDefine] = useState(false);

  const setopenModalActivitySelect = useSetRecoilState(
    openModalActivitySelectState
  );

  const childSelect = useRecoilValue(childSelectState);

  const columns = [
    {
      title: "Mũi tiêm",
      dataIndex: "No",
      key: "No",
      width: "11%",
      align: "center",
    },
    {
      title: "Ngày tiêm",
      dataIndex: "Date",
      key: "Date",
      width: "16%",
      align: "center",
    },
    {
      title: "Ghi chú",
      dataIndex: "Note",

      key: "Note",
    },
    {
      title: "Trạng thái",
      key: "Status",
      dataIndex: "Status",
      align: "center",
      width: "11%",
      render: (Status) => (
        <>
          <Tag color={Status ? "green" : "gold"} key={Status}>
            {Status ? "Đã tiêm".toUpperCase() : "Chưa tiêm".toUpperCase()}
          </Tag>
        </>
      ),
    },
    {
      title: "Chỉnh sửa",
      key: "action",
      align: "center",
      width: "15%",
      render: (_, record) => (
        <Space size="middle">
          <UilEdit
            onClick={() => {
              if (typeImport === "system") {
                setVaccineSelected(record);
              } else {
                setVaccineSelectedDefine(record);
              }
              setDate(record.Date);
              setNote(record.Note);
              setStatusVaccine(record.Status);
              setOpenDrawer(true);
              setEditReordSystem(true);
            }}
            className="edit"
            size={20}
          />
          <UilTrashAlt
            onClick={() => {
              handleDeleteVaccineSystem(record.Code);
            }}
            className="delete"
            size={20}
          />
        </Space>
      ),
    },
  ];

  useEffect(() => {
    if (childSelect) {
      if (type === "Vaccine khuyến nghị") {
        const getVaccineSystem = async () => {
          const res = await vaccineService.getVaccineSystem(childSelect.Code);
          if (res && res.StatusCode === 200) {
            setListVaccineSystem(res.Data);
          } else {
            notification.error({
              message: "Lỗi",
              description: res.Message,
            });
          }
        };
        getVaccineSystem();
      } else {
        const getVaccineDefine = async () => {
          const res = await vaccineService.getVaccineDefine(childSelect.Code);
          if (res && res.StatusCode === 200) {
            setListVaccineDefine(res.Data);
          } else {
            notification.error({
              message: "Lỗi",
              description: res.Message,
            });
          }
        };
        getVaccineDefine();
      }
    }
  }, [type]);

  const handleCancel = () => {
    setopenModalActivitySelect(false);
    setStatusModal(null);
    // setActivitySelect("");
  };
  const onChangeSegmented = (value) => {
    const el = document.querySelectorAll(
      ".containerModal__box__vaccine__control .ant-segmented-item"
    );
    if (value === "Vaccine khuyến nghị") {
      el[0].style.color = "#fff";
      el[1].style.color = "#282828";
    } else if (value === "Vaccine khác") {
      el[0].style.color = "#282828";
      el[1].style.color = "#fff";
    }
    setTabSelect("1");
    setTabSelectOther("1");
    setType(value);
    if (value === "Vaccine khuyến nghị") {
      setTypeImport("system");
    } else {
      setTypeImport("define");
    }
  };

  const handleDataVaccineSystem = (res) => {
    if (res && res.Data) {
      let data = [];
      let dataTmp = [...res.Data];
      for (let i = 0; i < dataTmp.length; i++) {
        for (let j = 0; j < dataTmp[i].Vaccines.length; j++) {
          if (dataTmp[i].Vaccines[j].Records.length > 0) {
            for (let k = 0; k < dataTmp[i].Vaccines[j].Records.length; k++) {
              dataTmp[i].Vaccines[j].Records[k].No = k + 1;
              dataTmp[i].Vaccines[j].Records[k].Name =
                dataTmp[i].Vaccines[j].Name;
              dataTmp[i].Vaccines[j].Records[k].VaccineCode =
                dataTmp[i].Vaccines[j].Code;
              dataTmp[i].Vaccines[j].Records[k].Disease =
                dataTmp[i].Vaccines[j].Disease;
              dataTmp[i].Vaccines[j].Records[k].BasicAmount =
                dataTmp[i].Vaccines[j].BasicAmount;
              dataTmp[i].Vaccines[j].Records[k].RecordCode =
                dataTmp[i].Vaccines[j].Records[k].Code;
            }
          } else {
            dataTmp[i].Vaccines.splice(j, 1);
            j--;
          }
        }
        if (dataTmp[i].Vaccines.length > 0) {
          data.push(dataTmp[i]);
        }
      }
      setListVaccineSystemChild(data);
    }
  };

  const onChangeTabs = async (key) => {
    setTabSelect(key);
    if (key === "2") {
      setListVaccineSystemChild([]);
      const res = await vaccineService.getVaccineSystem(childSelect.Code);
      if (res && res.StatusCode === 200) {
        handleDataVaccineSystem(res);
      }
    } else {
      const res = await vaccineService.getVaccineSystem(childSelect.Code);
      if (res && res.StatusCode === 200) {
        setListVaccineSystem(res.Data);
      }
      setEditReordSystem(false);
    }
  };

  const handleDataVaccineDefine = (res) => {
    if (res && res.Data) {
      let dataTmp = [...res.Data];
      for (let i = 0; i < dataTmp.length; i++) {
        if (dataTmp[i].Records.length > 0) {
          for (let k = 0; k < dataTmp[i].Records.length; k++) {
            dataTmp[i].Records[k].No = k + 1;
            dataTmp[i].Records[k].No = k + 1;
            dataTmp[i].Records[k].Name = dataTmp[i].Name;
            dataTmp[i].Records[k].VaccineCode = dataTmp[i].Code;
            dataTmp[i].Records[k].Disease = dataTmp[i].Disease;
            dataTmp[i].Records[k].BasicAmount = dataTmp[i].BasicAmount;
            dataTmp[i].Records[k].RecordCode = dataTmp[i].Records[k].Code;
          }
        } else {
          dataTmp.splice(i, 1);
          i--;
        }
      }
      setListVaccineDefineChild(dataTmp);
    }
  };

  const onChangeTabsOther = async (key) => {
    setTabSelectOther(key);
    if (key === "2") {
      setListVaccineDefineChild([]);
      const res = await vaccineService.getVaccineDefine(childSelect.Code);
      if (res && res.StatusCode === 200) {
        handleDataVaccineDefine(res);
      }
    } else {
      const res = await vaccineService.getVaccineDefine(childSelect.Code);
      if (res && res.StatusCode === 200) {
        setListVaccineDefine(res.Data);
      }
      setEditReordSystem(false);
    }
  };

  const showDrawer = () => {
    setEditReordSystem(false);
    setOpenDrawer(true);
  };

  const onClose = () => {
    setOpenDrawer(false);
  };

  const showDrawerAddVaccine = () => {
    setOpenDrawerAddVaccine(true);
  };

  const onCloseAddVaccine = () => {
    setEditVaccineDefine(false);
    setOpenDrawerAddVaccine(false);
  };

  const handleImportVaccine = async () => {
    setConfirmLoading(true);
    const res = await vaccineService.importVaccineSystem({
      childCode: childSelect.Code,
      date,
      note,
      vaccineCode: vaccineSelected.Code,
      statusVaccine,
    });
    if (res && res.StatusCode === 200) {
      const resV = await vaccineService.getVaccineSystem(childSelect.Code);
      if (resV && res.StatusCode === 200) {
        setListVaccineSystem(resV.Data);
      }
      notification.success({
        message: "Thành công",
        description: res.Message,
      });
      setConfirmLoading(false);
      setOpenDrawer(false);
      setDate(dayjs().format("DD-MM-YYYY"));
      setNote("");
    } else {
      notification.error({
        message: "Lỗi",
        description: res.Message,
      });
      setConfirmLoading(false);
    }
  };

  const handleUpdateVaccineSystem = async () => {
    try {
      setConfirmLoading(true);
      const res = await vaccineService.updateRecordVaccineSystem({
        childCode: childSelect.Code,
        date,
        note,
        vaccineCode: vaccineSelected.VaccineCode,
        statusVaccine,
        recordCode: vaccineSelected.Code,
      });
      if (res && res.StatusCode === 200) {
        const resV = await vaccineService.getVaccineSystem(childSelect.Code);
        if (resV && res.StatusCode === 200) {
          handleDataVaccineSystem(resV);
        }
        notification.success({
          message: "Thành công",
          description: res.Message,
        });
        setConfirmLoading(false);
        setOpenDrawer(false);
      } else {
        notification.error({
          message: "Lỗi",
          description: res.Message,
        });
        setConfirmLoading(false);
      }
    } catch (e) {
      console.log(e);
      setConfirmLoading(false);
    }
  };

  const handleDeleteVaccineSystem = async (code) => {
    confirm({
      title: "Bạn có chắc chắn muốn xóa mũi tiêm này không?",
      icon: <ExclamationCircleFilled />,
      okText: "Có",
      okType: "danger",
      cancelText: "Không",
      async onOk() {
        try {
          const res = await vaccineService.deleteRecordVaccineSystem(code);
          if (res && res.StatusCode === 200) {
            if (typeImport === "system") {
              const resV = await vaccineService.getVaccineSystem(
                childSelect.Code
              );
              if (resV && res.StatusCode === 200) {
                handleDataVaccineSystem(resV);
              }
            } else {
              const resV = await vaccineService.getVaccineDefine(
                childSelect.Code
              );
              if (resV && res.StatusCode === 200) {
                handleDataVaccineDefine(resV);
              }
            }
            notification.success({
              message: "Thành công",
              description: res.Message,
            });
          } else {
            notification.error({
              message: "Lỗi",
              description: res.Message,
            });
          }
        } catch (e) {
          console.log(e);
        }
      },
    });
  };

  const handleAddVaccine = async (values, setFieldValue) => {
    setConfirmLoadingAdd(true);
    const res = await vaccineService.addVaccineDefine({
      nameVaccine: values.name,
      noteVaccine: values.note,
      diseaseVaccine: values.disease,
      amoundVaccine: values.amount,
    });
    if (res && res.StatusCode === 200) {
      const resV = await vaccineService.getVaccineDefine(childSelect.Code);
      if (resV && res.StatusCode === 200) {
        setListVaccineDefine(resV.Data);
      }
      notification.success({
        message: "Thành công",
        description: res.Message,
      });
      setConfirmLoadingAdd(false);
      setOpenDrawerAddVaccine(false);
      setFieldValue("name", "");
      setFieldValue("note", "");
      setFieldValue("disease", "");
      setFieldValue("amount", 1);
    } else {
      notification.error({
        message: "Lỗi",
        description: res.Message,
      });
      setConfirmLoadingAdd(false);
    }
  };

  const handleUpdateVaccine = async (values, setFieldValue) => {
    setConfirmLoadingAdd(true);
    const res = await vaccineService.updateVaccineDefine({
      nameVaccine: values.name,
      noteVaccine: values.note,
      diseaseVaccine: values.disease,
      amoundVaccine: values.amount,
      codeVaccine: vaccineSelectedDefine.Code,
    });
    if (res && res.StatusCode === 200) {
      const resV = await vaccineService.getVaccineDefine(childSelect.Code);
      if (resV && res.StatusCode === 200) {
        setListVaccineDefine(resV.Data);
      }
      notification.success({
        message: "Thành công",
        description: res.Message,
      });
      setConfirmLoadingAdd(false);
      setOpenDrawerAddVaccine(false);
      setFieldValue("name", "");
      setFieldValue("note", "");
      setFieldValue("disease", "");
      setFieldValue("amount", 1);
    } else {
      notification.error({
        message: "Lỗi",
        description: res.Message,
      });
      setConfirmLoadingAdd(false);
    }
  };

  const handleImportVaccineDefine = async (values) => {
    setConfirmLoading(true);
    const res = await vaccineService.importVaccineDefine({
      childCode: childSelect.Code,
      date,
      note,
      vaccineCode: vaccineSelectedDefine.Code,
      statusVaccine,
    });
    if (res && res.StatusCode === 200) {
      const resV = await vaccineService.getVaccineDefine(childSelect.Code);
      if (resV && res.StatusCode === 200) {
        setListVaccineDefine(resV.Data);
      }
      notification.success({
        message: "Thành công",
        description: res.Message,
      });
      setConfirmLoading(false);
      setOpenDrawer(false);
      setDate(dayjs().format("DD-MM-YYYY"));
      setNote("");
    } else {
      notification.error({
        message: "Lỗi",
        description: res.Message,
      });
      setConfirmLoading(false);
    }
  };

  const handleUpdateVaccineDefine = async () => {
    try {
      setConfirmLoading(true);
      const res = await vaccineService.updateRecordVaccineSystem({
        childCode: childSelect.Code,
        date,
        note,
        vaccineCode: vaccineSelectedDefine.VaccineCode,
        statusVaccine,
        recordCode: vaccineSelectedDefine.Code,
      });
      if (res && res.StatusCode === 200) {
        const resV = await vaccineService.getVaccineDefine(childSelect.Code);
        if (resV && res.StatusCode === 200) {
          handleDataVaccineDefine(resV);
        }
        notification.success({
          message: "Thành công",
          description: res.Message,
        });
        setConfirmLoading(false);
        setOpenDrawer(false);
      } else {
        notification.error({
          message: "Lỗi",
          description: res.Message,
        });
        setConfirmLoading(false);
      }
    } catch (e) {
      console.log(e);
      setConfirmLoading(false);
    }
  };

  const handleDeleteVaccineDefine = async (setFieldValue) => {
    setConfirmLoadingDeleteVaccine(true);
    const res = await vaccineService.deleteVaccineDefine(
      vaccineSelectedDefine.Code
    );
    if (res && res.StatusCode === 200) {
      const resV = await vaccineService.getVaccineDefine(childSelect.Code);
      if (resV && res.StatusCode === 200) {
        setListVaccineDefine(resV.Data);
      }
      notification.success({
        message: "Thành công",
        description: res.Message,
      });
      setConfirmLoadingDeleteVaccine(false);
      setOpenDrawerAddVaccine(false);
      setFieldValue("name", "");
      setFieldValue("note", "");
      setFieldValue("disease", "");
      setFieldValue("amount", 1);
    } else {
      notification.error({
        message: "Lỗi",
        description: res.Message,
      });
      setConfirmLoadingDeleteVaccine(false);
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#6ba769",
        },
      }}
    >
      <Modal
        className="containerModal__vaccine"
        title={activitySelect}
        open={open}
        onOk={() => {}}
        onCancel={handleCancel}
        okText="Lưu"
        cancelText="Hủy"
        footer={null}
      >
        {statusModal === null && (
          <div className="containerModal__box__vaccine">
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
            <div className="containerModal__box__vaccine__control">
              <Segmented
                block
                options={["Vaccine khuyến nghị", "Vaccine khác"]}
                onChange={onChangeSegmented}
              />
              <div className="containerModal__box__vaccine__control__content">
                {type === "Vaccine khuyến nghị" && (
                  <div className="containerModal__box__vaccine__control__content__box">
                    <Row className="containerModal__box__vaccine__control__content__box__item">
                      <Col span={24}>
                        <Tabs
                          activeKey={tabSelect}
                          onChange={onChangeTabs}
                          tabBarExtraContent={<></>}
                        >
                          <Tabs.TabPane tab="Vaccine khuyến nghị" key="1">
                            <div>
                              {listVaccineSystem.map((item, index) => (
                                <Row key={`A${index}`}>
                                  <Col
                                    span={24}
                                    style={{ marginBottom: "8px" }}
                                  >
                                    <span
                                      style={{
                                        fontSize: "18px",
                                      }}
                                    >
                                      {item.FromMonth !== item.ToMonth
                                        ? `Từ ${item.FromMonth} đến ${item.ToMonth} tháng tuổi`
                                        : `${item.FromMonth} tháng tuổi`}
                                    </span>
                                  </Col>
                                  <Col span={24} className="vaccineBox">
                                    <span style={{ fontSize: "16px" }}>
                                      {item.Vaccines.map(
                                        (itemVaccine, index) => (
                                          <div
                                            key={itemVaccine.Code}
                                            style={{
                                              padding: "8px 16px",
                                              borderRadius: "8px",
                                              border: "1px solid #ccc",
                                              marginBottom: "8px",
                                              display: "flex",
                                              justifyContent: "space-between",
                                              alignItems: "center",
                                            }}
                                          >
                                            <div>
                                              <p style={{ marginBottom: "0" }}>
                                                {itemVaccine.Name}
                                              </p>
                                              <p
                                                style={{
                                                  marginBottom: "0",
                                                  color: "#aaa",
                                                }}
                                              >
                                                {itemVaccine.Disease}
                                              </p>
                                              <p
                                                style={{
                                                  marginBottom: "0",
                                                  color: "#aaa",
                                                  fontSize: "13px",
                                                }}
                                              >
                                                Tổng số mũi cần tiêm:{" "}
                                                {itemVaccine.BasicAmount}
                                              </p>
                                            </div>
                                            <div>
                                              {itemVaccine.Records.length <
                                                itemVaccine.BasicAmount && (
                                                <Button
                                                  onClick={() => {
                                                    showDrawer(true);
                                                    setVaccineSelected(
                                                      itemVaccine
                                                    );
                                                  }}
                                                >
                                                  Thêm
                                                </Button>
                                              )}
                                            </div>
                                          </div>
                                        )
                                      )}
                                    </span>
                                  </Col>
                                </Row>
                              ))}
                            </div>
                          </Tabs.TabPane>
                          <Tabs.TabPane tab="Danh sách vaccine của bé" key="2">
                            <div>
                              {listVaccineSystemChild.map((item, index) => (
                                <Row key={`v${index}`}>
                                  <Col
                                    span={24}
                                    style={{ marginBottom: "8px" }}
                                  >
                                    <span
                                      style={{
                                        fontSize: "18px",
                                      }}
                                    >
                                      {item.FromMonth !== item.ToMonth
                                        ? `Từ ${item.FromMonth} đến ${item.ToMonth} tháng tuổi`
                                        : `${item.FromMonth} tháng tuổi`}
                                    </span>
                                  </Col>
                                  <Col span={24} className="vaccineBox">
                                    <span style={{ fontSize: "16px" }}>
                                      {item.Vaccines.map(
                                        (itemVaccine, index) => (
                                          <div
                                            key={index}
                                            style={{
                                              padding: "8px 16px",
                                              borderRadius: "8px",
                                              border: "1px solid #ccc",
                                              marginBottom: "8px",
                                            }}
                                          >
                                            <div>
                                              <p style={{ marginBottom: "0" }}>
                                                {itemVaccine.Name}
                                              </p>
                                              <p
                                                style={{
                                                  marginBottom: "16px",
                                                  color: "#aaa",
                                                }}
                                              >
                                                {itemVaccine.Disease}
                                              </p>
                                              <Row>
                                                <Col span={24}>
                                                  <Table
                                                    style={{ width: "100%" }}
                                                    columns={columns}
                                                    dataSource={
                                                      itemVaccine.Records
                                                    }
                                                    pagination={false}
                                                  />
                                                </Col>
                                              </Row>
                                            </div>
                                          </div>
                                        )
                                      )}
                                    </span>
                                  </Col>
                                </Row>
                              ))}
                            </div>
                          </Tabs.TabPane>
                        </Tabs>
                      </Col>
                    </Row>
                  </div>
                )}
                {type === "Vaccine khác" && (
                  <div className="containerModal__box__vaccine__control__content__box">
                    <Row className="containerModal__box__vaccine__control__content__box__item">
                      <Col span={24}>
                        <Tabs
                          activeKey={tabSelectOther}
                          onChange={onChangeTabsOther}
                          tabBarExtraContent={
                            <>
                              {tabSelectOther === "1" && (
                                <Button
                                  onClick={() => {
                                    setNameVaccine("");
                                    setDiseaseVaccine("");
                                    setBasicAmount(1);
                                    setNoteVaccine("");
                                    showDrawerAddVaccine(true);
                                    setEditVaccineDefine(false);
                                  }}
                                >
                                  Thêm vaccine khác
                                </Button>
                              )}
                            </>
                          }
                        >
                          <Tabs.TabPane tab="Vaccine khác" key="1">
                            {listVaccineDefine.map((itemVaccine, index) => (
                              <div
                                key={index}
                                style={{
                                  padding: "8px 16px",
                                  borderRadius: "8px",
                                  border: "1px solid #ccc",
                                  marginBottom: "8px",
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  fontSize: "16px",
                                }}
                              >
                                <div>
                                  <p style={{ marginBottom: "0" }}>
                                    {itemVaccine.Name}
                                  </p>
                                  <p
                                    style={{
                                      marginBottom: "0",
                                      color: "#aaa",
                                    }}
                                  >
                                    {itemVaccine.Disease}
                                  </p>
                                  <p
                                    style={{
                                      marginBottom: "0",
                                      color: "#aaa",
                                      fontSize: "13px",
                                    }}
                                  >
                                    Tổng số mũi cần tiêm:{" "}
                                    {itemVaccine.BasicAmount}
                                  </p>
                                </div>
                                <div>
                                  <div
                                    style={{
                                      display: "flex",
                                      gap: "8px",
                                    }}
                                  >
                                    <div>
                                      {itemVaccine.Records.length <
                                        itemVaccine.BasicAmount && (
                                        <Button
                                          onClick={() => {
                                            setVaccineSelectedDefine(
                                              itemVaccine
                                            );
                                            setOpenDrawer(true);
                                          }}
                                        >
                                          Thêm
                                        </Button>
                                      )}
                                    </div>
                                    <div>
                                      <Button
                                        onClick={() => {
                                          setVaccineSelectedDefine(itemVaccine);
                                          setNameVaccine(itemVaccine.Name);
                                          setNoteVaccine(itemVaccine.Note);
                                          setDiseaseVaccine(
                                            itemVaccine.Disease
                                          );
                                          setBasicAmount(
                                            itemVaccine.BasicAmount
                                          );
                                          setOpenDrawerAddVaccine(true);
                                          setEditVaccineDefine(true);
                                        }}
                                        icon={<UilEdit size={18} />}
                                      ></Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </Tabs.TabPane>
                          <Tabs.TabPane tab="Danh sách vaccine của bé" key="2">
                            <div>
                              <Row>
                                <Col span={24} className="vaccineBox">
                                  <span style={{ fontSize: "16px" }}>
                                    {listVaccineDefineChild.map(
                                      (itemVaccine, index) => (
                                        <div
                                          key={index}
                                          style={{
                                            padding: "8px 16px",
                                            borderRadius: "8px",
                                            border: "1px solid #ccc",
                                            marginBottom: "8px",
                                          }}
                                        >
                                          <div>
                                            <p style={{ marginBottom: "0" }}>
                                              {itemVaccine.Name}
                                            </p>
                                            <p
                                              style={{
                                                marginBottom: "16px",
                                                color: "#aaa",
                                              }}
                                            >
                                              {itemVaccine.Disease}
                                            </p>
                                            <Row>
                                              <Col span={24}>
                                                <Table
                                                  style={{ width: "100%" }}
                                                  columns={columns}
                                                  dataSource={
                                                    itemVaccine.Records
                                                  }
                                                  pagination={false}
                                                />
                                              </Col>
                                            </Row>
                                          </div>
                                        </div>
                                      )
                                    )}
                                  </span>
                                </Col>
                              </Row>
                            </div>
                          </Tabs.TabPane>
                        </Tabs>
                      </Col>
                    </Row>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {statusModal !== null && (
          <Result
            className="containerModal__result__vaccine"
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
      <Drawer
        title={`Thêm vaccine cho trẻ ${childSelect.Name}`}
        placement="right"
        closable={false}
        onClose={onClose}
        open={openDrawer}
        width={500}
        key="right"
      >
        <Row style={{ marginBottom: "8px" }}>
          <Col span={8} style={{ fontSize: "16px", color: "#8f8f8f" }}>
            Trẻ
          </Col>
          <Col span={16} style={{ fontSize: "16px", color: "#282828" }}>
            : {childSelect.Name}
          </Col>
        </Row>
        <Row style={{ marginBottom: "8px" }}>
          <Col span={8} style={{ fontSize: "16px", color: "#8f8f8f" }}>
            Vaccine
          </Col>
          <Col span={16} style={{ fontSize: "16px", color: "#282828" }}>
            :{" "}
            {typeImport === "system"
              ? vaccineSelected?.Name
              : vaccineSelectedDefine?.Name}
          </Col>
        </Row>
        <Row style={{ marginBottom: "8px" }}>
          <Col span={8} style={{ fontSize: "16px", color: "#8f8f8f" }}>
            Trị bệnh
          </Col>
          <Col span={16} style={{ fontSize: "16px", color: "#282828" }}>
            :{" "}
            {typeImport === "system"
              ? vaccineSelected?.Disease
              : vaccineSelectedDefine?.Disease}
          </Col>
        </Row>
        <Row style={{ marginBottom: "8px" }}>
          <Col span={8} style={{ fontSize: "16px", color: "#8f8f8f" }}>
            Tổng số mũi tiêm
          </Col>
          <Col span={16} style={{ fontSize: "16px", color: "#282828" }}>
            :{" "}
            {typeImport === "system"
              ? vaccineSelected?.BasicAmount
              : vaccineSelectedDefine?.BasicAmount}
          </Col>
        </Row>
        <div className="divider-20"></div>
        <Row style={{ marginBottom: "8px" }} gutter={50}>
          <Col span={12}>
            <label
              style={{ fontSize: "16px", marginBottom: "8px" }}
              className="inputProfile__label"
              htmlFor="birthday"
            >
              Ngày tiêm
            </label>
            <DatePicker
              id="dateVaccine"
              placeholder="Ngày tiêm"
              style={{ width: "100%", height: "40px" }}
              locale={locale}
              value={dayjs(date, dateFormat)}
              format={dateFormat}
              onChange={(date, dateString) => {
                setDate(dateString);
              }}
            />
          </Col>

          <Col span={12}>
            <label
              style={{ fontSize: "16px", marginBottom: "8px" }}
              className="inputProfile__label"
              htmlFor="birthday"
            >
              Tình trạng
            </label>
            <Select
              placeholder="Chọn"
              style={{
                width: "100%",
              }}
              onChange={(value) => {
                setStatusVaccine(value);
              }}
              options={[
                {
                  label: `Đã tiêm`,
                  value: true,
                },
                {
                  label: `Chưa tiêm`,
                  value: false,
                },
              ]}
              value={statusVaccine}
            />
          </Col>
        </Row>
        <Row>
          <label
            style={{ fontSize: "16px", marginBottom: "8px" }}
            className="inputProfile__label"
            htmlFor="birthday"
          >
            Ghi chú
          </label>
          <TextareaAutosize
            className="containerModalVaccine__textarea__input__box"
            minRows={5}
            onChange={(e) => {
              setNote(e.target.value);
            }}
            value={note}
          />
        </Row>
        <div className="divider-20"></div>
        <Row>
          <Col span={24}>
            <Button
              className="addVaccine"
              type="primary"
              onClick={
                typeImport === "system"
                  ? editReordSystem
                    ? handleUpdateVaccineSystem
                    : handleImportVaccine
                  : editReordSystem
                  ? handleUpdateVaccineDefine
                  : handleImportVaccineDefine
              }
              loading={confirmLoading}
            >
              {editReordSystem ? "Cập nhật" : "Thêm"}
            </Button>
          </Col>
        </Row>
      </Drawer>
      <Drawer
        title={`Thêm vaccine khác`}
        placement="right"
        closable={false}
        onClose={onCloseAddVaccine}
        open={openDrawerAddVaccine}
        width={500}
        key="rightAdd"
      >
        <Formik
          enableReinitialize
          initialValues={{
            name: nameVaccine ? nameVaccine : "",
            note: noteVaccine ? noteVaccine : "",
            disease: diseaseVaccine ? diseaseVaccine : "",
            amount: basicAmount,
          }}
          onSubmit={(values, { setErrors, setFieldValue }) => {
            let check = true;
            let errors = {};
            if (!values.name) {
              errors.name = "Tên vaccine không được để trống";
              check = false;
            }
            if (!values.disease) {
              errors.disease = "Ngừa bệnh không được để trống";
              check = false;
            }

            setErrors(errors);
            if (check) {
              if (editVaccineDefine) {
                handleUpdateVaccine(values, setFieldValue);
              } else {
                handleAddVaccine(values, setFieldValue);
              }
            }
          }}
        >
          {({
            values,
            errors,
            handleChange,
            handleSubmit,
            setFieldValue,
            setFieldError,
          }) => (
            <Form>
              <Row gutter={50} style={{ marginBottom: "8px" }}>
                <Col span={24}>
                  <InputField
                    className="form-control__addVaccine"
                    placeholder="Tên vaccine"
                    id="name"
                    type="text"
                    value={values.name}
                    handleChange={(e) => {
                      handleChange(e);
                    }}
                    validate={{}}
                    height={40}
                    errors={errors.name}
                    label="Tên vaccine"
                  />
                </Col>
              </Row>
              <Row style={{ marginBottom: "8px" }}>
                <Col span={24}>
                  <InputField
                    className="form-control__addVaccine"
                    placeholder="Ngừa bệnh"
                    id="disease"
                    type="text"
                    value={values.disease}
                    handleChange={(e) => {
                      handleChange(e);
                    }}
                    validate={{}}
                    height={40}
                    errors={errors.disease}
                    label="Ngừa bệnh"
                  />
                </Col>
              </Row>
              <Row style={{ marginBottom: "8px" }}>
                <Col span={24}>
                  <label
                    className="inputProfile__label"
                    htmlFor="birthday"
                    style={{ marginBottom: "8px" }}
                  >
                    Ghi chú
                  </label>
                  <TextareaAutosize
                    id="note"
                    className="containerModalVaccine__textarea__input__box"
                    minRows={5}
                    onChange={(e) => {
                      handleChange(e);
                    }}
                    value={values.note}
                    style={{ borderWidth: "2px" }}
                  />
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <label
                    className="inputProfile__label"
                    htmlFor="birthday"
                    style={{ marginBottom: "8px" }}
                  >
                    Tổng số mũi cần tiêm
                  </label>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <div
                      onClick={
                        values.amount === 1
                          ? null
                          : () =>
                              setFieldValue("amount", Number(values.amount) - 1)
                      }
                      style={{
                        borderRadius: "8px",
                        border: `1.5px solid ${"#aaa"}`,
                        padding: "4px",
                        cursor: `${
                          values.amount === 1 ? "not-allowed" : "pointer"
                        }`,
                      }}
                    >
                      <UilMinus color="#aaa" disabled={values.amount === 1} />
                    </div>
                    <div
                      style={{
                        borderRadius: "8px",
                        border: "1.5px solid #6ba769",
                        padding: "4px 16px",
                        width: "50px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "16px",
                          fontWeight: "500",
                          color: "#6ba769",
                        }}
                      >
                        {values.amount}
                      </span>
                    </div>
                    <div
                      onClick={
                        values.amount === 5
                          ? null
                          : () =>
                              setFieldValue("amount", Number(values.amount) + 1)
                      }
                      style={{
                        borderRadius: "8px",
                        border: `1.5px solid ${"#aaa"}`,
                        padding: "4px",
                        cursor: `${
                          values.amount === 5 ? "not-allowed" : "pointer"
                        }`,
                      }}
                    >
                      <UilPlus color="#aaa" disabled={values.amount === 5} />
                    </div>
                  </div>
                </Col>
              </Row>
              <Button
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  background: "#6ba769",
                  width: "100%",
                  marginTop: "20px",
                  height: "50px",
                  fontSize: "20px",
                  fontWeight: "500",
                  borderRadius: "8px",
                  color: "#fff",
                }}
                type="submit"
                onClick={handleSubmit}
                loading={confirmLoadingAdd}
              >
                {editVaccineDefine ? "Cập nhật" : "Thêm"}
              </Button>
              {editVaccineDefine && (
                <Button
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    background: "#b91c1c",
                    width: "100%",
                    marginTop: "20px",
                    height: "50px",
                    fontSize: "20px",
                    fontWeight: "500",
                    borderRadius: "8px",
                    color: "#fff",
                    borderColor: "#b91c1c",
                  }}
                  loading={confirmLoadingDeleteVaccine}
                  onClick={() => handleDeleteVaccineDefine(setFieldValue)}
                >
                  Xóa
                </Button>
              )}
            </Form>
          )}
        </Formik>
      </Drawer>
    </ConfigProvider>
  );
}

export default Vaccine;
