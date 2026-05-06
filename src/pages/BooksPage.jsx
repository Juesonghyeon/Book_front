import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
  BookOpen, Search, ShoppingCart,
  ChevronDown, ChevronLeft, ChevronRight,
} from 'lucide-react'
import { getBooksByCategory } from '../services/bookService'
import styles from './BooksPage.module.css'

const CATEGORY_LABEL = {
  bestseller: '베스트셀러',
  new: '새로운책',
  basic: '기본서',
  mobile: '모바일',
  web: '웹프로그래밍',
}

const COVER_STYLES = [
  { gradient: 'linear-gradient(180deg, #DBEAFE 0%, #BFDBFE 100%)', iconColor: '#3B82F6' },
  { gradient: 'linear-gradient(180deg, #FEF3C7 0%, #FDE68A 100%)', iconColor: '#D97706' },
  { gradient: 'linear-gradient(180deg, #D1FAE5 0%, #A7F3D0 100%)', iconColor: '#059669' },
  { gradient: 'linear-gradient(180deg, #FCE7F3 0%, #FBCFE8 100%)', iconColor: '#DB2777' },
  { gradient: 'linear-gradient(180deg, #E0E7FF 0%, #C7D2FE 100%)', iconColor: '#4F46E5' },
]

const SIZE_OPTIONS = [10, 20, 30]

export default function BooksPage() {
  const { category } = useParams()
  const [books, setBooks] = useState([])
  const [pageInfo, setPageInfo] = useState({ nowPageNum: 0, totalRows: 0 })
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const [searchInput, setSearchInput] = useState('')
  const [sizeOpen, setSizeOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setPage(0)
    setSearchInput('')
  }, [category])

  useEffect(() => {
    setLoading(true)
    setError(null)
    getBooksByCategory(category, page, size)
      .then((res) => {
        setBooks(res.data)
        setPageInfo(res.pageInfo)
      })
      .catch(() => setError('데이터를 불러오는데 실패했습니다.'))
      .finally(() => setLoading(false))
  }, [category, page, size])

  const label = CATEGORY_LABEL[category] ?? category
  const totalPages = Math.ceil(pageInfo.totalRows / size)
  const startNum = page * size + 1

  if (error) return <div className={styles.error}>{error}</div>

  return (
    <div className={styles.page}>

      {/* 헤더 */}
      <div className={styles.listHeader}>
        <div className={styles.topRow}>
          <div className={styles.titleArea}>
            <BookOpen size={24} color="#2563EB" />
            <span className={styles.titleTxt}>{label}</span>
            <span className={styles.totalCount}>(총 {pageInfo.totalRows}권)</span>
          </div>
        </div>

        <div className={styles.searchRow}>
          <div className={styles.searchWrap}>
            <div className={styles.searchInput}>
              <Search size={18} color="#9CA3AF" />
              <input
                type="text"
                className={styles.input}
                placeholder="도서명, 저자명으로 검색"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <button className={styles.searchBtn}>검색</button>
          </div>
        </div>

        <div className={styles.bottomRow}>
          <div className={styles.sizeSelector}>
            <button
              className={styles.selectBox}
              onClick={() => setSizeOpen((v) => !v)}
            >
              <span>{size}개씩 보기</span>
              <ChevronDown size={14} color="#6B7280" />
            </button>
            {sizeOpen && (
              <div className={styles.dropdown}>
                {SIZE_OPTIONS.map((opt) => (
                  <div
                    key={opt}
                    className={`${styles.dropdownOpt} ${opt === size ? styles.dropdownOptActive : ''}`}
                    onClick={() => { setSize(opt); setPage(0); setSizeOpen(false) }}
                  >
                    {opt}개씩 보기
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 책 목록 */}
      <div className={styles.listSection}>
        {loading
          ? Array.from({ length: size }, (_, i) => (
              <div key={i} className={`${styles.bookRow} ${styles.skeleton}`} />
            ))
          : books.map((book, index) => {
              const cover = COVER_STYLES[(startNum + index - 1) % COVER_STYLES.length]
              return (
                <div key={book.id} className={styles.bookRow}>
                  <div className={styles.rowLeft}>
                    <span className={styles.rowNum}>{startNum + index}</span>
                    <div className={styles.rowCover} style={{ background: cover.gradient }}>
                      {book.imageUrl
                        ? <img src={book.imageUrl} alt={book.title} className={styles.coverImg} />
                        : <BookOpen size={24} color={cover.iconColor} />
                      }
                    </div>
                    <div className={styles.rowInfo}>
                      <span className={styles.rowTitle}>{book.title}</span>
                      <span className={styles.rowAuthor}>{book.author}</span>
                      <span className={styles.rowPrice}>{book.price.toLocaleString()}원</span>
                    </div>
                  </div>
                  <div className={styles.rowBtns}>
                    <button className={styles.orderBtn}>주문하기</button>
                    <button className={styles.cartBtn}>
                      <ShoppingCart size={14} color="#374151" />
                      장바구니
                    </button>
                  </div>
                </div>
              )
            })
        }
      </div>

      {/* 페이지네이션 */}
      {!loading && totalPages > 1 && (
        <div className={styles.paginationSection}>
          <div className={styles.pagination}>
            <button
              className={styles.pageBtn}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              <ChevronLeft size={16} color="#9CA3AF" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`${styles.pageBtn} ${i === page ? styles.pageBtnActive : ''}`}
                onClick={() => setPage(i)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className={styles.pageBtn}
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
            >
              <ChevronRight size={16} color="#374151" />
            </button>
          </div>
        </div>
      )}

    </div>
  )
}