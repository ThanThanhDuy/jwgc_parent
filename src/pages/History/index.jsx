import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import activityService from "../../services/activity";
import childrenService from "../../services/children";
import userAvatar from "../../assets/icons/user.png";
import { caculateAge, getWeekDay } from "../../utils/Date";
import "./index.scss";
import { ACTIVITY } from "../../constants/activity";
import { UilTear } from "@iconscout/react-unicons";
import moment from "moment";
import "moment/locale/vi";
import { Rate } from "antd";
import { UilAngleRight } from "@iconscout/react-unicons";
import ModalNormal from "../../components/ModalActivity/Normal";
import { useRecoilState, useRecoilValue } from "recoil";
import { openModalActivitySelectState } from "../../stores/child";
import Milk from "../../components/ModalActivity/Milk";
import Diaper from "../../components/ModalActivity/Diaper";
import { itemSelectedState, reloadState } from "../../stores/activity";
import Sleep from "../../components/ModalActivity/Sleep";
import Health from "../../components/ModalActivity/Health";
import HangOut from "../../components/ModalActivity/HangOut";
import Growth from "../../components/ModalActivity/Growth";
import Diary from "../../components/ModalActivity/Diary";
import { UilFilter } from "@iconscout/react-unicons";
moment.locale("vi");

const marks__status = {
  0: "Không",
  1: "Nhẹ",
  2: "Vừa phải",
  3: "Nặng",
};

