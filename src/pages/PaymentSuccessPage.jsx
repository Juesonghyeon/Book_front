import { useSearchParams, useNavigate } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'

export default function PaymentSuccessPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const orderId = params.get('orderId')
  const isVirtualAccount = params.get('virtualAccount') === 'true'

  return (
    <div className="min-h-screen bg-[#F5F5F8] flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-sm p-10 w-full max-w-md text-center flex flex-col items-center gap-6">
        <CheckCircle size={64} color="#2563EB" strokeWidth={1.5} />

        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-gray-900">
            {isVirtualAccount ? '가상계좌 발급 완료' : '결제가 완료되었습니다'}
          </h1>
          {isVirtualAccount ? (
            <p className="text-sm text-gray-500 leading-relaxed">
              가상계좌가 발급되었습니다.<br />
              입금 기한 내에 해당 계좌로 입금해 주세요.<br />
              입금 확인 후 주문이 처리됩니다.
            </p>
          ) : (
            <p className="text-sm text-gray-500">
              주문이 정상적으로 접수되었습니다.
            </p>
          )}
          {orderId && (
            <p className="text-xs text-gray-400 mt-1">주문번호: {orderId}</p>
          )}
        </div>

        <div className="flex flex-col gap-3 w-full mt-2">
          <button
            className="w-full h-12 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold rounded-xl transition-colors"
            onClick={() => navigate('/')}
          >
            쇼핑 계속하기
          </button>
          <button
            className="w-full h-12 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            onClick={() => navigate('/')}
          >
            메인화면으로
          </button>
        </div>
      </div>
    </div>
  )
}