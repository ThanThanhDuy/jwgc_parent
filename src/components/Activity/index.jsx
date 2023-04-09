import React, { useEffect, useState } from "react";
import { useRecoilValue, useRecoilState } from "recoil";
import { ACTIVITY } from "../../constants/activity";
import {
  activitySelectState,
  childSelectState,
  listChildState,
  openModalActivitySelectState,
  typeState,
} from "../../stores/child";
import ModalNormal from "../ModalActivity/Normal";
import "./index.scss";
import {
  Modal,
  Input,
  notification,
  Empty,
  Tabs,
  Pagination,
  DatePicker,
  Row,
  Col,
  Form as FormAntd,
  Button,
  ConfigProvider,
  Checkbox,
  TimePicker,
} from "antd";
import userService from "../../services/user";
import userAvatar from "../../assets/icons/user.png";
import childrenService from "../../services/children";
// import { UilTimes } from "@iconscout/react-unicons";
import localService from "../../services/local";
import activityService from "../../services/activity";
import Milk from "../ModalActivity/Milk";
import Diaper from "../ModalActivity/Diaper";
import Sleep from "../ModalActivity/Sleep";
import Health from "../ModalActivity/Health";
import Growth from "../ModalActivity/Growth/index";
import HangOut from "../ModalActivity/HangOut";
import Diary from "../ModalActivity/Diary";
import Vaccine from "../ModalActivity/Vaccine";
import { Formik } from "formik";
import moment from "moment";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/vi";
import locale from "antd/es/date-picker/locale/vi_VN";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import InputField from "../InputField";
import { Form } from "reactstrap";

const { Search } = Input;

dayjs.extend(customParseFormat);
const dateFormat = "DD-MM-YYYY";

const DAY = [
  {
    title: "Thứ 2",
    value: 0,
  },
  {
    title: "Thứ 3",
    value: 1,
  },
  {
    title: "Thứ 4",
    value: 2,
  },
  {
    title: "Thứ 5",
    value: 3,
  },
  {
    title: "Thứ 6",
    value: 4,
  },
  {
    title: "Thứ 7",
    value: 5,
  },
  {
    title: "Chủ nhật",
    value: 6,
  },
];

