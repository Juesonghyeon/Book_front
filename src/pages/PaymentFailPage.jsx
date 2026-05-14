import { useSearchParams, useNavigate } from 'react-router-dom'
import { XCircle } from 'lucide-react'

export default function PaymentFailPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const orderId = params.get('orderId')
  const message = params.get('message') ?? '결제에 실패했습니다.'

  return (
    <div className="min-h-screen bg-[#F5F5F8] flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-sm p-10 w-full max-w-md text-center flex flex-col items-center gap-6">
        <XCircle size={64} color="#EF4444" strokeWidth={1.5} />

        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-gray-900">결제에 실패했습니다</h1>
          <p className="text-sm text-gray-500">{message}</p>
          {orderId && (
            <p className="text-xs text-gray-400 mt-1">주문번호: {orderId}</p>
          )}
        </div>

        <div className="flex flex-col gap-3 w-full mt-2">
          <button
            className="w-full h-12 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold rounded-xl transition-colors"
            onClick={() => navigate(-1)}
          >
            다시 시도하기
          </button>
          <button
            className="w-full h-12 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            onClick={() => navigate('/')}
          >
            홈으로
          </button>
        </div>
      </div>
    </div>
  )
}