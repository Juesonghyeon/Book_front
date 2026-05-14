import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { MapPin, Minus, Plus, X } from 'lucide-react'
import { getOrderBooks } from '../services/orderService'
import { createOrder, completePayment } from '../services/paymentService'
import { requestPortOnePayment } from '../utils/portone'
import useAuthStore from '../stores/authStore'
import styles from './OrderPage.module.css'

const DAUM_POSTCODE_URL = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'

export default function OrderPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const books = location.state?.books ?? []
  const ownedPoints = useAuthStore((state) => state.point ?? 0)

  const [orderItems, setOrderItems] = useState(
    () => books.map((b) => ({ bookId: b.bookId, quantity: b.quantity }))
  )
  const [bookInfoList, setBookInfoList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [recipient, setRecipient] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [zipcode, setZipcode] = useState('')
  const [address, setAddress] = useState('')
  const [detailAddress, setDetailAddress] = useState('')
  const [pointsToUse, setPointsToUse] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [serverTotal, setServerTotal] = useState(null)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = DAUM_POSTCODE_URL
    script.async = true
    document.head.appendChild(script)
    return () => {
      if (document.head.contains(script)) document.head.removeChild(script)
    }
  }, [])

  useEffect(() => {
    if (books.length === 0) {
      navigate('/', { replace: true })
      return
    }
    const bookIds = books.map((b) => b.bookId)
    setLoading(true)
    getOrderBooks(bookIds)
      .then((res) => setBookInfoList(res.data ?? []))
      .catch(() => setError('도서 정보를 불러오는데 실패했습니다.'))
      .finally(() => setLoading(false))
  }, [])

  const handleAddressSearch = () => {
    if (!window.daum?.Postcode) return
    new window.daum.Postcode({
      oncomplete: (data) => {
        setZipcode(data.zonecode || '')
        setAddress(data.roadAddress || data.jibunAddress)
        setDetailAddress('')
      },
    }).open()
  }

  const handlePay = async () => {
    if (!recipient.trim()) return alert('수령인을 입력하세요.')
    if (!phone.trim()) return alert('연락처를 입력하세요.')
    if (!email.trim()) return alert('이메일을 입력하세요.')
    if (!zipcode || !address) return alert('주소를 검색해 입력하세요.')
    if (!detailAddress.trim()) return alert('상세 주소를 입력하세요.')
    if (isProcessing) return
    setIsProcessing(true)
    try {
      const orderRes = await createOrder({
        receiver: recipient,
        phone,
        shippingAddress: `[${zipcode}] ${address}`,
        shippingDetailAddress: detailAddress,
        usedPoints: effectivePoints,
        items: visibleBookInfoList.map((info) => ({
          bookId: info.bookId,
          quantity: orderItems.find((o) => o.bookId === info.bookId)?.quantity ?? 1,
          priceAtPurchase: info.salePrice ?? info.originalPrice,
        })),
      })
      const { orderId, totalAmount, orderName } = orderRes.data ?? orderRes
      setServerTotal(totalAmount)

      const payResult = await requestPortOnePayment({
        orderId, orderName, totalAmount,
        payMethod: 'CARD',
        customer: { fullName: recipient, phoneNumber: phone, email },
      })
      if (!payResult.success) {
        navigate(`/payment/fail?orderId=${orderId}&message=${encodeURIComponent(payResult.message ?? '결제가 취소되었습니다.')}`)
        return
      }

      const completeRes = await completePayment({ paymentId: payResult.paymentId, orderId })
      const { status, message } = completeRes.data ?? completeRes
      if (status === 'PAID') {
        navigate(`/payment/success?orderId=${orderId}`)
      } else if (status === 'VIRTUAL_ACCOUNT_ISSUED') {
        navigate(`/payment/success?orderId=${orderId}&virtualAccount=true`)
      } else {
        navigate(`/payment/fail?orderId=${orderId}&message=${encodeURIComponent(message ?? '결제에 실패했습니다.')}`)
      }
    } catch (e) {
      console.error(e)
      alert(e?.response?.data?.message ?? '결제 처리 중 오류가 발생했습니다.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleQuantityChange = (bookId, delta) => {
    setOrderItems((prev) =>
      prev.map((item) =>
        item.bookId === bookId
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    )
  }

  const handleRemoveItem = (bookId) => {
    if (orderItems.length <= 1) return
    setOrderItems((prev) => prev.filter((item) => item.bookId !== bookId))
    setPointsToUse(0)
  }

  const visibleBookInfoList = bookInfoList.filter((info) =>
    orderItems.some((item) => item.bookId === info.bookId)
  )

  const totalOriginal = visibleBookInfoList.reduce((sum, info) => {
    const qty = orderItems.find((b) => b.bookId === info.bookId)?.quantity ?? 0
    return sum + info.originalPrice * qty
  }, 0)

  const totalSale = visibleBookInfoList.reduce((sum, info) => {
    const qty = orderItems.find((b) => b.bookId === info.bookId)?.quantity ?? 0
    return sum + info.salePrice * qty
  }, 0)

  const discountAmount = totalOriginal - totalSale
  const effectivePoints = Math.min(pointsToUse, Math.min(ownedPoints, totalSale))
  const finalPayment = Math.max(0, totalSale - effectivePoints)

  const handlePointsChange = (e) => {
    const val = parseInt(e.target.value, 10) || 0
    setPointsToUse(Math.max(0, val))
  }

  const handleAddPoints = (amount) => {
    setPointsToUse((prev) => prev + amount)
  }

  const isPointsOverOwned = pointsToUse > ownedPoints
  const isPointsOverSale = pointsToUse > totalSale

  if (loading) return <div className={styles.loading}>로딩 중...</div>
  if (error) return <div className={styles.error}>{error}</div>

  return (
    <div className={styles.page}>

      {/* 스텝 인디케이터 */}
      <div className={styles.stepBar}>
        <div className={styles.stepItem}>
          <span className={`${styles.stepCircle} ${styles.stepDone}`}>✓</span>
          <span className={`${styles.stepLabel} ${styles.stepLabelDone}`}>장바구니</span>
        </div>
        <div className={styles.stepLine} />
        <div className={styles.stepItem}>
          <span className={`${styles.stepCircle} ${styles.stepActive}`}>2</span>
          <span className={`${styles.stepLabel} ${styles.stepLabelActive}`}>주문/결제</span>
        </div>
        <div className={styles.stepLine} />
        <div className={styles.stepItem}>
          <span className={`${styles.stepCircle} ${styles.stepPending}`}>3</span>
          <span className={`${styles.stepLabel} ${styles.stepLabelPending}`}>주문완료</span>
        </div>
      </div>

      {/* 2컬럼 본문 */}
      <div className={styles.body}>

        {/* Left Column */}
        <div className={styles.leftCol}>

          {/* 배송지 정보 */}
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>배송지 정보</h2>
            <div className={styles.fieldGroup}>
              <div className={styles.field}>
                <label className={styles.label}>수령인</label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="이름을 입력하세요"
                  className={styles.input}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>연락처</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="연락처를 입력하세요"
                  className={styles.input}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>이메일</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="이메일을 입력하세요"
                  className={styles.input}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>주소</label>
                <div className={styles.addressRow}>
                  <input
                    type="text"
                    value={address}
                    readOnly
                    placeholder="주소 찾기를 클릭하세요"
                    className={`${styles.input} ${styles.addressInput}`}
                  />
                  <button type="button" className={styles.addressBtn} onClick={handleAddressSearch}>
                    <MapPin size={14} />
                    검색
                  </button>
                </div>
                <input
                  type="text"
                  value={detailAddress}
                  onChange={(e) => setDetailAddress(e.target.value)}
                  placeholder="상세 주소를 입력하세요"
                  className={styles.input}
                />
              </div>
            </div>
          </section>

          {/* 주문 상품 */}
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>주문 상품</h2>
            <div className={styles.bookList}>
              {visibleBookInfoList.map((info) => {
                const qty = orderItems.find((o) => o.bookId === info.bookId)?.quantity ?? 1
                const canDelete = orderItems.length > 1
                return (
                  <div key={info.bookId} className={styles.bookItem}>
                    <img src={info.imageUrl} alt={info.title} className={styles.bookImg} />
                    <div className={styles.bookInfo}>
                      <div className={styles.bookHeader}>
                        <p className={styles.bookTitle}>{info.title}</p>
                        <button
                          type="button"
                          className={styles.removeBtn}
                          onClick={() => handleRemoveItem(info.bookId)}
                          disabled={!canDelete}
                          title={!canDelete ? '최소 1개 이상의 상품이 필요합니다' : '상품 삭제'}
                        >
                          <X size={14} />
                        </button>
                      </div>
                      <div className={styles.bookPriceRow}>
                        <span className={styles.originalPrice}>
                          {info.originalPrice.toLocaleString()}원
                        </span>
                        <span className={styles.salePrice}>
                          {info.salePrice.toLocaleString()}원
                        </span>
                      </div>
                      <div className={styles.qtyControl}>
                        <button
                          type="button"
                          className={styles.qtyBtn}
                          onClick={() => handleQuantityChange(info.bookId, -1)}
                          disabled={qty <= 1}
                        >
                          <Minus size={12} />
                        </button>
                        <span className={styles.qtyValue}>{qty}</span>
                        <button
                          type="button"
                          className={styles.qtyBtn}
                          onClick={() => handleQuantityChange(info.bookId, 1)}
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className={styles.rightCol}>

          {/* 포인트 사용 */}
          <section className={styles.card}>
            <div className={styles.pointsHeader}>
              <h2 className={styles.cardTitle}>포인트 사용</h2>
              <span className={styles.ownedPoints}>
                보유 <strong>{ownedPoints.toLocaleString()}</strong> P
              </span>
            </div>

            {/* 빠른 입력 버튼 */}
            <div className={styles.pointsQuickBtns}>
              {[1000, 5000, 10000].map((amount) => (
                <button
                  key={amount}
                  type="button"
                  className={styles.pointsQuickBtn}
                  onClick={() => handleAddPoints(amount)}
                >
                  +{amount.toLocaleString()}P
                </button>
              ))}
            </div>

            {/* 포인트 입력 */}
            <div className={styles.pointsRow}>
              <input
                type="number"
                min={0}
                value={pointsToUse}
                onChange={handlePointsChange}
                placeholder="사용할 포인트를 입력하세요"
                className={`${styles.pointsInput} ${isPointsOverOwned || isPointsOverSale ? styles.pointsInputError : ''}`}
              />
              <button
                type="button"
                className={styles.pointsAllBtn}
                onClick={() => setPointsToUse(Math.min(ownedPoints, totalSale))}
              >
                전액사용
              </button>
            </div>

            {/* 경고 메시지 */}
            {isPointsOverOwned && (
              <p className={styles.pointsWarning}>
                보유 포인트({ownedPoints.toLocaleString()}P)를 초과했습니다.
              </p>
            )}
            {!isPointsOverOwned && isPointsOverSale && (
              <p className={styles.pointsWarning}>
                결제금액({totalSale.toLocaleString()}원)을 초과했습니다.
              </p>
            )}
          </section>

          {/* 주문 요약 */}
          <div className={styles.summaryCard}>
            <h2 className={styles.summaryTitle}>주문 요약</h2>
            <div className={styles.priceList}>
              <div className={styles.priceRow}>
                <span className={styles.priceLabel}>상품금액</span>
                <span className={styles.priceValue}>{totalOriginal.toLocaleString()}원</span>
              </div>
              <div className={styles.priceRow}>
                <span className={styles.priceLabel}>배송비</span>
                <span className={`${styles.priceValue} ${styles.freeShipping}`}>무료</span>
              </div>
              <div className={styles.priceRow}>
                <span className={styles.priceLabel}>할인금액</span>
                <span className={`${styles.priceValue} ${styles.discountValue}`}>
                  -{discountAmount.toLocaleString()}원
                </span>
              </div>
              <div className={styles.priceRow}>
                <span className={styles.priceLabel}>포인트 사용</span>
                <span className={`${styles.priceValue} ${styles.discountValue}`}>
                  -{effectivePoints.toLocaleString()}원
                </span>
              </div>
            </div>
            <hr className={styles.divider} />
            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>최종결제금액</span>
              <span className={styles.totalValue}>
                {(serverTotal ?? finalPayment).toLocaleString()}원
              </span>
            </div>
          </div>

          {/* 결제하기 버튼 */}
          <button
            type="button"
            className={styles.payBtn}
            onClick={handlePay}
            disabled={isProcessing}
          >
            {isProcessing ? '결제 진행 중...' : '결제하기'}
          </button>
        </div>
      </div>
    </div>
  )
}