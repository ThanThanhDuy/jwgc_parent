import paymentApi from "../apis/payment";

class PaymentService {
  async getLinkMomo(redirectUrl) {
    const params = {};
    redirectUrl && (params["redirectUrl"] = redirectUrl);

    try {
      var response = await paymentApi.getLinkMomo(params);
    } catch (error) {
      return error;
    }
    return response;
  }
}
const paymentService = new PaymentService();
export default paymentService;
