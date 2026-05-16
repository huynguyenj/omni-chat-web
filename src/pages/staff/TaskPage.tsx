import Button from '@/components/ui/button/Button'
import { useAuthStore } from '@/features/auth/store/auth-store'
import AnalysisTaskSection from '@/features/tasks/components/AnalysisTaskSection'
import ListTasksSection from '@/features/tasks/components/ListTasksSection'
import { PRIVATE_PATH } from '@/router/path'
import { FaArrowLeft } from 'react-icons/fa6'
import { useNavigate } from 'react-router'

export default function TaskPage() {
  const staffInfo = useAuthStore((state) => state)
  const navigate = useNavigate()
  return (
    <div className="flex flex-col items-start gap-3 bg-[#F5F7FA] min-h-screen max-h-[140vh] sm:px-30 py-10">
      <Button className='bg-transparent text-sm-body-desktop items-center gap-3 hover:bg-white' onClick={() => navigate(PRIVATE_PATH.CHAT)}>
        <FaArrowLeft/>
         Quay lại trang chat
      </Button>
      <div className="flex justify-between">
        <div>
          <p className="text-m-title-desktop text-primary font-bold">Lịch sử công việc</p>
          <p className="text-m-body-desktop">Danh sách tasks đã hoàn thành của {staffInfo.role}</p>
        </div>
      </div>
      <div className='w-full'>
        <AnalysisTaskSection/>
      </div>
      <ListTasksSection/>
    </div>
  )
}
