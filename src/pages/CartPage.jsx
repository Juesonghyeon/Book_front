import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingCart, Minus, Plus, X, Check, BookOpen } from 'lucide-react'
import { getCarts } from '../services/cartService'
import styles from './CartPage.module.css'

export default function CartPage() {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [checked, setChecked] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCarts()
      .then((res) => {
        // res = response.data (body). 배열 직접 반환 또는 {data:[...]} 래핑 모두 처리
        const raw = Array.isArray(res) ? res : (res?.data ?? [])
        // 필드명 오타·혼용(origninalPrice/originalPrice, salesPrice/salePrice) 및 문자열 타입 정규화
        const data = raw.map((item) => ({
          ...item,
          originalPrice: Number(item.originalPrice ?? item.origninalPrice) || 0,
          salesPrice: Number(item.salesPrice ?? item.salePrice) || 0,
        }))
        setItems(data)
        const initial = {}
        data.forEach((item) => { initial[item.bookId] = true })
        setChecked(initial)
      })
      .catch(() => alert('장바구니 정보를 불러오는데 실패했습니다.'))
      .finally(() => setLoading(false))
  }, [])

  const checkedItems = items.filter((item) => checked[item.bookId])
  const allChecked = items.length > 0 && checkedItems.length === items.length

  const originalTotal = checkedItems.reduce(
    (sum, item) => sum + item.originalPrice * item.quantity, 0
  )
  const salesTotal = checkedItems.reduce(
    (sum, item) => sum + item.salesPrice * item.quantity, 0
  )
  const discount = originalTotal - salesTotal

  const toggleAll = () => {
    const next = !allChecked
    const newChecked = {}
    items.forEach((item) => { newChecked[item.bookId] = next })
    setChecked(newChecked)
  }

  const toggleItem = (bookId) =>
    setChecked((prev) => ({ ...prev, [bookId]: !prev[bookId] }))

  const deleteItem = (bookId) => {
    setItems((prev) => prev.filter((item) => item.bookId !== bookId))
    setChecked((prev) => {
      const next = { ...prev }
      delete next[bookId]
      return next
    })
  }

  const changeQty = (bookId, delta) =>
    setItems((prev) =>
      prev.map((item) =>
        item.bookId === bookId
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    )

  const handleOrder = () => {
    if (checkedItems.length === 0) {
      alert('선택된 상품이 없습니다.')
      return
    }
    navigate('/order', {
      state: {
        books: checkedItems.map(({ bookId, quantity }) => ({ bookId, quantity })),
      },
    })
  }

  if (loading) return <div className={styles.loading}>로딩 중...</div>

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <span className={styles.headerTitle}>장바구니</span>
        <span className={styles.headerBack} onClick={() => navigate(-1)}>
          ← 쇼핑 계속하기
        </span>
      </div>

      <div className={styles.body}>
        <div className={styles.leftCol}>
          {items.length === 0 ? (
            <div className={styles.emptyCart}>
              <ShoppingCart size={48} color="#9CA3AF" />
              <p>장바구니에 담긴 상품이 없습니다.</p>
            </div>
          ) : (
            <div className={styles.cartCard}>
              <div className={styles.selectAllRow}>
                <div
                  className={styles.checkbox}
                  data-checked={allChecked}
                  onClick={toggleAll}
                >
                  {allChecked && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
                </div>
                <span className={styles.selectAllText}>
                  전체선택 ({checkedItems.length}/{items.length})
                </span>
              </div>
              <div className={styles.divider} />

              <div className={styles.cartItems}>
                {items.map((item) => (
                  <div key={item.bookId} className={styles.cartItem}>
                    <div
                      className={styles.checkbox}
                      data-checked={!!checked[item.bookId]}
                      onClick={() => toggleItem(item.bookId)}
                    >
                      {checked[item.bookId] && (
                        <Check size={12} color="#FFFFFF" strokeWidth={3} />
                      )}
                    </div>
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.title} className={styles.itemImg} />
                    ) : (
                      <div className={styles.itemImg}>
                        <BookOpen size={28} color="#9CA3AF" strokeWidth={1.5} />
                      </div>
                    )}
                    <div className={styles.bookInfo}>
                      <span className={styles.bookTitle}>{item.title}</span>
                      <span className={styles.bookAuthor}>{item.author}</span>
                      <span className={styles.bookOriginalPrice}>
                        {item.originalPrice.toLocaleString()}원
                      </span>
                    </div>
                    <div className={styles.qtyControl}>
                      <button
                        className={styles.qtyBtn}
                        onClick={() => changeQty(item.bookId, -1)}
                      >
                        <Minus size={12} />
                      </button>
                      <span className={styles.qtyValue}>{item.quantity}</span>
                      <button
                        className={styles.qtyBtn}
                        onClick={() => changeQty(item.bookId, 1)}
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <span className={styles.itemPrice}>
                      {(item.salesPrice * item.quantity).toLocaleString()}원
                    </span>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => deleteItem(item.bookId)}
                    >
                      <X size={14} color="#EF4444" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className={styles.rightCol}>
          <div className={styles.summaryCard}>
            <span className={styles.summaryTitle}>주문 요약</span>
            <div className={styles.summaryDivider} />
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>
                선택 상품 ({checkedItems.length}건)
              </span>
              <span className={styles.summaryValue}>
                {originalTotal.toLocaleString()}원
              </span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>할인금액</span>
              <span className={styles.discountValue}>
                -{discount.toLocaleString()}원
              </span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>배송비</span>
              <span className={styles.freeDelivery}>무료</span>
            </div>
            <div className={styles.summaryDivider} />
            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>총 결제금액</span>
              <span className={styles.totalValue}>
                {salesTotal.toLocaleString()}원
              </span>
            </div>
          </div>

          <button className={styles.orderBtn} onClick={handleOrder}>
            주문하기
          </button>

          <div className={styles.infoCard}>
            <span className={styles.infoTitle}>안내사항</span>
            <p className={styles.infoText}>• 장바구니 상품은 최대 30일간 보관됩니다.</p>
            <p className={styles.infoText}>• 가격, 옵션 등 정보가 변경될 수 있습니다.</p>
          </div>
        </div>
      </div>
    </div>
  )
}