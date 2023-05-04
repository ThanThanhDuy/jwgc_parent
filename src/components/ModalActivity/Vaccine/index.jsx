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
  UilExternalLinkAlt,
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
  const [editReordDefine, setEditReordDefine] = useState(false);
  const [confirmLoadingDeleteVaccine, setConfirmLoadingDeleteVaccine] =
    useState(false);
  const [typeImport, setTypeImport] = useState("system");
  const [editVaccineDefine, setEditVaccineDefine] = useState(false);
  const [countVaccine, setCountVaccine] = useState(0);
  const [recordSelected, setRecordSelected] = useState(null);

  const setopenModalActivitySelect = useSetRecoilState(
    openModalActivitySelectState
  );

  const childSelect = useRecoilValue(childSelectState);

  const columnsSystem = [
    {
      title: "Mũi tiêm",
      dataIndex: "No",
      key: "No",
      width: "11%",
      align: "center",
    },
    {
      title: "Dự kiến tiêm",
      dataIndex: "IntendedDate",
      key: "IntendedDate",
      width: "16%",
      align: "center",
    },
    {
      title: "Tiêm thực tế",
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
      title: "Cập nhật",
      key: "action",
      align: "center",
      width: "15%",
      render: (_, record) => (
        <Space size="middle">
          <UilExternalLinkAlt
            onClick={() => {
              if (type === "Vaccine khuyến nghị") {
                if (
                  moment().isBefore(moment(record.IntendedDate, "DD-MM-YYYY"))
                ) {
                  notification.warning({
                    message: "Thông báo",
                    description: "Chưa đến ngày tiêm, vui lòng quay lại sau!",
                  });
                  return;
                }
                setVaccineSelected(record);
              } else {
                setVaccineSelectedDefine(record);
              }
              setDate(record.Date);
              setNote(record.Note);
              setStatusVaccine(record.Status);
              setOpenDrawer(true);
              // setEditReordSystem(true);
            }}
            className="edit"
            size={20}
          />
          {/* <UilTrashAlt
            onClick={() => {
              handleDeleteVaccineSystem(record.Code);
            }}
            className="delete"
            size={20}
          /> */}
        </Space>
      ),
    },
  ];

  const columns = [
    {
      title: "Mũi tiêm",
      dataIndex: "No",
      key: "No",
      width: "11%",
      align: "center",
    },
    {
      title: "Dự kiến tiêm",
      dataIndex: "IntendedDate",
      key: "IntendedDate",
      width: "16%",
      align: "center",
      render: (IntendedDate) => (
        <>{IntendedDate ? <span>{IntendedDate}</span> : <span>- - -</span>}</>
      ),
    },
    {
      title: "Tiêm thực tế",
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
              console.log("record", record);
              setVaccineSelectedDefine(record);
              setDate(record.Date);
              setNote(record.Note);
              setStatusVaccine(record.Status);
              setOpenDrawer(true);
              setEditReordDefine(true);
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
        setTypeImport("system");
        const getVaccineSystem = async () => {
          setListVaccineSystemChild([]);
          const res = await vaccineService.getVaccineSystem(childSelect.Code);
          if (res && res.StatusCode === 200) {
            handleDataVaccineSystem(res);
          } else {
            notification.error({
              message: "Lỗi",
              description: res.Message,
            });
          }
        };
        getVaccineSystem();
      } else {
        setTypeImport("define");
        const getVaccineDefine = async () => {
          setListVaccineDefineChild([]);
          const res = await vaccineService.getVaccineDefine(childSelect.Code);
          if (res && res.StatusCode === 200) {
            handleDataVaccineDefine(res);
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
  }, [type, childSelect]);

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
              dataTmp[i].Vaccines[j].Records[k].Index = k;
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
              dataTmp[i].Vaccines[j].Records[k].IntendedDate =
                dataTmp[i].Vaccines[j].Records[k].IntendedDate;
              dataTmp[i].Vaccines[j].Records[k].Vaccine =
                dataTmp[i].Vaccines[j];
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
      // setEditReordSystem(false);
    }
  };

  const handleDataVaccineDefine = (res) => {
    if (res && res.Data) {
      let dataTmp = [...res.Data];
      for (let i = 0; i < dataTmp.length; i++) {
        // if (dataTmp[i].Records.length > 0) {
        for (let k = 0; k < dataTmp[i].Records.length; k++) {
          dataTmp[i].Records[k].No = k + 1;
          dataTmp[i].Records[k].Index = k;
          dataTmp[i].Records[k].Name = dataTmp[i].Name;
          dataTmp[i].Records[k].VaccineCode = dataTmp[i].Code;
          dataTmp[i].Records[k].Disease = dataTmp[i].Disease;
          dataTmp[i].Records[k].BasicAmount = dataTmp[i].BasicAmount;
          dataTmp[i].Records[k].RecordCode = dataTmp[i].Records[k].Code;
          dataTmp[i].Records[k].IntendedDate =
            dataTmp[i].Records[k].IntendedDate;
          dataTmp[i].Records[k].Vaccine = dataTmp[i];
        }
        // } else {
        //   dataTmp.splice(i, 1);
        //   i--;
        // }
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
      // setEditReordSystem(false);
    }
  };

  const showDrawer = () => {
    // setEditReordSystem(false);
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
      // debugger;
      if (vaccineSelected.Index > 0) {
        if (statusVaccine) {
          // console.log(vaccineSelected.Vaccine);
          if (vaccineSelected.Vaccine.Records[vaccineSelected.Index - 1].Date) {
            let dateCompare = moment(
              vaccineSelected.Vaccine.Records[vaccineSelected.Index - 1].Date,
              "DD-MM-YYYY"
            ).add(7, "days");
            // console.log(dateCompare);
            // console.log(date);
            if (moment(date, "DD-MM-YYYY").isBefore(dateCompare)) {
              notification.error({
                message: "Lỗi",
                description:
                  "Ngày tiêm phải sau 1 tuần so với ngày tiêm lần trước",
              });
              setConfirmLoading(false);
              return;
            }
          } else {
            notification.error({
              message: "Lỗi",
              description:
                "Bạn vui lòng cập nhật các lần tiêm trước trước khi tiêm lần này",
            });
            setConfirmLoading(false);
            return;
          }
        } else {
          if (vaccineSelected.Vaccine.Records[vaccineSelected.Index + 1].Date) {
            notification.error({
              message: "Lỗi",
              description:
                "Bạn không thể chỉnh sửa trạng thái của lần tiêm này",
            });
            setConfirmLoading(false);
            return;
          }
        }
      } else {
        if (!statusVaccine) {
          if (vaccineSelected.Vaccine.Records[vaccineSelected.Index + 1].Date) {
            notification.error({
              message: "Lỗi",
              description:
                "Bạn không thể chỉnh sửa trạng thái của lần tiêm này",
            });
            setConfirmLoading(false);
            return;
          }
        }
      }
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
      const resv = await vaccineService.getVaccineDefine(childSelect.Code);
      if (resv && resv.StatusCode === 200) {
        handleDataVaccineDefine(resv);
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
      const res = await vaccineService.getVaccineDefine(childSelect.Code);
      if (res && res.StatusCode === 200) {
        handleDataVaccineDefine(res);
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
    if (vaccineSelectedDefine.Records.length > 0) {
      if (statusVaccine) {
        if (
          vaccineSelectedDefine.Records[
            vaccineSelectedDefine.Records.length - 1
          ].Date
        ) {
          let dateCompare = moment(
            vaccineSelectedDefine.Records[
              vaccineSelectedDefine.Records.length - 1
            ].Date,
            "DD-MM-YYYY"
          ).add(7, "days");
          console.log(dateCompare);
          console.log(date);
          if (moment(date, "DD-MM-YYYY").isBefore(dateCompare)) {
            notification.error({
              message: "Lỗi",
              description:
                "Ngày tiêm phải sau 1 tuần so với ngày tiêm lần trước",
            });
            setConfirmLoading(false);
            return;
          }
        } else {
          notification.error({
            message: "Lỗi",
            description:
              "Bạn vui lòng cập nhật các lần tiêm trước trước khi tiêm lần này",
          });
          setConfirmLoading(false);
          return;
        }
      } else {
        let dateCompare = moment(
          vaccineSelectedDefine.Records[
            vaccineSelectedDefine.Records.length - 1
          ]?.IntendedDate
            ? vaccineSelectedDefine.Records[
                vaccineSelectedDefine.Records.length - 1
              ]?.IntendedDate
            : vaccineSelectedDefine.Vaccine.Records[
                vaccineSelectedDefine.Records.length - 1
              ]?.Date,
          "DD-MM-YYYY"
        ).add(7, "days");
        console.log(dateCompare);
        console.log(date);
        if (moment(date, "DD-MM-YYYY").isBefore(dateCompare)) {
          notification.error({
            message: "Lỗi",
            description: "Ngày tiêm phải sau 1 tuần so với ngày tiêm lần trước",
          });
          setConfirmLoading(false);
          return;
        }
      }
    }
    const res = await vaccineService.importVaccineDefine({
      childCode: childSelect.Code,
      date,
      note,
      vaccineCode: vaccineSelectedDefine.Code,
      statusVaccine,
    });
    if (res && res.StatusCode === 200) {
      const resv = await vaccineService.getVaccineDefine(childSelect.Code);
      if (resv && resv.StatusCode === 200) {
        handleDataVaccineDefine(resv);
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
      if (vaccineSelectedDefine.Vaccine.Records.length > 0) {
        if (statusVaccine) {
          if (
            vaccineSelectedDefine.Vaccine.Records[
              vaccineSelectedDefine.Index - 1
            ].Date
          ) {
            let dateCompare = moment(
              vaccineSelectedDefine.Vaccine.Records[
                vaccineSelectedDefine.Index - 1
              ].Date,
              "DD-MM-YYYY"
            ).add(7, "days");
            console.log(dateCompare);
            console.log(date);
            if (moment(date, "DD-MM-YYYY").isBefore(dateCompare)) {
              notification.error({
                message: "Lỗi",
                description:
                  "Ngày tiêm phải sau 1 tuần so với ngày tiêm lần trước",
              });
              setConfirmLoading(false);
              return;
            }
          } else {
            notification.error({
              message: "Lỗi",
              description:
                "Bạn vui lòng cập nhật các lần tiêm trước trước khi tiêm lần này",
            });
            setConfirmLoading(false);
            return;
          }
        } else {
          let dateCompare = moment(
            vaccineSelectedDefine.Vaccine.Records[
              vaccineSelectedDefine.Index - 1
            ]?.IntendedDate
              ? vaccineSelectedDefine.Vaccine.Records[
                  vaccineSelectedDefine.Index - 1
                ]?.IntendedDate
              : vaccineSelectedDefine.Vaccine.Vaccine.Records[
                  vaccineSelectedDefine.Index - 1
                ]?.Date,
            "DD-MM-YYYY"
          ).add(7, "days");
          console.log(dateCompare.format("DD-MM-YYYY"));
          console.log(date);
          if (moment(date, "DD-MM-YYYY").isBefore(dateCompare)) {
            notification.error({
              message: "Lỗi",
              description:
                "Ngày tiêm phải sau 1 tuần so với ngày tiêm lần trước",
            });
            setConfirmLoading(false);
            return;
          }
        }
      }
      const res = await vaccineService.updateRecordVaccineDefine({
        childCode: childSelect.Code,
        date,
        note,
        intendedDate: vaccineSelectedDefine.IntendedDate,
        vaccineCode: vaccineSelectedDefine.VaccineCode,
        statusVaccine,
        recordCode: vaccineSelectedDefine.Code,
      });
      if (res && res.StatusCode === 200) {
        const resv = await vaccineService.getVaccineDefine(childSelect.Code);
        if (resv && resv.StatusCode === 200) {
          handleDataVaccineDefine(resv);
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
      const resv = await vaccineService.getVaccineDefine(childSelect.Code);
      if (resv && resv.StatusCode === 200) {
        handleDataVaccineDefine(resv);
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
                        {/* <Tabs
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
                                              <Button
                                                onClick={() => {
                                                  showDrawer(true);
                                                  setVaccineSelected(
                                                    itemVaccine
                                                  );
                                                  if (
                                                    itemVaccine &&
                                                    itemVaccine.Records.length >
                                                      0
                                                  ) {
                                                    let count = 0;
                                                    for (const item of itemVaccine.Records) {
                                                      item?.Date && count++;
                                                    }
                                                    setCountVaccine(count);
                                                  }
                                                }}
                                              >
                                                Chi tiết
                                              </Button>
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
                          <Tabs.TabPane tab="Danh sách vaccine của bé" key="2"> */}
                        <div>
                          {listVaccineSystemChild.map((item, index) => (
                            <Row key={`v${index}`}>
                              <Col span={24} style={{ marginBottom: "8px" }}>
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
                                  {item.Vaccines.map((itemVaccine, index) => (
                                    <div
                                      key={itemVaccine.Code}
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
                                            marginBottom: "0",
                                            marginTop: "6px",
                                            color: "#aaa",
                                          }}
                                        >
                                          <span
                                            style={{
                                              marginBottom: "0px",
                                              color: "#000000e0",
                                            }}
                                          >
                                            Phòng ngừa bệnh:{" "}
                                          </span>
                                          {itemVaccine.Disease}
                                        </p>
                                        <p
                                          style={{
                                            marginBottom: "16px",
                                            marginTop: "6px",
                                            color: "#aaa",
                                          }}
                                        >
                                          <span
                                            style={{
                                              marginBottom: "0",
                                              color: "#000000e0",
                                            }}
                                          >
                                            Lưu ý:{" "}
                                          </span>
                                          {itemVaccine.Note}
                                        </p>
                                        <Row>
                                          <Col span={24}>
                                            <Table
                                              style={{ width: "100%" }}
                                              columns={columnsSystem}
                                              dataSource={itemVaccine.Records}
                                              pagination={false}
                                            />
                                          </Col>
                                        </Row>
                                      </div>
                                    </div>
                                  ))}
                                </span>
                              </Col>
                            </Row>
                          ))}
                        </div>
                        {/* </Tabs.TabPane>
                        </Tabs> */}
                      </Col>
                    </Row>
                  </div>
                )}
                {type === "Vaccine khác" && (
                  <div className="containerModal__box__vaccine__control__content__box">
                    <Row className="containerModal__box__vaccine__control__content__box__item">
                      <Col span={24}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            padding: "0 16px 16px",
                          }}
                        >
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
                        </div>
                        {/* <Tabs
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
                          </Tabs.TabPane> */}
                        {/* <Tabs.TabPane tab="Danh sách vaccine của bé" key="2"> */}
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
                                        <Row
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                          }}
                                        >
                                          <Col>
                                            <p
                                              style={{
                                                marginBottom: "0",
                                                fontSize: "16px",
                                              }}
                                            >
                                              {itemVaccine.Name}
                                            </p>
                                            <p
                                              style={{
                                                marginBottom: "0",
                                                marginTop: "6px",
                                                color: "#aaa",
                                                fontSize: "16px",
                                              }}
                                            >
                                              <span
                                                style={{
                                                  marginBottom: "0px",
                                                  color: "#000000e0",
                                                }}
                                              >
                                                Phòng ngừa bệnh:{" "}
                                              </span>
                                              {itemVaccine.Disease}
                                            </p>
                                          </Col>
                                          <Col
                                            style={{
                                              display: "flex",
                                              justifyContent: "flex-end",
                                            }}
                                          >
                                            <Button
                                              onClick={() => {
                                                setVaccineSelectedDefine(
                                                  itemVaccine
                                                );
                                                setNameVaccine(
                                                  itemVaccine.Name
                                                );
                                                setNoteVaccine(
                                                  itemVaccine.Note
                                                );
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
                                          </Col>
                                        </Row>
                                        <p
                                          style={{
                                            marginBottom: "16px",
                                            marginTop: "6px",
                                            color: "#aaa",
                                          }}
                                        >
                                          <span
                                            style={{
                                              marginBottom: "0",
                                              color: "#000000e0",
                                            }}
                                          >
                                            Lưu ý:{" "}
                                          </span>
                                          {itemVaccine.Note}
                                        </p>
                                        <div className="divider-20"></div>
                                        <Row>
                                          <Col
                                            span={24}
                                            style={{
                                              display: "flex",
                                              justifyContent: "space-between",
                                              marginBottom: "16px",
                                            }}
                                          >
                                            <div>
                                              <span
                                                style={{
                                                  fontSize: "16px",
                                                  fontWeight: 500,
                                                  textDecoration: "underline",
                                                }}
                                              >
                                                Danh sách mũi tiêm
                                              </span>
                                            </div>
                                            {itemVaccine.Records.length <
                                              itemVaccine.BasicAmount && (
                                              <Button
                                                onClick={() => {
                                                  console.log(itemVaccine);
                                                  setVaccineSelectedDefine(
                                                    itemVaccine
                                                  );
                                                  setOpenDrawer(true);
                                                  setEditReordDefine(false);
                                                  setTypeImport("denfine");
                                                }}
                                              >
                                                Thêm mũi tiêm
                                              </Button>
                                            )}
                                          </Col>
                                          <Col span={24}>
                                            {itemVaccine.Records.length > 0 && (
                                              <Table
                                                style={{ width: "100%" }}
                                                columns={columns}
                                                dataSource={itemVaccine.Records}
                                                pagination={false}
                                              />
                                            )}
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
                        {/* </Tabs.TabPane>
                        </Tabs> */}
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
        title={`Chi tiết vaccine`}
        placement="right"
        closable={false}
        onClose={onClose}
        open={openDrawer}
        width={500}
        key="right"
        extra={
          type === "Vaccine khuyến nghị" && (
            <div>
              <span>
                <span style={{ color: "#0277b7" }}>Dự kiến tiêm:</span>{" "}
                {vaccineSelected?.IntendedDate}
              </span>
            </div>
          )
        }
      >
        {/* <Row style={{ marginBottom: "8px" }}>
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
        </Row> */}
        {/* <Row style={{ marginBottom: "8px" }}>
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
            Lưu ý
          </Col>
          <Col span={16} style={{ fontSize: "16px", color: "#282828" }}>
            :{" "}
            {typeImport === "system"
              ? vaccineSelected?.Note
              : vaccineSelectedDefine?.Note}
          </Col>
        </Row> */}
        {/* <Row style={{ marginBottom: "8px" }}>
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
        <Row style={{ marginBottom: "8px" }}>
          <Col span={8} style={{ fontSize: "16px", color: "#8f8f8f" }}>
            Tổng số mũi đã tiêm
          </Col>
          <Col span={16} style={{ fontSize: "16px", color: "#282828" }}>
            : {countVaccine}
          </Col>
        </Row> */}
        {/* <div className="divider-20"></div> */}
        <Row style={{ marginBottom: "8px" }} gutter={50}>
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
                setDate(null);
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
          <Col span={12}>
            {type === "Vaccine khuyến nghị" ? (
              <>
                {statusVaccine === true && (
                  <>
                    <label
                      style={{ fontSize: "16px", marginBottom: "8px" }}
                      className="inputProfile__label"
                      htmlFor="birthday"
                    >
                      Ngày tiêm
                    </label>
                    <DatePicker
                      id="dateVaccine"
                      placeholder="Chọn ngày"
                      style={{ width: "100%", height: "40px" }}
                      locale={locale}
                      value={date && dayjs(date, dateFormat)}
                      format={dateFormat}
                      onChange={(date, dateString) => {
                        setDate(dateString);
                      }}
                      disabledDate={(current) => {
                        if (statusVaccine) {
                          return current && current > dayjs().endOf("day");
                        } else {
                          return current && current < dayjs().startOf("day");
                        }
                      }}
                    />
                  </>
                )}
              </>
            ) : (
              <>
                <>
                  <label
                    style={{ fontSize: "16px", marginBottom: "8px" }}
                    className="inputProfile__label"
                    htmlFor="birthday"
                  >
                    {statusVaccine ? "Ngày tiêm" : "Dự kiến tiêm"}
                  </label>
                  <DatePicker
                    id="dateVaccine"
                    placeholder="Chọn ngày"
                    style={{ width: "100%", height: "40px" }}
                    locale={locale}
                    value={date && dayjs(date, dateFormat)}
                    format={dateFormat}
                    onChange={(date, dateString) => {
                      setDate(dateString);
                    }}
                    disabledDate={(current) => {
                      if (statusVaccine) {
                        return current && current > dayjs().endOf("day");
                      } else {
                        return current && current < dayjs().startOf("day");
                      }
                    }}
                  />
                </>
              </>
            )}
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
                  ? handleUpdateVaccineSystem
                  : editReordDefine
                  ? handleUpdateVaccineDefine
                  : handleImportVaccineDefine
              }
              loading={confirmLoading}
            >
              {editReordDefine ? "Cập nhật" : "Thêm"}
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
