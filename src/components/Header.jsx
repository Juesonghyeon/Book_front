import { NavLink, useNavigate } from 'react-router-dom'
import { BookOpen } from 'lucide-react'
import styles from './Header.module.css'

const menuItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/book/bestseller', label: '베스트셀러' },
  { to: '/book/new', label: '새로운책' },
  { to: '/book/basic', label: '기본서' },
  { to: '/book/mobile', label: '모바일' },
  { to: '/book/web', label: '웹프로그래밍' },
]

export default function Header() {
  const navigate = useNavigate()

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <NavLink to="/" className={styles.logo}>
          <BookOpen size={28} color="#2563EB" />
          <span className={styles.logoText}>북스토어</span>
        </NavLink>

        <nav className={styles.menu}>
          {menuItems.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `${styles.menuItem} ${isActive ? styles.menuItemActive : ''}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      <button className={styles.loginBtn} onClick={() => navigate('/login')}>로그인</button>
    </header>
  )
}