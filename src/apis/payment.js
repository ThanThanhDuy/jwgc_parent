import axiosClient from "./index.js";
class PaymentApi {
  async getLinkMomo(params) {
    const url = `payments/momo`;
    return axiosClient.get(url, {
      params: {
        ...params,
      },
    });
  }
}

const paymentApi = new PaymentApi();
export default paymentApi;
