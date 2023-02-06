import React, { useEffect, useState } from "react";
import { useRecoilValue, useRecoilState } from "recoil";
import { ACTIVITY } from "../../constants/activity";
import {
  activitySelectState,
  childSelectState,
  openModalActivitySelectState,
  typeState,
} from "../../stores/child";
import ModalNormal from "../ModalActivity/Normal";
import "./index.scss";
import { Modal, Input, notification, Empty, Tabs, Pagination } from "antd";
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

const { Search } = Input;

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
  const [totalUser, setTotalUser] = useState(0);
  const [currentPageUser, setCurrentPageUser] = useState(1);
  const pageSizeUser = 5;
  const [totalInvite, setTotalInvite] = useState(0);
  const [currentPageInvite, setCurrentPageInvite] = useState(1);
  const pageSizeInvite = 6;
  const [listCate, setListCate] = useState([]);

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
    }
    if (res && res.StatusCode === 200) {
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
  };

  const onSearchNanny = async (value) => {
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
          (itemTmp) => itemTmp.Nanny.Code !== nannyCode
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

  return (
    <div className="activity__container">
      {type === "Cha mẹ" ? (
        childSelect?.Code && (
          <div className="activity__container__main__parent">
            <div className="activity__container__main__parent__header">
              <div>
                <span className="activity__container__main__parent__header__title">
                  {childSelect?.Name}
                </span>
              </div>
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
            >
              <Tabs activeKey={tabValue} onChange={handleChangeTab}>
                <Tabs.TabPane
                  tab={typeModal === "parent" ? "Thêm cha mẹ" : "Thêm bảo mẫu"}
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
                        onSearch={onSearchNanny}
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
                                    item.AvatarPath
                                      ? item.AvatarPath
                                      : userAvatar
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
                  {listInvite === null ? (
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
                          listInvite.map((item) => {
                            return (
                              <div
                                className="box__moadl__link__list__child__item"
                                key={item.Nanny.Code}
                              >
                                <div className="box__moadl__link__list__child__item__avatar">
                                  <img
                                    src={
                                      item.Nanny.AvatarPath
                                        ? item.Nanny.AvatarPath
                                        : userAvatar
                                    }
                                    alt=""
                                  />
                                </div>
                                <div className="box__moadl__link__list__child__item__user">
                                  <div className="box__moadl__link__list__child__item__user__box">
                                    <span className="box__moadl__link__list__child__item__user__box__title">
                                      {item.Nanny.Name}
                                    </span>
                                    <span className="box__moadl__link__list__child__item__user__box__username">
                                      @{item.Nanny.UserName}
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
                                        item.Nanny.Code
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
                                    item.AvatarPath
                                      ? item.AvatarPath
                                      : userAvatar
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
              </Tabs>
            </Modal>
          </div>
        )
      ) : (
        <div>Điểm danh</div>
      )}
    </div>
  );
}

export default Activity;
