import axiosInstance from '../apis/axiosInstance'

export const login = async (userId, passwd) => {
  const response = await axiosInstance.post('/login', new URLSearchParams({ userId, passwd }), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
  return response.data
}