import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosInstance.interceptors.request.use(
  (config) => {
    const raw = localStorage.getItem('auth-storage')
    if (raw) {
      try {
        const { state } = JSON.parse(raw)
        if (state?.accessToken) {
          config.headers.Authorization = `${state.tokenType ?? 'Bearer'} ${state.accessToken}`
        }
      } catch {
        // 파싱 실패 시 토큰 없이 요청
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
)

export default axiosInstance