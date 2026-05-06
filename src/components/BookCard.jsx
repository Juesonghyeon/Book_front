import { BookOpen } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import styles from './BookCard.module.css'

const COVER_COLORS = [
  '#E8D5C4', '#C4D8E8', '#D5E8C4', '#E8C4D5', '#D5C4E8',
  '#E8E0C4', '#C4E8E0', '#D4C4E8', '#E8D0C4', '#C4D5E8',
]

const BASIC_COVERS = [
  { gradient: 'linear-gradient(180deg, #DBEAFE 0%, #BFDBFE 100%)', iconColor: '#2563EB' },
  { gradient: 'linear-gradient(180deg, #FEF3C7 0%, #FDE68A 100%)', iconColor: '#D97706' },
  { gradient: 'linear-gradient(180deg, #D1FAE5 0%, #A7F3D0 100%)', iconColor: '#059669' },
  { gradient: 'linear-gradient(180deg, #FCE7F3 0%, #FBCFE8 100%)', iconColor: '#DB2777' },
  { gradient: 'linear-gradient(180deg, #E0E7FF 0%, #C7D2FE 100%)', iconColor: '#4F46E5' },
]

export default function BookCard({ book, index, variant = 'default' }) {
  const navigate = useNavigate()
  const isBasic = variant === 'basic'

  const coverStyle = isBasic
    ? { background: BASIC_COVERS[index % BASIC_COVERS.length].gradient }
    : { background: COVER_COLORS[index % COVER_COLORS.length] }

  const iconColor = isBasic ? BASIC_COVERS[index % BASIC_COVERS.length].iconColor : null

  return (
    <div
      className={`${styles.card} ${isBasic ? styles.cardBasic : ''}`}
      onClick={() => navigate(`/books/${book.id}`)}
    >
      <div className={styles.cover} style={coverStyle}>
        {book.imageUrl ? (
          <img src={book.imageUrl} alt={book.title} className={styles.coverImg} />
        ) : isBasic ? (
          <BookOpen size={40} color={iconColor} strokeWidth={1.5} />
        ) : null}
      </div>
      <div className={isBasic ? styles.infoBasic : styles.info}>
        <p className={styles.title}>{book.title}</p>
        <p className={styles.author}>{book.author}</p>
        <p className={styles.price}>{book.price.toLocaleString()}원</p>
      </div>
    </div>
  )
}