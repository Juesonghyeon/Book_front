import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { getTopNBooks } from '../services/bookService'
import BookCard from '../components/BookCard'
import styles from './HomePage.module.css'

const SECTIONS = [
  {
    key: 'bestTopN',
    title: '베스트셀러 Top 5',
    route: '/book/bestseller',
    variant: 'default',
  },
  {
    key: 'newTopN',
    title: '새로나온책 Top 5',
    route: '/book/new',
    variant: 'default',
  },
  {
    key: 'basicTopN',
    title: '기본서 Top 5',
    route: '/book/basic',
    variant: 'basic',
  },
]

export default function HomePage() {
  const navigate = useNavigate()
  const [books, setBooks] = useState({ bestTopN: [], newTopN: [], basicTopN: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getTopNBooks()
      .then((res) => setBooks(res.data))
      .catch(() => setError('데이터를 불러오는데 실패했습니다.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className={styles.loading}>로딩 중...</div>
  }

  if (error) {
    return <div className={styles.error}>{error}</div>
  }

  return (
    <div className={styles.page}>
      {SECTIONS.map(({ key, title, route, variant }) => (
        <section key={key} className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{title}</h2>
            <button
              className={styles.moreBtn}
              onClick={() => navigate(route)}
            >
              더보기
              <ChevronRight size={16} />
            </button>
          </div>
          <div className={styles.booksRow}>
            {books[key].map((book, index) => (
              <BookCard key={book.id} book={book} index={index} variant={variant} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}