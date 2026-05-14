import axiosInstance from '../apis/axiosInstance'

export const getOrderBooks = async (bookIds) => {
  const response = await axiosInstance.get('/books', {
    params: { 'order-books': bookIds.join(',') },
  })
  return response.data
}