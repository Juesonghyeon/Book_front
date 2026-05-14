import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { getTopNBooks } from '../services/bookService'
import BookCard from '../components/BookCard'
import styles from './MainPage.module.css'

const SECTIONS = [
  {
    key: 'bestTopN',
    title: '베스트셀러 Top 5',
    category: 'bestSeller',
    variant: 'default',
    btnStyle: 'moreBtnDefault',
  },
  {
    key: 'newTopN',
    title: '새로나온책 Top 5',
    category: '새책',
    variant: 'default',
    btnStyle: 'moreBtnDefault',
  },
  {
    key: 'basicTopN',
    title: '기본서 Top 5',
    category: 'Basic',
    variant: 'basic',
    btnStyle: 'moreBtnBorder',
  },
]

export default function MainPage() {
  const navigate = useNavigate()
  const [books, setBooks] = useState({ bestTopN: [], newTopN: [], basicTopN: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getTopNBooks()
      .then((res) => setBooks(res?.data ?? res))
      .catch(() => setError('데이터를 불러오는데 실패했습니다.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className={styles.loading}>로딩 중...</div>
  if (error) return <div className={styles.error}>{error}</div>

  return (
    <div className={styles.page}>
      {SECTIONS.map(({ key, title, category, variant, btnStyle }) => (
        <section key={key} className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{title}</h2>
            <button
              className={styles[btnStyle]}
              onClick={() => navigate(`/books?category=${category}`)}
            >
              더보기
              <ChevronRight size={16} />
            </button>
          </div>
          <div className={styles.booksRow}>
            {(books[key] ?? []).map((book, index) => (
              <BookCard key={book.id ?? book.bookId} book={book} index={index} variant={variant} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
