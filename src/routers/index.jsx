import { createBrowserRouter } from 'react-router-dom'
import Layout from '../pages/Layout'
import MainPage from '../pages/MainPage'
import BooksPage from '../pages/BooksPage'
import BookDetailPage from '../pages/BookDetailPage'
import LoginPage from '../pages/LoginPage'
import PrivateRoute from '../components/PrivateRoute'

const router = createBrowserRouter([
  {
    path: '/',
    element: <PrivateRoute />,
    children: [
      {
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