function Activity() {
  const [childSelect, setChildSelect] = useRecoilState(childSelectState);
  const type = useRecoilValue(typeState);
  const [activitySelect, setActivitySelect] =
    useRecoilState(activitySelectState);
  const [openModalActivitySelect, setOpenModalActivitySelect] = useRecoilState(
    openModalActivitySelectState
  );
  const [openModal, setOpenModal] = useState(false);
  const [listUser, setListUser] = useState([]);
  const [typeModal, setTypeModal] = useState("");
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [valueSearch, setValueSearch] = useState("");
  const [tabValue, setTabValue] = useState("1");
  const [listInvite, setListInvite] = useState([]);
  const [listInviteParent, setListInviteParent] = useState([]);
  const [totalUser, setTotalUser] = useState(0);
  const [currentPageUser, setCurrentPageUser] = useState(1);
  const pageSizeUser = 5;
  const [totalInvite, setTotalInvite] = useState(0);
  const [totalInviteParent, setTotalInviteParent] = useState(0);
  const [currentPageInvite, setCurrentPageInvite] = useState(1);
  const pageSizeInvite = 6;
  const [listCate, setListCate] = useState([]);
  const [desWork, setDesWork] = useState("");
  const [agreementWageWork, setAgreementWageWork] = useState("");
  const [startTimeWork, setStartTimeWork] = useState(null);
  const [endTimeWork, setEndTimeWork] = useState(null);
  const [dayOfWeeks, setDayOfWeeks] = useState([]);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [listChild, setListChild] = useRecoilState(listChildState);

  useEffect(() => {
    const fetchCateAcitivity = async () => {
      try {
        const res = await activityService.getCateActivity();
        if (res && res.StatusCode === 200) {
          const data = res.Data.map((item) => {
            return {
              ...item,
              Color: ACTIVITY.find((i) => i.title === item.Name)?.color,
              Icon: ACTIVITY.find((i) => i.title === item.Name)?.icon,
            };
          });
          data.push({
            Name: "Vaccine",
            Color: ACTIVITY.find((i) => i.title === "Vaccine")?.color,
            Icon: ACTIVITY.find((i) => i.title === "Vaccine")?.icon,
            Code: "Vaccine",
          });
          setListCate(data);
        } else {
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchCateAcitivity();
  }, []);

  const handleOpenModal = (typeP) => {
    setTypeModal(typeP);
    setOpenModal(true);
    setTabValue("1");
  };

  const handleAdd = async (item) => {
    let res;
    if (typeModal === "nanny") {
      res = await childrenService.sendInviteToNanny(
        childSelect.Code,
        item.Code
      );
    } else {
      res = await childrenService.sendInviteToParent(
        childSelect.Code,
        item.Code
      );
    }
    if (res && res.StatusCode === 200) {
      if (typeModal === "parent") {
        const res = await userService.searchUser(valueSearch, 1, pageSizeUser);
        if (res && res.StatusCode === 200) {
          if (res.Data.Items.length > 0) {
            setListUser(res.Data.Items);
            setTotalUser(res.Data.TotalItemsCount);
          } else {
            setListUser(null);
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
      } else {
        const res = await userService.searchNanny(valueSearch, 1, pageSizeUser);
        if (res && res.StatusCode === 200) {
          if (res.Data.Items.length > 0) {
            setListUser(res.Data.Items);
            setTotalUser(res.Data.TotalItemsCount);
          } else {
            setListUser(null);
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
      }
    } else {
      notification.error({
        message: "Lỗi",
        description: res.Message,
      });
    }
  };

  const onSearchUser = async (value) => {
    try {
      setLoadingSearch(true);
      const res = await userService.searchUser(value, 1, pageSizeUser);
      if (res && res.StatusCode === 200) {
        if (res.Data.Items.length > 0) {
          setListUser(res.Data.Items);
          setTotalUser(res.Data.TotalItemsCount);
        } else {
          setListUser(null);
        }
      } else {
        notification.error({
          message: "Lỗi",
          description: res.Message,
        });
      }
      setLoadingSearch(false);
    } catch (error) {
      setLoadingSearch(false);
      console.log(error);
    }
  };

  const onSearchNanny = async (value) => {
    try {
      setLoadingSearch(true);
      const res = await userService.searchNanny(value, 1, pageSizeUser);
      if (res && res.StatusCode === 200) {
        if (res.Data.Items.length > 0) {
          setListUser(res.Data.Items);
          setTotalUser(res.Data.TotalItemsCount);
        } else {
          setListUser(null);
        }
      } else {
        notification.error({
          message: "Lỗi",
          description: res.Message,
        });
      }
      setLoadingSearch(false);
    } catch (error) {
      setLoadingSearch(false);
      console.log(error);
    }
  };

  const handleCancelAddNanny = () => {
    setOpenModal(false);
    setTypeModal("");
    setListUser([]);
    setValueSearch("");
    setTabValue("1");
    setTotalUser(0);
    setCurrentPageUser(1);
    setTotalInvite(0);
    setCurrentPageInvite(1);
    setListInvite([]);
  };

  const handleClickActivity = (name) => {
    setOpenModalActivitySelect(true);
    setActivitySelect(name);
  };

  const handleChangeTab = async (key) => {
    setTabValue(key);
    if (key === "2") {
      if (typeModal === "nanny") {
        const res = await childrenService.getSendInviteToNanny(
          childSelect.Code,
          1,
          pageSizeInvite
        );
        if (res && res.StatusCode === 200) {
          console.log(res.Data.Items.length);
          setListInvite(res.Data.Items);
          setTotalInvite(res.Data.TotalItemsCount);
        } else {
          setListInvite(null);
        }
      } else {
        const res = await childrenService.getSendInviteToParent(
          childSelect.Code,
          1,
          pageSizeInvite
        );
        if (res && res.StatusCode === 200) {
          setListInviteParent(res.Data.Items);
          setTotalInviteParent(res.Data.TotalItemsCount);
        } else {
          setListInviteParent(null);
        }
      }
    } else if (key === "4") {
      const res = await childrenService.getChildrenParent();
      if (res && res.StatusCode === 200) {
        if (res.Data.length > 0) {
          setListChild(res.Data);
          res.Data.find((item) => {
            if (item.Code === childSelect.Code) {
              setChildSelect(item);
              setDesWork(item.JobDescription.Description);
              setAgreementWageWork(item.JobDescription.AgreementWage);
              setDayOfWeeks(item.JobDescription.DayOfWeeks);
              setStartTimeWork(item.JobDescription.StartTime);
              setEndTimeWork(item.JobDescription.EndTime);
            }
          });
        }
      }
    }
  };

  const handleParentCancelInviteNanny = async (childCode, nannyCode) => {
    try {
      const res = await childrenService.parentCancelInviteNanny(
        childCode,
        nannyCode
      );
      if (res && res.StatusCode === 200) {
        notification.success({
          message: "Thành công",
          description: res.Message,
        });
        let listInviteTmp = [...listInvite];
        listInviteTmp = listInviteTmp.filter(
          (itemTmp) => itemTmp.User.Code !== nannyCode
        );

        setListInvite(listInviteTmp);
      } else {
        notification.error({
          message: "Lỗi",
          description: res.Message,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleParentCancelInvitePartner = async (childCode, partnerCode) => {
    try {
      const res = await childrenService.parentCancelInvitePartner(
        childCode,
        partnerCode
      );
      if (res && res.StatusCode === 200) {
        notification.success({
          message: "Thành công",
          description: res.Message,
        });
        let listInviteTmp = [...listInviteParent];
        listInviteTmp = listInviteTmp.filter(
          (itemTmp) => itemTmp.User.Code !== partnerCode
        );

        setListInviteParent(listInviteTmp);
      } else {
        notification.error({
          message: "Lỗi",
          description: res.Message,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleParentCancelRelationshipNanny = async (childCode, nannyCode) => {
    try {
      const res = await childrenService.parentCancelRelationshipNanny(
        childCode,
        nannyCode
      );
      if (res && res.StatusCode === 200) {
        notification.success({
          message: "Thành công",
          description: res.Message,
        });
        let childSelectTmp = { ...childSelect };
        childSelectTmp.Nannies = childSelectTmp.Nannies.filter(
          (itemTmp) => itemTmp.Code !== nannyCode
        );
        setChildSelect(childSelectTmp);
      } else {
        notification.error({
          message: "Lỗi",
          description: res.Message,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleParentCancelRelationshipPartner = async (
    childCode,
    partnerCode
  ) => {
    try {
      const res = await childrenService.parentCancelRelationshipPartner(
        childCode,
        partnerCode
      );
      if (res && res.StatusCode === 200) {
        notification.success({
          message: "Thành công",
          description: res.Message,
        });
        let childSelectTmp = { ...childSelect };
        childSelectTmp.Parents = childSelectTmp.Parents.filter(
          (itemTmp) => itemTmp.Code !== partnerCode
        );
        setChildSelect(childSelectTmp);
      } else {
        notification.error({
          message: "Lỗi",
          description: res.Message,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onChangePageUser = async (page) => {
    setCurrentPageUser(page);
    try {
      const res = await userService.searchUser(valueSearch, page, pageSizeUser);
      if (res && res.StatusCode === 200) {
        if (res.Data.Items.length > 0) {
          setListUser(res.Data.Items);
          setTotalUser(res.Data.TotalItemsCount);
        } else {
          setListUser(null);
        }
      } else {
        notification.error({
          message: "Lỗi",
          description: res.Message,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const onChangePageInvite = async (page) => {
    setCurrentPageInvite(page);
    if (typeModal === "nanny") {
      try {
        const res = await childrenService.getSendInviteToNanny(
          childSelect.Code,
          page,
          pageSizeInvite
        );
        console.log(res);
        if (res && res.StatusCode === 200) {
          if (res.Data.Items.length > 0) {
            setListInvite(res.Data.Items);
            setTotalInvite(res.Data.TotalItemsCount);
          } else {
            setListInvite(null);
          }
        } else {
          notification.error({
            message: "Lỗi",
            description: res.Message,
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const updateJobDescription = async (values) => {
    setLoadingUpdate(true);
    const params = {
      childCode: childSelect.Code,
      description: values.des,
      dayOfWeeks: dayOfWeeks,
      startTime: values.startTime,
      endTime: values.endTime,
      agreementWage: values.agreementWage,
    };
    try {
      const res = await childrenService.updateJobDescription(params);
      if (res && res.StatusCode === 200) {
        notification.success({
          message: "Thành công",
          description: res.Message,
        });
        setLoadingUpdate(false);
      } else {
        notification.error({
          message: "Lỗi",
          description: res.Message,
        });
        setLoadingUpdate(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="activity__container">
      {childSelect?.Code && (
        <div className="activity__container__main__parent">
          <div className="activity__container__main__parent__header">
            <div>
              <span className="activity__container__main__parent__header__title">
                {childSelect?.Name}
              </span>
            </div>
            {type === "Cha mẹ" && (
              <div className="activity__container__main__parent__header__add">
                <button
                  className="jwgc__btn__outline__green"
                  onClick={() => handleOpenModal("parent")}
                >
                  Cha mẹ
                </button>
                <button
                  className="jwgc__btn__outline__yellow"
                  onClick={() => handleOpenModal("nanny")}
                >
                  Bảo mẫu
                </button>
              </div>
            )}
          </div>
          <div className="activity__container__main__parent__parentnanny">
            <div>
              <span className="activity__container__main__parent__parentnanny__title__parent">
                Cha mẹ
              </span>
              <ul className="activity__container__main__parent__parentnanny__list">
                {childSelect?.Parents.map((item) => (
                  <li
                    key={item.Code}
                    className="activity__container__main__parent__parentnanny__list__item"
                  >
                    {item.Name}
                  </li>
                ))}
              </ul>
            </div>

            {childSelect?.Nannies.length > 0 && (
              <div>
                <span className="activity__container__main__parent__parentnanny__title__nanny">
                  Bảo mẫu
                </span>
                <ul className="activity__container__main__parent__parentnanny__list">
                  {childSelect?.Nannies.map((item) => (
                    <li
                      key={item.Code}
                      className="activity__container__main__parent__parentnanny__list__item"
                    >
                      {item.Name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="activity__container__main__parent__acti">
            <div className="activity__container__main__parent__acti__grid">
              {listCate.map((item, index) => (
                <div
                  className="activity__container__main__parent__acti__grid__item"
                  key={index}
                  style={{ color: item.Color }}
                  onClick={() => handleClickActivity(item.Name)}
                >
                  <div className="activity__container__main__parent__acti__grid__item__icon">
                    <img src={item.Icon} alt="" />
                  </div>
                  <div className="activity__container__main__parent__acti__grid__item__title">
                    <span>{item.Name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {activitySelect === "Cho Ăn" && (
            <ModalNormal
              activitySelect={activitySelect}
              open={openModalActivitySelect}
              color={
                ACTIVITY.find((item) => item.title === activitySelect).color
              }
              cateCode={
                listCate.find((item) => item.Name === activitySelect).Code
              }
            />
          )}
          {activitySelect === "Vắt Sữa" && (
            <Milk
              activitySelect={activitySelect}
              open={openModalActivitySelect}
              color={
                ACTIVITY.find((item) => item.title === activitySelect).color
              }
              cateCode={
                listCate.find((item) => item.Name === activitySelect).Code
              }
            />
          )}
          {activitySelect === "Thay Tã" && (
            <Diaper
              activitySelect={activitySelect}
              open={openModalActivitySelect}
              color={
                ACTIVITY.find((item) => item.title === activitySelect).color
              }
              cateCode={
                listCate.find((item) => item.Name === activitySelect).Code
              }
            />
          )}
          {activitySelect === "Ngủ" && (
            <Sleep
              activitySelect={activitySelect}
              open={openModalActivitySelect}
              color={
                ACTIVITY.find((item) => item.title === activitySelect).color
              }
              cateCode={
                listCate.find((item) => item.Name === activitySelect).Code
              }
            />
          )}
          {activitySelect === "Sức Khỏe" && (
            <Health
              activitySelect={activitySelect}
              open={openModalActivitySelect}
              color={
                ACTIVITY.find((item) => item.title === activitySelect).color
              }
              cateCode={
                listCate.find((item) => item.Name === activitySelect).Code
              }
            />
          )}
          {activitySelect === "Tăng Trưởng" && (
            <Growth
              activitySelect={activitySelect}
              open={openModalActivitySelect}
              color={
                ACTIVITY.find((item) => item.title === activitySelect).color
              }
              cateCode={
                listCate.find((item) => item.Name === activitySelect).Code
              }
            />
          )}
          {activitySelect === "Giờ Chơi" && (
            <HangOut
              activitySelect={activitySelect}
              open={openModalActivitySelect}
              color={
                ACTIVITY.find((item) => item.title === activitySelect).color
              }
              cateCode={
                listCate.find((item) => item.Name === activitySelect).Code
              }
            />
          )}
          {activitySelect === "Nhật Ký" && (
            <Diary
              activitySelect={activitySelect}
              open={openModalActivitySelect}
              color={
                ACTIVITY.find((item) => item.title === activitySelect).color
              }
              cateCode={
                listCate.find((item) => item.Name === activitySelect).Code
              }
            />
          )}
          {activitySelect === "Vaccine" && (
            <Vaccine
              activitySelect={activitySelect}
              open={openModalActivitySelect}
              color={
                ACTIVITY.find((item) => item.title === activitySelect).color
              }
              cateCode="vaccine"
            />
          )}
          <Modal
            title={
              typeModal === "parent"
                ? `Cha mẹ của bé ${childSelect.Name}`
                : `Bảo mẫu chăm sóc bé ${childSelect.Name}`
            }
            open={openModal}
            onCancel={handleCancelAddNanny}
            okText="Thêm"
            cancelText="Hủy"
            className="box__moadl__link"
            footer={null}
            width={800}
          >
            <Tabs activeKey={tabValue} onChange={handleChangeTab}>
              <Tabs.TabPane
                tab={typeModal === "parent" ? "Mời cha mẹ" : "Mời bảo mẫu"}
                key="1"
              >
                <>
                  <div className="box__moadl__link__childrend">
                    <Search
                      placeholder={
                        typeModal === "parent"
                          ? "Nhập tên cha mẹ hoặc tài khoản cha mẹ"
                          : "Nhập tên bảo mẫu hoặc tài khoản bảo mẫu"
                      }
                      onSearch={
                        typeModal === "parent" ? onSearchUser : onSearchNanny
                      }
                      loading={loadingSearch}
                      value={valueSearch}
                      onChange={(e) => setValueSearch(e.target.value)}
                    />
                  </div>
                  <div className="box__moadl__link__list__child">
                    {listUser === null ? (
                      <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={<span>Không tìm thấy người dùng</span>}
                      />
                    ) : (
                      // eslint-disable-next-line
                      listUser.map((item) => {
                        return (
                          <div
                            className="box__moadl__link__list__child__item"
                            key={item.Code}
                          >
                            <div className="box__moadl__link__list__child__item__avatar">
                              <img
                                src={
                                  item.AvatarPath ? item.AvatarPath : userAvatar
                                }
                                alt=""
                              />
                            </div>
                            <div className="box__moadl__link__list__child__item__user">
                              <div className="box__moadl__link__list__child__item__user__box">
                                <span className="box__moadl__link__list__child__item__user__box__title">
                                  {item.Name}
                                </span>
                                <span className="box__moadl__link__list__child__item__user__box__username">
                                  @{item.UserName}
                                </span>
                              </div>
                            </div>
                            <div className="box__moadl__link__list__child__item__btn">
                              {typeModal === "nanny" ? (
                                item.SentNannyChildrenCodes.length > 0 ||
                                item.NannyChildrenCodes.length > 0 ? (
                                  <button
                                    className={
                                      typeModal === "parent"
                                        ? "jwgc__btn__outline__green"
                                        : "jwgc__btn__outline__yellow"
                                    }
                                    style={{
                                      padding: "4px 8px",
                                      cursor: "not-allowed",
                                    }}
                                  >
                                    Đã Mời
                                  </button>
                                ) : (
                                  <button
                                    className={
                                      typeModal === "parent"
                                        ? "jwgc__btn__outline__green"
                                        : "jwgc__btn__outline__yellow"
                                    }
                                    style={{ padding: "4px 8px" }}
                                    onClick={() => handleAdd(item)}
                                  >
                                    Mời
                                  </button>
                                )
                              ) : item.SentPartnerParentChildrenCodes.length >
                                  0 ||
                                item.PartnerParentChildrenCodes.length > 0 ? (
                                <button
                                  className={
                                    typeModal === "parent"
                                      ? "jwgc__btn__outline__green"
                                      : "jwgc__btn__outline__yellow"
                                  }
                                  style={{
                                    padding: "4px 8px",
                                    cursor: "not-allowed",
                                  }}
                                >
                                  Đã Mời
                                </button>
                              ) : (
                                <button
                                  className={
                                    typeModal === "parent"
                                      ? "jwgc__btn__outline__green"
                                      : "jwgc__btn__outline__yellow"
                                  }
                                  style={{ padding: "4px 8px" }}
                                  onClick={() => handleAdd(item)}
                                >
                                  Mời
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div className="box__moadl__link__list__child__pagi">
                      <Pagination
                        hideOnSinglePage
                        size="small"
                        total={totalUser}
                        pageSize={pageSizeUser}
                        current={currentPageUser}
                        onChange={onChangePageUser}
                      />
                    </div>
                  </div>
                </>
              </Tabs.TabPane>
              <Tabs.TabPane tab="Xem lời mời" key="2">
                {typeModal === "parent" ? (
                  listInviteParent === null ? (
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description={
                        <span>Không có lời mời nào được gửi đi</span>
                      }
                    />
                  ) : (
                    <div className="invite">
                      <div className="box__moadl__link__list__child">
                        {
                          // eslint-disable-next-line
                          listInviteParent.map((item) => {
                            return (
                              <div
                                className="box__moadl__link__list__child__item"
                                key={item.User.Code}
                              >
                                <div className="box__moadl__link__list__child__item__avatar">
                                  <img
                                    src={
                                      item.User.AvatarPath
                                        ? item.User.AvatarPath
                                        : userAvatar
                                    }
                                    alt=""
                                  />
                                </div>
                                <div className="box__moadl__link__list__child__item__user">
                                  <div className="box__moadl__link__list__child__item__user__box">
                                    <span className="box__moadl__link__list__child__item__user__box__title">
                                      {item.User.Name}
                                    </span>
                                    <span className="box__moadl__link__list__child__item__user__box__username">
                                      @{item.User.UserName}
                                    </span>
                                  </div>
                                </div>
                                <div className="box__moadl__link__list__child__item__btn">
                                  <button
                                    className={"jwgc__btn__outline__danger"}
                                    style={{ padding: "4px 8px" }}
                                    onClick={() =>
                                      handleParentCancelInvitePartner(
                                        item.Child.Code,
                                        item.User.Code
                                      )
                                    }
                                  >
                                    Hủy lời mời
                                  </button>
                                </div>
                              </div>
                            );
                          })
                        }
                        <div className="box__moadl__link__list__child__pagi">
                          <Pagination
                            hideOnSinglePage
                            size="small"
                            total={totalInvite}
                            pageSize={pageSizeInvite}
                            current={currentPageInvite}
                            onChange={onChangePageInvite}
                          />
                        </div>
                      </div>
                    </div>
                  )
                ) : listInvite === null ? (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={<span>Không có lời mời nào được gửi đi</span>}
                  />
                ) : (
                  <div className="invite">
                    <div className="box__moadl__link__list__child">
                      {
                        // eslint-disable-next-line
                        listInvite.map((item) => {
                          return (
                            <div
                              className="box__moadl__link__list__child__item"
                              key={item.User.Code}
                            >
                              <div className="box__moadl__link__list__child__item__avatar">
                                <img
                                  src={
                                    item.User.AvatarPath
                                      ? item.User.AvatarPath
                                      : userAvatar
                                  }
                                  alt=""
                                />
                              </div>
                              <div className="box__moadl__link__list__child__item__user">
                                <div className="box__moadl__link__list__child__item__user__box">
                                  <span className="box__moadl__link__list__child__item__user__box__title">
                                    {item.User.Name}
                                  </span>
                                  <span className="box__moadl__link__list__child__item__user__box__username">
                                    @{item.User.UserName}
                                  </span>
                                </div>
                              </div>
                              <div className="box__moadl__link__list__child__item__btn">
                                <button
                                  className={"jwgc__btn__outline__danger"}
                                  style={{ padding: "4px 8px" }}
                                  onClick={() =>
                                    handleParentCancelInviteNanny(
                                      item.Child.Code,
                                      item.User.Code
                                    )
                                  }
                                >
                                  Hủy lời mời
                                </button>
                              </div>
                            </div>
                          );
                        })
                      }
                      <div className="box__moadl__link__list__child__pagi">
                        <Pagination
                          hideOnSinglePage
                          size="small"
                          total={totalInvite}
                          pageSize={pageSizeInvite}
                          current={currentPageInvite}
                          onChange={onChangePageInvite}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </Tabs.TabPane>
              <Tabs.TabPane
                tab={
                  typeModal === "parent" ? "Cha mẹ của bé" : "Bảo mẫu của bé"
                }
                key="3"
              >
                {typeModal === "parent"
                  ? childSelect?.Parents.map((item) => (
                      <li
                        key={item.Code}
                        className="activity__container__main__parent__parentnanny__list__item"
                      >
                        <li
                          key={item.Code}
                          className="activity__container__main__parent__parentnanny__list__item"
                        >
                          <div
                            className="box__moadl__link__list__child__item"
                            key={item.Code}
                          >
                            <div className="box__moadl__link__list__child__item__avatar">
                              <img
                                src={
                                  item.AvatarPath ? item.AvatarPath : userAvatar
                                }
                                alt=""
                              />
                            </div>
                            <div className="box__moadl__link__list__child__item__user">
                              <div className="box__moadl__link__list__child__item__user__box">
                                <span className="box__moadl__link__list__child__item__user__box__title">
                                  {item.Name}
                                </span>
                                <span className="box__moadl__link__list__child__item__user__box__username">
                                  @{item.UserName}
                                </span>
                              </div>
                            </div>
                            <div className="box__moadl__link__list__child__item__btn">
                              {item.Code !== localService.getUser().Code ? (
                                <button
                                  className={"jwgc__btn__outline__danger"}
                                  style={{
                                    padding: "4px 8px",
                                    minWidth: "102px",
                                  }}
                                  onClick={() =>
                                    handleParentCancelRelationshipPartner(
                                      childSelect.Code,
                                      item.Code
                                    )
                                  }
                                >
                                  Chấm dứt
                                </button>
                              ) : (
                                <div
                                  style={{
                                    padding: "4px 8px",
                                    minWidth: "102px",
                                  }}
                                ></div>
                              )}
                            </div>
                          </div>
                        </li>
                      </li>
                    ))
                  : childSelect?.Nannies.map((item) => (
                      <li
                        key={item.Code}
                        className="activity__container__main__parent__parentnanny__list__item"
                      >
                        <div
                          className="box__moadl__link__list__child__item"
                          key={item.Code}
                        >
                          <div className="box__moadl__link__list__child__item__avatar">
                            <img
                              src={
                                item.AvatarPath ? item.AvatarPath : userAvatar
                              }
                              alt=""
                            />
                          </div>
                          <div className="box__moadl__link__list__child__item__user">
                            <div className="box__moadl__link__list__child__item__user__box">
                              <span className="box__moadl__link__list__child__item__user__box__title">
                                {item.Name}
                              </span>
                              <span className="box__moadl__link__list__child__item__user__box__username">
                                @{item.UserName}
                              </span>
                            </div>
                          </div>
                          <div className="box__moadl__link__list__child__item__btn">
                            <button
                              className={"jwgc__btn__outline__danger"}
                              style={{ padding: "4px 8px", width: "102px" }}
                              onClick={() =>
                                handleParentCancelRelationshipNanny(
                                  childSelect.Code,
                                  item.Code
                                )
                              }
                            >
                              Chấm dứt
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
              </Tabs.TabPane>
              {typeModal === "nanny" && (
                <Tabs.TabPane tab="Mô tả công việc" key="4">
                  <Formik
                    enableReinitialize
                    initialValues={{
                      des: desWork ? desWork : "",
                      agreementWage: agreementWageWork ? agreementWageWork : "",
                      startTime: startTimeWork ? startTimeWork : "08:00:00",
                      endTime: endTimeWork ? endTimeWork : "17:00:00",
                    }}
                    onSubmit={(values, { setErrors }) => {
                      let check = true;
                      let errors = {};
                      if (!values.des) {
                        errors.des = "Mô tả công việc không được để trống";
                        check = false;
                      }
                      if (!values.agreementWage) {
                        errors.agreementWage = "Mức lương không được để trống";
                        check = false;
                      }

                      if (
                        moment(values.endTime, "HH:mm:ss").isBefore(
                          moment(values.startTime, "HH:mm:ss")
                        )
                      ) {
                        errors.endTime =
                          "Thời gian kết thúc phải sau thời gian bắt đầu";
                        check = false;
                      }

                      setErrors(errors);
                      if (check) {
                        updateJobDescription(values);
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
                        <Row gutter={50} style={{ fontSize: "16px" }}>
                          <Col span={24}>
                            <FormAntd.Item
                              validateStatus={errors.des && "error"}
                              help={errors.des}
                              style={{ marginBottom: "16px" }}
                            >
                              <label
                                style={{
                                  fontSize: "16px",
                                  marginBottom: "8px",
                                }}
                                className="inputProfile__label"
                                htmlFor="birthday"
                              >
                                Mô tả công việc
                              </label>
                              <TextareaAutosize
                                className={`containerModalWork__textarea__input__box ${
                                  errors.des &&
                                  "containerModalWork__textarea__input__box__error"
                                }`}
                                minRows={5}
                                onChange={(e) => {
                                  setFieldValue("des", e.target.value);
                                }}
                                value={values.des}
                              />
                            </FormAntd.Item>
                          </Col>
                        </Row>
                        <Row>
                          <Col span={24}>
                            <InputField
                              styleLabel={{ fontSize: "16px" }}
                              id="agreementWage"
                              type="text"
                              value={values.agreementWage}
                              handleChange={(e) => {
                                handleChange(e);
                              }}
                              validate={{}}
                              height={40}
                              errors={errors.agreementWage}
                              label="Mức lương thỏa thuận"
                              style={{ fontSize: "16px" }}
                            />
                          </Col>
                        </Row>
                        <ConfigProvider
                          theme={{
                            token: {
                              colorPrimary: "#0a64c4",
                            },
                          }}
                        >
                          <Row gutter={20}>
                            <Col span={12}>
                              <label
                                className="inputProfile__label"
                                htmlFor="startTime"
                                style={{
                                  fontSize: "16px",
                                  marginBottom: "8px",
                                }}
                              >
                                Ngày bắt đầu
                              </label>
                              <FormAntd.Item
                                validateStatus={errors.startTime && "error"}
                                help={errors.startTime}
                                style={{ marginBottom: "16px" }}
                              >
                                <TimePicker
                                  id="startTime"
                                  placeholder="Ngày bắt đầu"
                                  style={{ width: "100%", height: "40px" }}
                                  locale={locale}
                                  value={dayjs(values.startTime, "HH:mm:ss")}
                                  onChange={(date, dateString) => {
                                    setFieldValue("startTime", dateString);
                                  }}
                                  clearIcon={null}
                                />
                              </FormAntd.Item>
                            </Col>
                            <Col span={12}>
                              <label
                                className="inputProfile__label"
                                htmlFor="birthday"
                                style={{
                                  fontSize: "16px",
                                  marginBottom: "8px",
                                }}
                              >
                                Ngày kết thúc
                              </label>
                              <FormAntd.Item
                                validateStatus={errors.endTime && "error"}
                                help={errors.endTime}
                                style={{ marginBottom: "16px" }}
                              >
                                <TimePicker
                                  id="endTime"
                                  placeholder="Ngày kết thúc"
                                  style={{ width: "100%", height: "40px" }}
                                  locale={locale}
                                  value={dayjs(values.endTime, "HH:mm:ss")}
                                  onChange={(date, dateString) => {
                                    setFieldValue("endTime", dateString);
                                  }}
                                  clearIcon={null}
                                  className={
                                    errors.endTime && "errorDate__work"
                                  }
                                />
                              </FormAntd.Item>
                            </Col>
                          </Row>
                          <Row>
                            <label
                              className="inputProfile__label"
                              htmlFor="birthday"
                              style={{
                                fontSize: "16px",
                                marginBottom: "8px",
                              }}
                            >
                              Thời gian làm việc
                            </label>
                            <Col span={24}>
                              <Checkbox.Group
                                style={{
                                  width: "100%",
                                  display: "block",
                                }}
                                onChange={(e) => {
                                  setDayOfWeeks(e);
                                }}
                                value={dayOfWeeks}
                              >
                                <Row>
                                  {DAY.map((item) => (
                                    <Col
                                      span={6}
                                      key={item.value}
                                      style={{
                                        marginBottom: "8px",
                                      }}
                                    >
                                      <Checkbox
                                        value={item.value}
                                        style={{ fontSize: "16px" }}
                                      >
                                        {item.title}
                                      </Checkbox>
                                    </Col>
                                  ))}
                                </Row>
                              </Checkbox.Group>
                            </Col>
                          </Row>
                        </ConfigProvider>
                        <Button
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            background: "#0a64c4",
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
                          loading={loadingUpdate}
                        >
                          Cập nhật
                        </Button>
                      </Form>
                    )}
                  </Formik>
                </Tabs.TabPane>
              )}
            </Tabs>
          </Modal>
        </div>
      )}
    </div>
  );
}

export default Activity;
