import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import styles from './LoginPage.module.css'
import { login } from '../services/authService'
import useAuthStore from '../stores/authStore'

export default function LoginPage() {
  const [form, setForm] = useState({ userId: '', passwd: '' })
  const [errorMsg, setErrorMsg] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const setAuth = useAuthStore((state) => state.setAuth)

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    try {
      const data = await login(form.userId, form.passwd)
      setAuth(data)
      const from = location.state?.from
      navigate(from ? from.pathname : '/', { state: from?.state, replace: true })
    } catch (err) {
      const message =
        err.response?.data?.message || err.response?.data || '로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.'
      setErrorMsg(message)
      alert(message)
    }
  }

  const handleSignup = () => {
    navigate('/signup')
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.title}>북스토어</h1>
        <p className={styles.subtitle}>로그인하여 서비스를 이용하세요</p>

        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="userId">
              아이디
            </label>
            <input
              id="userId"
              name="userId"
              type="text"
              placeholder="아이디를 입력하세요"
              value={form.userId}
              onChange={handleChange}
              className={styles.input}
              autoComplete="username"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="passwd">
              비밀번호
            </label>
            <input
              id="passwd"
              name="passwd"
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={form.passwd}
              onChange={handleChange}
              className={styles.input}
              autoComplete="current-password"
            />
          </div>

          {errorMsg && <p className={styles.errorMsg}>{errorMsg}</p>}

          <div className={styles.actions}>
            <button type="submit" className={styles.loginBtn}>
              로그인
            </button>
            <button type="button" onClick={handleSignup} className={styles.signupBtn}>
              회원가입
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}