import { createBrowserRouter } from 'react-router-dom'
import Layout from '../pages/Layout'
import MainPage from '../pages/MainPage'
import BooksPage from '../pages/BooksPage'
import BookDetailPage from '../pages/BookDetailPage'
import OrderPage from '../pages/OrderPage'
import CartPage from '../pages/CartPage'
import PaymentSuccessPage from '../pages/PaymentSuccessPage'
import PaymentFailPage from '../pages/PaymentFailPage'
import LoginPage from '../pages/LoginPage'
import PrivateRoute from '../components/PrivateRoute'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <MainPage />,
      },
      {
        path: 'book/:category',
        element: <BooksPage />,
      },
      {
        path: 'books/:bookId',
        element: <BookDetailPage />,
      },
      {
        element: <PrivateRoute />,
        children: [
          {
            path: 'order',
            element: <OrderPage />,
          },
          {
            path: 'cart',
            element: <CartPage />,
          },
          {
            path: 'payment/success',
            element: <PaymentSuccessPage />,
          },
          {
            path: 'payment/fail',
            element: <PaymentFailPage />,
          },
        ],
      },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
])

export default router