function History() {
  const [listChild, setListChild] = useState([]);
  const [listCate, setListCate] = useState([]);
  const [childSelect, setChildSelect] = useState(null);
  const [cateSelected, setCateSelected] = useState("All");
  const [listActivity, setListActivity] = useState([]);
  const [itemSelected, setItemSelected] = useRecoilState(itemSelectedState);
  const [openModalActivitySelect, setOpenModalActivitySelect] = useRecoilState(
    openModalActivitySelectState
  );
  const reload = useRecoilValue(reloadState);

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
      setCateSelected("All");
    };
    getListCate();
  }, []);

  useEffect(() => {
    if (childSelect) {
      const getListActivity = async () => {
        const res = await activityService.getActivity(
          childSelect.Code,
          null,
          null,
          listCate.find((item) => item.Name === cateSelected)?.Code
        );
        if (res.StatusCode === 200) {
          setListActivity(res.Data);
        }
      };
      getListActivity();
    }
  }, [childSelect, cateSelected, reload]);

  const handleActivity = (item) => {
    setOpenModalActivitySelect(true);
    setItemSelected(item);
  };

  return (
    <div className="containerReminder containerHistory">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Dòng thời gian</title>
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
          {listChild.length > 0 && listCate.length > 0 && (
            <>
              <div className="containerReminder__main__right__name">
                <span className="activity__container__main__parent__header__title">
                  {childSelect?.Name}
                </span>
                <div>
                  <UilFilter color="#282828" style={{ cursor: "pointer" }} />
                </div>
              </div>
              <div
                style={{
                  padding: "16px",
                  paddingTop: "0",
                  display: "flex",
                  gap: 10,
                  overflowX: "scroll",
                }}
              >
                <div
                  className={`button__cate ${
                    cateSelected === "All" && "active__all"
                  } hover__all`}
                  text="Tất cả"
                  onClick={() => setCateSelected("All")}
                ></div>
                {listCate.map((item) => (
                  <div
                    key={item.Code}
                    className={`button__cate ${
                      cateSelected === item.Name &&
                      `active__${ACTIVITY.find(
                        (it) => it.title === item.Name
                      ).color.substring(1)}`
                    } ${`hover__${ACTIVITY.find(
                      (it) => it.title === item.Name
                    ).color.substring(1)}`}`}
                    onClick={() => setCateSelected(item.Name)}
                  >
                    <img
                      style={{ width: 20, height: 20 }}
                      src={ACTIVITY.find((it) => it.title === item.Name).icon}
                      alt=""
                    />
                    <span>{item.Name}</span>
                  </div>
                ))}
              </div>
            </>
          )}
          <div style={{ padding: "16px", paddingTop: 0 }}>
            {listActivity.map((item) => (
              <div key={item.Date}>
                <div>
                  <span
                    style={{
                      fontSize: 18,
                      color: "#8f8d95",
                      fontWeight: 500,
                    }}
                  >
                    {getWeekDay(item.Date)},{" "}
                    {moment(moment(item.Date, "DD-MM-YYYY")).format(
                      "DD MMM, YYYY"
                    )}
                  </span>
                </div>
                <div
                  style={{
                    boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                    borderRadius: "8px",
                    marginTop: "16px",
                    marginBottom: "16px",
                  }}
                >
                  {item.Activities.map((itemA, index) => (
                    <div key={itemA.Code}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          cursor: "pointer",
                        }}
                        onClick={() => handleActivity(itemA)}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "0 16px",
                          }}
                        >
                          <div>
                            <img
                              src={
                                ACTIVITY.find(
                                  (it) => it.title === itemA.CategoryName
                                ).icon
                              }
                              alt=""
                              style={{ width: 30, height: 30, marginRight: 10 }}
                            />
                          </div>
                          <div style={{ margin: "0 16px" }}>
                            <span>
                              {itemA.Data.timeStart
                                ? moment(
                                    itemA.Data.timeStart,
                                    "HH:mm:ss"
                                  ).format("HH:mm")
                                : moment(
                                    itemA.Data.date,
                                    "DD-MM-YYYY HH:mm:ss"
                                  ).format("HH:mm")}
                            </span>
                          </div>
                          <div
                            style={{
                              padding: "16px",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <span
                              style={{
                                fontWeight: 500,
                                color:
                                  ACTIVITY.find(
                                    (it) => it.title === itemA.CategoryName
                                  ).color || "#282828",
                              }}
                            >
                              {itemA.CategoryName === "Cho Ăn" &&
                                (itemA.Data.type === "Sữa bình" ||
                                  itemA.Data.type === "Ăn dặm") && (
                                  <div>
                                    Bé{" "}
                                    {itemA.Data.type === "Sữa bình"
                                      ? "uống "
                                      : ""}
                                    {itemA.Data.type.toLowerCase()}
                                  </div>
                                )}
                              {itemA.CategoryName !== "Cho Ăn" && (
                                <div>
                                  {itemA.Data.type
                                    ? itemA.Data.type
                                    : itemA.CategoryName}
                                </div>
                              )}
                              {itemA.CategoryName === "Cho Ăn" &&
                                itemA.Data.type === "Sữa mẹ" && (
                                  <div>
                                    Bé uống {itemA.Data.type.toLowerCase()}
                                  </div>
                                )}
                              {itemA.CategoryName === "Cho Ăn" &&
                                itemA.Data.type === "Khác" && (
                                  <div>{itemA.Data.type}</div>
                                )}
                            </span>
                            {itemA.Data.type !== "Khô" &&
                              itemA.CategoryName !== "Nhật Ký" && (
                                <span style={{ margin: "0 8px" }}>•</span>
                              )}
                            <span>
                              {(itemA.CategoryName === "Cho Ăn" ||
                                itemA.CategoryName === "Vắt Sữa" ||
                                itemA.CategoryName === "Ngủ" ||
                                itemA.CategoryName === "Giờ Chơi") &&
                                moment(itemA.Data.timeFinish, "HH:mm:ss").diff(
                                  moment(itemA.Data.timeStart, "HH:mm:ss"),
                                  "minutes"
                                ) + " phút"}
                            </span>
                            <div>
                              {itemA.CategoryName === "Cho Ăn" &&
                                (itemA.Data.type === "Sữa bình" ||
                                  itemA.Data.type === "Ăn dặm") && (
                                  <div
                                    style={{
                                      color: "#919097",
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <span style={{ margin: "0 8px" }}>•</span>
                                    <span>
                                      {itemA.Data.amount}
                                      {itemA.Data.unit}
                                    </span>
                                    <span style={{ margin: "0 8px" }}>•</span>
                                    <span
                                      style={{
                                        maxWidth: "450px",
                                        display: "inline-block",
                                        textOverflow: "ellipsis",
                                        overflow: "hidden",
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      Nguyên liệu:{" "}
                                      {itemA.Data.type === "Sữa bình"
                                        ? itemA.Data.material
                                        : itemA.Data.material.join(", ")}
                                    </span>
                                  </div>
                                )}
                              {itemA.CategoryName === "Vắt Sữa" && (
                                <span style={{ color: "#919097" }}>
                                  <span style={{ margin: "0 8px" }}>•</span>
                                  <span>
                                    {itemA.Data.left + itemA.Data.right}
                                    {itemA.Data.unit}
                                  </span>
                                </span>
                              )}

                              {itemA.CategoryName === "Thay Tã" &&
                                itemA.Data.type === "Ướt" && (
                                  <p
                                    style={{
                                      marginBottom: "0",
                                      marginTop: "-4px",
                                    }}
                                  >
                                    <Rate
                                      character={<UilTear />}
                                      count={3}
                                      style={{ color: "#79b9ff" }}
                                      value={itemA.Data.status}
                                      disabled
                                    />
                                  </p>
                                )}
                              {itemA.CategoryName === "Thay Tã" &&
                                itemA.Data.type === "Hỗn hợp" && (
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <p
                                      style={{
                                        marginBottom: "0",
                                        marginTop: "-4px",
                                      }}
                                    >
                                      <Rate
                                        character={<UilTear />}
                                        count={3}
                                        style={{ color: "#79b9ff" }}
                                        value={itemA.Data.status}
                                        disabled
                                      />
                                    </p>
                                    <span
                                      style={{
                                        color: "#919097",
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      <span style={{ margin: "0 8px" }}>•</span>
                                      <span
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                        }}
                                      >
                                        Màu phân:
                                        <div
                                          style={{
                                            backgroundColor: itemA.Data.color,
                                            width: "20px",
                                            height: "20px",
                                            borderRadius: "50%",
                                            cursor: "pointer",
                                            marginLeft: "8px",
                                          }}
                                        ></div>
                                      </span>
                                    </span>
                                  </div>
                                )}
                              {itemA.CategoryName === "Thay Tã" &&
                                itemA.Data.type === "Có phân" && (
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <span
                                      style={{
                                        color: "#919097",
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      <span
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                        }}
                                      >
                                        Màu phân:
                                        <div
                                          style={{
                                            backgroundColor: itemA.Data.color,
                                            width: "20px",
                                            height: "20px",
                                            borderRadius: "50%",
                                            cursor: "pointer",
                                            marginLeft: "8px",
                                          }}
                                        ></div>
                                      </span>
                                    </span>
                                  </div>
                                )}
                              {itemA.CategoryName === "Giờ Chơi" && (
                                <span style={{ color: "#919097" }}>
                                  <span style={{ margin: "0 8px" }}>•</span>
                                  <span>{itemA.Data.activity}</span>
                                </span>
                              )}
                              {itemA.CategoryName === "Sức Khỏe" &&
                                itemA.Data.type === "Nhiệt độ" && (
                                  <span style={{ color: "#919097" }}>
                                    {itemA.Data.temperature}
                                    {itemA.Data.unit}
                                  </span>
                                )}
                              {itemA.CategoryName === "Sức Khỏe" &&
                                itemA.Data.type === "Thuốc" && (
                                  <span style={{ color: "#919097" }}>
                                    <span>{itemA.Data.medicine}</span>
                                    <span style={{ margin: "0 8px" }}>•</span>
                                    <span>
                                      {itemA.Data.amount}
                                      {itemA.Data.unit}
                                    </span>
                                    <span style={{ margin: "0 8px" }}>•</span>
                                    <span>{itemA.Data.guide}</span>
                                  </span>
                                )}
                              {itemA.CategoryName === "Sức Khỏe" &&
                                itemA.Data.type === "Triệu chứng" && (
                                  <span style={{ color: "#919097" }}>
                                    <span> {itemA.Data.symptom}</span>
                                    <span style={{ margin: "0 8px" }}>•</span>
                                    <span>
                                      {marks__status[itemA.Data.status]}
                                    </span>
                                  </span>
                                )}
                              {itemA.CategoryName === "Tăng Trưởng" && (
                                <span style={{ color: "#919097" }}>
                                  <span>Nặng: {itemA.Data.weight} kg</span>
                                  <span style={{ margin: "0 8px" }}>•</span>
                                  <span>Cao: {itemA.Data.height} cm</span>
                                  <span style={{ margin: "0 8px" }}>•</span>
                                  <span>
                                    Chu vi đầu: {itemA.Data.headCircumference}{" "}
                                    cm
                                  </span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div style={{ marginRight: "16px" }}>
                          <span>
                            <UilAngleRight />
                          </span>
                        </div>
                      </div>
                      <div
                        className="divider-10"
                        style={{ margin: 0, padding: 0 }}
                      ></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {listCate.length > 0 && (
        <>
          {itemSelected?.CategoryName === "Cho Ăn" && (
            <ModalNormal
              activitySelect={itemSelected.CategoryName}
              open={openModalActivitySelect}
              color={
                ACTIVITY.find(
                  (item) => item.title === itemSelected.CategoryName
                ).color
              }
              cateCode={
                listCate.find((item) => item.Name === itemSelected.CategoryName)
                  .Code
              }
              typeApi="update"
              itemSelected={itemSelected}
            />
          )}
          {itemSelected?.CategoryName === "Vắt Sữa" && (
            <Milk
              activitySelect={itemSelected.CategoryName}
              open={openModalActivitySelect}
              color={
                ACTIVITY.find(
                  (item) => item.title === itemSelected.CategoryName
                ).color
              }
              cateCode={
                listCate.find((item) => item.Name === itemSelected.CategoryName)
                  .Code
              }
              typeApi="update"
              itemSelected={itemSelected}
            />
          )}
          {itemSelected?.CategoryName === "Thay Tã" && (
            <Diaper
              activitySelect={itemSelected.CategoryName}
              open={openModalActivitySelect}
              color={
                ACTIVITY.find(
                  (item) => item.title === itemSelected.CategoryName
                ).color
              }
              cateCode={
                listCate.find((item) => item.Name === itemSelected.CategoryName)
                  .Code
              }
              typeApi="update"
              itemSelected={itemSelected}
            />
          )}
          {itemSelected?.CategoryName === "Ngủ" && (
            <Sleep
              activitySelect={itemSelected.CategoryName}
              open={openModalActivitySelect}
              color={
                ACTIVITY.find(
                  (item) => item.title === itemSelected.CategoryName
                ).color
              }
              cateCode={
                listCate.find((item) => item.Name === itemSelected.CategoryName)
                  .Code
              }
              typeApi="update"
              itemSelected={itemSelected}
            />
          )}
          {itemSelected?.CategoryName === "Sức Khỏe" && (
            <Health
              activitySelect={itemSelected.CategoryName}
              open={openModalActivitySelect}
              color={
                ACTIVITY.find(
                  (item) => item.title === itemSelected.CategoryName
                ).color
              }
              cateCode={
                listCate.find((item) => item.Name === itemSelected.CategoryName)
                  .Code
              }
              typeApi="update"
              itemSelected={itemSelected}
            />
          )}
          {itemSelected?.CategoryName === "Giờ Chơi" && (
            <HangOut
              activitySelect={itemSelected.CategoryName}
              open={openModalActivitySelect}
              color={
                ACTIVITY.find(
                  (item) => item.title === itemSelected.CategoryName
                ).color
              }
              cateCode={
                listCate.find((item) => item.Name === itemSelected.CategoryName)
                  .Code
              }
              typeApi="update"
              itemSelected={itemSelected}
            />
          )}
          {itemSelected?.CategoryName === "Tăng Trưởng" && (
            <Growth
              activitySelect={itemSelected.CategoryName}
              open={openModalActivitySelect}
              color={
                ACTIVITY.find(
                  (item) => item.title === itemSelected.CategoryName
                ).color
              }
              cateCode={
                listCate.find((item) => item.Name === itemSelected.CategoryName)
                  .Code
              }
              typeApi="update"
              itemSelected={itemSelected}
            />
          )}
          {itemSelected?.CategoryName === "Nhật Ký" && (
            <Diary
              activitySelect={itemSelected.CategoryName}
              open={openModalActivitySelect}
              color={
                ACTIVITY.find(
                  (item) => item.title === itemSelected.CategoryName
                ).color
              }
              cateCode={
                listCate.find((item) => item.Name === itemSelected.CategoryName)
                  .Code
              }
              typeApi="update"
              itemSelected={itemSelected}
            />
          )}
        </>
      )}
    </div>
  );
}

export default History;
