import { Navigate, Outlet, useLocation } from 'react-router-dom'
import useAuthStore from '../stores/authStore'

export default function PrivateRoute() {
  const accessToken = useAuthStore((state) => state.accessToken)
  const location = useLocation()

  if (!accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}