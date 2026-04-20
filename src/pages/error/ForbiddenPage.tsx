import Button from '@/components/ui/button/Button'
import { useAuthStore } from '@/features/auth/store/auth-store'
import { ROLE_HOME } from '@/router/const/role-route'
import { PUBLIC_PATH } from '@/router/path'
import { AlertTriangle, ArrowLeft } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router'

export default function ForbiddenPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const { role } = useAuthStore()
  const from = params.get('from')
  console.log(from)
  const handleNavigate = () => {
    if (from) {
      navigate(from)
      return
    }
    if (!role) {
      navigate(PUBLIC_PATH.LOGIN)
      return
    }
    const fallBackRoute = ROLE_HOME[role]
    console.log(fallBackRoute);
    
    navigate(fallBackRoute)
  }
  return (
    <div className="text-sm-body-desktop min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center border border-red-100">

        <div className="flex justify-center mb-4">
          <div className="bg-red-100 p-4 rounded-full">
            <AlertTriangle className="text-red-600 w-10 h-10" />
          </div>
        </div>

        <h1 className="text-xl-body-desktop font-bold text-red-600 mb-2">
          Không có quyền truy cập
        </h1>

        <p className="text-soft-gray 0 mb-6">
          Bạn không có quyền truy cập vào trang này.
          Vui lòng kiểm tra lại quyền hoặc liên hệ quản trị viên nếu cần thiết.
        </p>

        <Button
          onClick={handleNavigate}
          className="flex items-center justify-center gap-2 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại trang trước
        </Button>
      </div>
    </div>
  )
}