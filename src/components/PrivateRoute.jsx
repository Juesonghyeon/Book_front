import { Navigate, Outlet } from 'react-router-dom'
import useAuthStore from '../stores/authStore'

export default function PrivateRoute() {
  const accessToken = useAuthStore((state) => state.accessToken)

  if (!accessToken) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}