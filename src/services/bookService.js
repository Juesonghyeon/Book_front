import axiosInstance from '../apis/axiosInstance'

export const getTopNBooks = async () => {
  try {
    const response = await axiosInstance.get('/books/topn')
    return response.data
  } catch {
    const response = await fetch('/mocks/books-topn.json')
    return response.json()
  }
}

export const getBooksByCategory = async (category, page = 0, size = 10) => {
  try {
    const response = await axiosInstance.get('/books', { params: { category, page, size } })
    return response.data
  } catch {
    const response = await fetch('/mocks/books.json')
    const json = await response.json()
    return json[category] ?? { code: 200, data: [], pageInfo: { nowPageNum: 0, totalRows: 0 } }
  }
}

export const getBookById = async (bookId) => {
  const response = await axiosInstance.get(`/books/${bookId}`)
  return response.data
}