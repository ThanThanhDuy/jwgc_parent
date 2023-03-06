import { Empty, notification } from "antd";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import childrenService from "../../services/children";
import userAvatar from "../../assets/icons/user.png";
import { UilTrash } from "@iconscout/react-unicons";
import "./index.scss";
import localService from "../../services/local";

function Invition() {
  const tabRender = [
    "Lời mời nhận làm bảo mẫu",
    "Lời mời đã gửi cho bảo mẫu",
    "Lời mời nhận làm cha mẹ",
    "Lời mời đã gửi cho cha mẹ",
  ];
  const [tabSelected, setTabSelected] = useState(tabRender[0]);
  const [listCare, setListCare] = useState([]);
  const pageSize = 5;

  const onChangeTab = (value) => {
    setTabSelected(value);
  };

  useEffect(() => {
    const handleGetInvite = async () => {
      setListCare([]);
      if (tabSelected === tabRender[0]) {
        const res = await childrenService.getInvition(1, pageSize);
        if (res && res.StatusCode === 200) {
          if (res.Data.Items.length > 0) {
            setListCare(res.Data.Items);
          } else {
            setListCare(null);
          }
        }
      } else if (tabSelected === tabRender[1]) {
        const res = await childrenService.getSendInviteToNanny("", 1, pageSize);
        if (res && res.StatusCode === 200) {
          if (res.Data.Items.length > 0) {
            setListCare(res.Data.Items);
          } else {
            setListCare(null);
          }
        }
      } else if (tabSelected === tabRender[2]) {
        const res = await childrenService.getInvitionParent("", 1, pageSize);
        if (res && res.StatusCode === 200) {
          if (res.Data.Items.length > 0) {
            setListCare(res.Data.Items);
          } else {
            setListCare(null);
          }
        }
      } else {
        const res = await childrenService.getSendInviteToParent(
          "",
          1,
          pageSize
        );
        if (res && res.StatusCode === 200) {
          if (res.Data.Items.length > 0) {
            setListCare(res.Data.Items);
          } else {
            setListCare(null);
          }
        }
      }
    };
    handleGetInvite();
  }, [tabSelected]);

  const handleChanheStatusInvition = async (child, value) => {
    try {
      const res = await childrenService.changeStatusInvition(child.Code, value);
      if (res && res.StatusCode === 200) {
        const res = await childrenService.getInvition(1, pageSize);
        if (res && res.StatusCode === 200) {
          if (res.Data.Items.length > 0) {
            setListCare(res.Data.Items);
          } else {
            setListCare(null);
          }
        }
        notification.success({
          message: "Thành công",
          description: `${
            value === 1
              ? `Bạn đã đồng ý chăm sóc bé ${child.Name}`
              : `Bạn đã từ chối chăm sóc bé ${child.Name}`
          }`,
        });
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

  const handleChangeStatusInvitionParent = async (child, value) => {
    try {
      const res = await childrenService.changeStatusInvitionParent(
        child.Code,
        value
      );
      if (res && res.StatusCode === 200) {
        const res = await childrenService.getInvitionParent(1, pageSize);
        if (res && res.StatusCode === 200) {
          if (res.Data.Items.length > 0) {
            setListCare(res.Data.Items);
          } else {
            setListCare(null);
          }
        }
        notification.success({
          message: "Thành công",
          description: `${
            value === 1
              ? `Bạn đã đồng ý làm cha mẹ bé ${child.Name}`
              : `Bạn đã từ chối làm cha mẹ bé ${child.Name}`
          }`,
        });
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

  const handleDeleteInvition = async (child) => {
    try {
      console.log(child);
      const res = await childrenService.nannyDeleteInvition(
        child.Code,
        localService.getUser().Code
      );
      if (res && res.StatusCode === 200) {
        if (res && res.StatusCode === 200) {
          const res = await childrenService.getInvition(1, pageSize);
          if (res && res.StatusCode === 200) {
            if (res.Data.Items.length > 0) {
              setListCare(res.Data.Items);
            } else {
              setListCare(null);
            }
          }
          notification.success({
            message: "Thành công",
            description: "Bạn đã xóa lời mời thành công",
          });
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

  const handleParentCancelInviteNanny = async (item) => {
    try {
      const res = await childrenService.parentCancelInviteNanny(
        item.Child.Code,
        item.User.Code
      );
      if (res && res.StatusCode === 200) {
        if (res && res.StatusCode === 200) {
          const res = await childrenService.getSendInviteToNanny(
            "",
            1,
            pageSize
          );
          if (res && res.StatusCode === 200) {
            if (res.Data.Items.length > 0) {
              setListCare(res.Data.Items);
            } else {
              setListCare(null);
            }
          }
          notification.success({
            message: "Thành công",
            description: "Bạn đã xóa lời mời thành công",
          });
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

  const handleParentCancelInvitePartner = async (item) => {
    try {
      const res = await childrenService.parentCancelInvitePartner(
        item.Child.Code,
        item.User.Code
      );
      if (res && res.StatusCode === 200) {
        const res = await childrenService.getSendInviteToParent(
          "",
          1,
          pageSize
        );
        if (res && res.StatusCode === 200) {
          if (res.Data.Items.length > 0) {
            setListCare(res.Data.Items);
          } else {
            setListCare(null);
          }
        }
        notification.success({
          message: "Thành công",
          description: "Bạn đã xóa lời mời thành công",
        });
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

  return (
    <div className="notification__container">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Lời mời</title>
      </Helmet>
      <div className="notification__container__title">
        <span>Lời mời</span>
      </div>
      <div className="notification__container__main">
        <div className="notification__container__main__sidebar">
          {tabRender.map((item, index) => (
            <div
              key={index}
              className={`notification__container__main__sidebar__item ${
                item === tabSelected &&
                "notification__container__main__sidebar__item__active"
              }`}
              onClick={() => onChangeTab(item)}
            >
              {item}
            </div>
          ))}
        </div>
        <div className="notification__container__main__content">
          {tabSelected === tabRender[0] && (
            <div>
              {listCare === null ? (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={<span>Không có Lời mời nào</span>}
                />
              ) : (
                <div className="notification__container__main__content__list">
                  {listCare.map((item, index) => (
                    <div
                      key={index}
                      className="notification__container__main__content__list__item"
                    >
                      <div className="notification__container__main__content__list__item__avatar">
                        <img
                          src={
                            item.User?.AvatarPath
                              ? item.User?.AvatarPath
                              : userAvatar
                          }
                          alt=""
                        />
                      </div>
                      <div className="notification__container__main__content__list__item__user">
                        <div className="notification__container__main__content__list__item__user__parent">
                          <span className="notification__container__main__content__list__item__user__parent__name">
                            {item.User?.Name}
                          </span>
                          <span className="notification__container__main__content__list__item__user__parent__dot">
                            •
                          </span>
                          <span className="notification__container__main__content__list__item__user__parent__username">
                            @{item.User?.UserName}
                          </span>
                          <span className="notification__container__main__content__list__item__user__parent__dot">
                            •
                          </span>
                          <span className="notification__container__main__content__list__item__user__parent__time">
                            {item?.Datetime}
                          </span>
                        </div>
                        <div className="notification__container__main__content__list__item__user__des">
                          <span>
                            <span className="notification__container__main__content__list__item__user__des__link">
                              {item.User?.Name}
                            </span>{" "}
                            mời bạn làm bảo mẫu của bé{" "}
                            <span className="notification__container__main__content__list__item__user__des__link">
                              {item.Child?.Name}
                            </span>
                          </span>
                        </div>
                      </div>
                      <div className="notification__container__main__content__list__item__control">
                        <button
                          style={{ padding: "4px 8px", height: "38px" }}
                          className="jwgc__btn__outline__green"
                          onClick={() =>
                            handleChanheStatusInvition(item.Child, 1)
                          }
                        >
                          Đồng ý
                        </button>
                        <button
                          style={{ padding: "4px 8px", height: "38px" }}
                          className="jwgc__btn__outline__yellow"
                          onClick={() =>
                            handleChanheStatusInvition(item.Child, 0)
                          }
                        >
                          Từ chối
                        </button>
                        <button
                          style={{ padding: "4px 8px", height: "38px" }}
                          className="jwgc__btn__outline__danger"
                          onClick={() => handleDeleteInvition(item.Child)}
                        >
                          <UilTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {tabSelected === tabRender[1] && (
            <div>
              {listCare === null ? (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={<span>Không có lời mời nào đã gửi đi</span>}
                />
              ) : (
                <div className="notification__container__main__content__list">
                  {listCare.map((item, index) => (
                    <div
                      key={index}
                      className="notification__container__main__content__list__item"
                    >
                      <div className="notification__container__main__content__list__item__avatar">
                        <img
                          src={
                            item.User?.AvatarPath
                              ? item.User?.AvatarPath
                              : userAvatar
                          }
                          alt=""
                        />
                      </div>
                      <div className="notification__container__main__content__list__item__user notification__container__main__content__list__item__invited">
                        <div className="notification__container__main__content__list__item__user__parent">
                          <span className="notification__container__main__content__list__item__user__parent__name">
                            {item.User?.Name}
                          </span>
                          <span className="notification__container__main__content__list__item__user__parent__dot">
                            •
                          </span>
                          <span className="notification__container__main__content__list__item__user__parent__username">
                            @{item.User?.UserName}
                          </span>
                          <span className="notification__container__main__content__list__item__user__parent__dot">
                            •
                          </span>
                          <span className="notification__container__main__content__list__item__user__parent__time">
                            {item?.Datetime}
                          </span>
                        </div>
                        <div className="notification__container__main__content__list__item__user__des">
                          <span>
                            Bạn đã mời{" "}
                            <span className="notification__container__main__content__list__item__user__des__link">
                              {item.Nanny?.Name}
                            </span>{" "}
                            làm bảo mẫu của bé{" "}
                            <span className="notification__container__main__content__list__item__user__des__link">
                              {item.Child?.Name}
                            </span>
                          </span>
                        </div>
                      </div>
                      <div className="notification__container__main__content__list__item__control__invited">
                        <button
                          style={{ padding: "4px 8px", height: "38px" }}
                          className="jwgc__btn__outline__danger"
                          onClick={() => handleParentCancelInviteNanny(item)}
                        >
                          Hủy lời mời
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {tabSelected === tabRender[2] && (
            <div>
              {listCare === null ? (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={<span>Không có Lời mời nào</span>}
                />
              ) : (
                <div className="notification__container__main__content__list">
                  {listCare.map((item, index) => (
                    <div
                      key={index}
                      className="notification__container__main__content__list__item"
                    >
                      <div className="notification__container__main__content__list__item__avatar">
                        <img
                          src={
                            item.User?.AvatarPath
                              ? item.User?.AvatarPath
                              : userAvatar
                          }
                          alt=""
                        />
                      </div>
                      <div className="notification__container__main__content__list__item__user">
                        <div className="notification__container__main__content__list__item__user__parent">
                          <span className="notification__container__main__content__list__item__user__parent__name">
                            {item.User?.Name}
                          </span>
                          <span className="notification__container__main__content__list__item__user__parent__dot">
                            •
                          </span>
                          <span className="notification__container__main__content__list__item__user__parent__username">
                            @{item.User?.UserName}
                          </span>
                          <span className="notification__container__main__content__list__item__user__parent__dot">
                            •
                          </span>
                          <span className="notification__container__main__content__list__item__user__parent__time">
                            {item?.Datetime}
                          </span>
                        </div>
                        <div className="notification__container__main__content__list__item__user__des">
                          <span>
                            <span className="notification__container__main__content__list__item__user__des__link">
                              {item.User?.Name}
                            </span>{" "}
                            mời bạn làm cha mẹ của bé{" "}
                            <span className="notification__container__main__content__list__item__user__des__link">
                              {item.Child?.Name}
                            </span>
                          </span>
                        </div>
                      </div>
                      <div className="notification__container__main__content__list__item__control">
                        <button
                          style={{ padding: "4px 8px", height: "38px" }}
                          className="jwgc__btn__outline__green"
                          onClick={() =>
                            handleChangeStatusInvitionParent(item.Child, 1)
                          }
                        >
                          Đồng ý
                        </button>
                        <button
                          style={{ padding: "4px 8px", height: "38px" }}
                          className="jwgc__btn__outline__yellow"
                          onClick={() =>
                            handleChangeStatusInvitionParent(item.Child, 0)
                          }
                        >
                          Từ chối
                        </button>
                        <button
                          style={{ padding: "4px 8px", height: "38px" }}
                          className="jwgc__btn__outline__danger"
                          onClick={() => handleDeleteInvition(item.Child)}
                        >
                          <UilTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {tabSelected === tabRender[3] && (
            <div>
              {listCare === null ? (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={<span>Không có lời mời nào đã gửi đi</span>}
                />
              ) : (
                <div className="notification__container__main__content__list">
                  {listCare.map((item, index) => (
                    <div
                      key={index}
                      className="notification__container__main__content__list__item"
                    >
                      <div className="notification__container__main__content__list__item__avatar">
                        <img
                          src={
                            item.User?.AvatarPath
                              ? item.User?.AvatarPath
                              : userAvatar
                          }
                          alt=""
                        />
                      </div>
                      <div className="notification__container__main__content__list__item__user notification__container__main__content__list__item__invited">
                        <div className="notification__container__main__content__list__item__user__parent">
                          <span className="notification__container__main__content__list__item__user__parent__name">
                            {item.User?.Name}
                          </span>
                          <span className="notification__container__main__content__list__item__user__parent__dot">
                            •
                          </span>
                          <span className="notification__container__main__content__list__item__user__parent__username">
                            @{item.User?.UserName}
                          </span>
                          <span className="notification__container__main__content__list__item__user__parent__dot">
                            •
                          </span>
                          <span className="notification__container__main__content__list__item__user__parent__time">
                            {item?.Datetime}
                          </span>
                        </div>
                        <div className="notification__container__main__content__list__item__user__des">
                          <span>
                            Bạn đã mời{" "}
                            <span className="notification__container__main__content__list__item__user__des__link">
                              {item.Nanny?.Name}
                            </span>{" "}
                            làm cha mẹ của bé{" "}
                            <span className="notification__container__main__content__list__item__user__des__link">
                              {item.Child?.Name}
                            </span>
                          </span>
                        </div>
                      </div>
                      <div className="notification__container__main__content__list__item__control__invited">
                        <button
                          style={{ padding: "4px 8px", height: "38px" }}
                          className="jwgc__btn__outline__danger"
                          onClick={() => handleParentCancelInvitePartner(item)}
                        >
                          Hủy lời mời
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Invition;
