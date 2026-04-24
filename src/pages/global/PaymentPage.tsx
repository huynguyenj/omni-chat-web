import { useSearchParams } from 'react-router'
import { CheckCircle, XCircle } from 'lucide-react'

export default function PaymentPage() {
  const [searchParam] = useSearchParams()

  const status = searchParam.get('status')

  const isSuccess = status === 'success'

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center">

        <div className="flex justify-center mb-5">
          <div
            className={`p-4 rounded-full ${
              isSuccess ? 'bg-green-100' : 'bg-red-100'
            }`}
          >
            {isSuccess ? (
              <CheckCircle className="text-green-600 w-12 h-12" />
            ) : (
              <XCircle className="text-red-600 w-12 h-12" />
            )}
          </div>
        </div>

        <h1
          className={`text-sm-title-desktop font-bold mb-2 ${
            isSuccess ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {isSuccess ? 'Thanh toán thành công' : 'Thanh toán thất bại'}
        </h1>

        <p className="text-soft-gray mb-6 text-m-body-desktop">
          {isSuccess
            ? 'Cảm ơn bạn! Đơn hàng của bạn đã được thanh toán thành công.'
            : 'Thanh toán không thành công. Vui lòng thử lại hoặc liên hệ hỗ trợ.'}
        </p>
      </div>
    </div>
  )
}