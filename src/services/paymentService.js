import axiosInstance from '../apis/axiosInstance'

export const createOrder = async (req) => {
  const response = await axiosInstance.post('/orders', req)
  return response.data
}

export const completePayment = async ({ paymentId, orderId }) => {
  const response = await axiosInstance.post('/payments/complete', { paymentId, orderId })
  return response.data
}
