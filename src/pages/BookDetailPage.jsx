import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
  BookOpen, FileText, MessageSquare,
  ShoppingCart, ChevronDown, ChevronLeft, ChevronRight,
  User, Star,
} from 'lucide-react'
import { getBookById } from '../services/bookService'
import styles from './BookDetailPage.module.css'

const PAGE_SIZE = 10

function StarRating({ rating = 0 }) {
  return (
    <div className={styles.stars}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={14}
          fill={i < rating ? '#F59E0B' : '#D1D5DB'}
          color={i < rating ? '#F59E0B' : '#D1D5DB'}
          strokeWidth={0}
        />
      ))}
    </div>
  )
}

function ReviewItem({ review }) {
  return (
    <li className={styles.reviewItem}>
      <div className={styles.reviewTop}>
        <div className={styles.reviewLeft}>
          <div className={styles.avatar}>
            <User size={16} color="#2563EB" />
          </div>
          <span className={styles.reviewAuthor}>{review.author ?? '익명'}</span>
          <StarRating rating={review.rating ?? 0} />
        </div>
        <span className={styles.reviewDate}>{review.createdAt}</span>
      </div>
      <p className={styles.reviewText}>{review.content}</p>
    </li>
  )
}

export default function BookDetailPage() {
  const { bookId } = useParams()
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [adExpanded, setAdExpanded] = useState(false)
  const [collapsedHeight, setCollapsedHeight] = useState(360)
  const [reviewPage, setReviewPage] = useState(1)

  const handleContentsLoad = (e) => {
    const img = e.target
    const displayedHeight = (img.offsetWidth / img.naturalWidth) * img.naturalHeight
    setCollapsedHeight(Math.round(displayedHeight * 0.2))
  }

  useEffect(() => {
    setLoading(true)
    setError(null)
    getBookById(bookId)
      .then((res) => setBook(res.data))
      .catch(() => setError('도서 정보를 불러오는데 실패했습니다.'))
      .finally(() => setLoading(false))
  }, [bookId])

  if (loading) return <div className={styles.loading}>로딩 중...</div>
  if (error) return <div className={styles.error}>{error}</div>
  if (!book) return null

  const reviews = book.reviewList ?? []
  const totalPages = Math.max(1, Math.ceil(reviews.length / PAGE_SIZE))
  const pagedReviews = reviews.slice((reviewPage - 1) * PAGE_SIZE, reviewPage * PAGE_SIZE)

  return (
    <div className={styles.page}>

      {/* 도서 정보 섹션 */}
      <section className={styles.infoSection}>
        <div className={styles.coverWrapper}>
          {book.imageUrl ? (
            <img src={book.imageUrl} alt={book.title} className={styles.coverImg} />
          ) : (
            <div className={styles.coverPlaceholder}>
              <BookOpen size={64} color="#3B82F6" strokeWidth={1.5} />
            </div>
          )}
        </div>

        <div className={styles.details}>
          <h1 className={styles.title}>{book.title}</h1>
          {book.subtitle && <p className={styles.subtitle}>{book.subtitle}</p>}

          <hr className={styles.divider} />

          <div className={styles.metaRow}>
            <span className={styles.metaLabel}>저자</span>
            <span className={styles.metaValue}>{book.author}</span>
          </div>
          <div className={styles.metaRow}>
            <span className={styles.metaLabel}>출판사</span>
            <span className={styles.metaValue}>{book.publisher}</span>
          </div>
          <div className={styles.metaRow}>
            <span className={styles.metaLabel}>출간일</span>
            <span className={styles.metaValue}>{book.publishDate}</span>
          </div>

          <hr className={styles.divider} />

          <div className={styles.priceGroup}>
            <div className={styles.originalPriceWrapper}>
              <span className={styles.originalPrice}>
                {book.originalPrice.toLocaleString()}원
              </span>
              <div className={styles.strikeLine} />
            </div>
            <span className={styles.salePrice}>{book.salePrice.toLocaleString()}원</span>
          </div>

          <div className={styles.btnRow}>
            <button className={styles.cartBtn}>
              <ShoppingCart size={18} />
              장바구니
            </button>
            <button className={styles.buyBtn}>바로구매</button>
          </div>
        </div>
      </section>

      {/* 책 소개 섹션 */}
      <section className={styles.descSection}>
        <div className={styles.sectionHeader}>
          <FileText size={24} color="#1F2937" />
          <h2 className={styles.sectionTitle}>책 소개</h2>
        </div>
        <p className={styles.descText}>{book.description}</p>
      </section>

      {/* 광고 섹션 — contents 이미지가 있으면 이미지, 없으면 프로모션 배너 */}
      <section className={styles.adSection}>
        <div
          className={styles.adImageContainer}
          style={{ height: adExpanded ? 'auto' : `${collapsedHeight}px` }}
        >
          {book.contents ? (
            <img
              src={book.contents}
              alt="상품 상세 정보"
              className={styles.adImage}
              onLoad={handleContentsLoad}
            />
          ) : (
            <div className={styles.adBanner}>
              <span className={styles.adEmoji}>📚</span>
              <span className={styles.adSummer}>SUMMER</span>
              <span className={styles.adBookSale}>BOOK SALE</span>
              <div className={styles.adDivider} />
              <span className={styles.adUpTo}>UP TO</span>
              <span className={styles.adPercent}>50%</span>
              <span className={styles.adOff}>OFF</span>
              <div className={styles.adDivider} />
              <span className={styles.adCat}>소설</span>
              <span className={styles.adCat}>에세이</span>
              <span className={styles.adCat}>자기계발</span>
              <span className={styles.adCat}>IT/컴퓨터</span>
              <span className={styles.adCat}>경제/경영</span>
              <div className={styles.adDivider} />
              <span className={styles.adPeriod}>2026.04.01 ~ 2026.04.30</span>
            </div>
          )}
        </div>
        <button className={styles.adMoreBtn} onClick={() => setAdExpanded((v) => !v)}>
          <span>{adExpanded ? '상품정보 접기' : '상품정보 더보기'}</span>
          <ChevronDown
            size={16}
            color="#3B82F6"
            style={{
              transform: adExpanded ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.2s',
            }}
          />
        </button>
      </section>

      {/* 리뷰 섹션 */}
      <section className={styles.reviewSection}>
        <div className={styles.reviewHeader}>
          <div className={styles.reviewHeaderLeft}>
            <MessageSquare size={24} color="#1F2937" />
            <h2 className={styles.sectionTitle}>리뷰</h2>
            <span className={styles.reviewCount}>(총 {reviews.length}건)</span>
          </div>
        </div>
        <hr className={styles.divider} />

        {pagedReviews.length === 0 ? (
          <p className={styles.emptyReview}>리뷰가 없습니다.</p>
        ) : (
          <ul className={styles.reviewList}>
            {pagedReviews.map((review) => (
              <ReviewItem key={review.reviewId} review={review} />
            ))}
          </ul>
        )}

        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              className={styles.pageBtn}
              onClick={() => setReviewPage((p) => Math.max(1, p - 1))}
              disabled={reviewPage === 1}
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                className={`${styles.pageBtn} ${p === reviewPage ? styles.pageBtnActive : ''}`}
                onClick={() => setReviewPage(p)}
              >
                {p}
              </button>
            ))}
            <button
              className={styles.pageBtn}
              onClick={() => setReviewPage((p) => Math.min(totalPages, p + 1))}
              disabled={reviewPage === totalPages}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </section>
    </div>
  )
}