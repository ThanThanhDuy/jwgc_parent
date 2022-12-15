import moment from "moment";

const caculateDate = (date) => {
  const today = moment(moment().format("YYYY-MM-DD HH:mm:ss"));
  const postDate = moment(moment(date).format("YYYY-MM-DD HH:mm:ss"));
  if (today.isSame(postDate, "day")) {
    let seconds = today.diff(postDate, "seconds");
    if (seconds < 60) {
      return seconds + " giây trước";
    } else if (seconds < 3600) {
      return today.diff(postDate, "minutes") + " phút trước";
    } else {
      return today.diff(postDate, "hours") + " giờ trước";
    }
  } else {
    return today.diff(postDate, "days") + " ngày trước";
  }
};

export { caculateDate };
