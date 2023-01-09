export const BLOG = {
  pageDefault: 1,
  pageSizeDefault: 5,
};

export const COMMENT = {
  pageDefault: 1,
  pageSizeDefault: 5,
};

export const STATUS_BLOG = {
  inactice: 0,
  active: 1,
  pending: 2,
};

export const STATUS_BLOG_DETAIL = {
  2: {
    title: "Bài viết đang được kiểm duyệt",
    des: "Nhằm tránh các trường hợp đăng các bài viết gây ảnh hưởng cho cộng đồng nên các bài viết khi đăng lên sẽ được kiểm duyệt bởi Admin. Quá trình có thể mất từ vài phút đến vài tiếng. Cảm ơn bạn đã đóng góp cho cộng đồng và xin lỗi vì sự bất tiện này.",
    classBackground: "blog__container__noti__pending",
    classTitle: "blog__container__noti__title__pending",
  },
  1: {
    title: "Bài viết đã được kiểm duyệt thành công",
    des: "Bài viết của bạn đã được kiểm duyệt thành công và đã được đăng lên trang chủ. Cảm ơn bạn đã đóng góp cho cộng đồng.",
    classBackground: "blog__container__noti__active",
    classTitle: "blog__container__noti__title__active",
  },
  3: {
    title: "Bài viết đã bị từ chối",
    des: "Bài viết của bạn đã bị từ chối vì nội dung không phù hợp với quy định của chúng tôi. Cảm ơn bạn đã đóng góp cho cộng đồng.",
    classBackground: "blog__container__noti__inactive",
    classTitle: "blog__container__noti__title__inactive",
  },
  0: {
    title: "Bài viết đã bị xóa",
    des: "Bài viết của bạn đã bị xóa vì nội dung không phù hợp với quy định của chúng tôi. Cảm ơn bạn đã đóng góp cho cộng đồng.",
    classBackground: "blog__container__noti__inactive",
    classTitle: "blog__container__noti__title__inactive",
  },
};
