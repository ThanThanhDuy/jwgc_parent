import moment from "moment";

const caculateDate = (date) => {
  const today = moment(moment().format("YYYY-MM-DD HH:mm:ss"));
  const postDate = moment(moment(date).format("YYYY-MM-DD HH:mm:ss"));
  if (today.isSame(postDate, "day")) {
    let seconds = today.diff(postDate, "seconds");
    if (seconds <= 60) {
      return seconds + " giây trước";
    } else if (seconds <= 3600) {
      return today.diff(postDate, "minutes") + " phút trước";
    } else {
      return today.diff(postDate, "hours") + " giờ trước";
    }
  } else {
    return today.diff(postDate, "days") + " ngày trước";
  }
};

const caculateAge = (date) => {
  const today = moment(moment().format("DD-MM-YYYY"), "DD-MM-YYYY");
  const dateOfBirth = moment(date, "DD-MM-YYYY");
  const age = today.diff(dateOfBirth, "years");
  if (age === 0) {
    const month = today.diff(dateOfBirth, "months");
    if (month === 0) {
      return today.diff(dateOfBirth, "days") + " ngày tuổi";
    }
    return month + " tháng tuổi";
  } else {
    return age + " tuổi";
  }
};

export { caculateDate, caculateAge };
