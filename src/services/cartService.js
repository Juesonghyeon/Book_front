import axiosInstance from '../apis/axiosInstance'

export const addToCart = async (bookId, quantity = 1) => {
  const response = await axiosInstance.post('/carts', { bookId, quantity })
  return response.data
}

export const getCarts = async () => {
  const response = await axiosInstance.get('/carts')
  return response.data
}