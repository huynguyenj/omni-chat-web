import Button from '@/components/ui/button/Button'
import ClaimInfoSection from '@/features/claim/components/ClaimInfoSection'
import ListClaimSection from '@/features/claim/components/ListClaimSection'
import { PRIVATE_PATH } from '@/router/path'
import { FaArrowLeft } from 'react-icons/fa6'
import { useNavigate } from 'react-router'

export default function ClaimPage() {
  const navigate = useNavigate()
  return (
    <div className='relative w-full min-h-screen max-h-[120vh] flex  justify-center py-10 bg-[#F5F7FA] overflow-x-hidden'>
      <div className='w-[70%]'>
        <Button className='bg-transparent text-sm-body-desktop items-center gap-3 hover:bg-white' onClick={() => navigate(PRIVATE_PATH.CHAT)}>
          <FaArrowLeft/>
                Quay lại trang chat
        </Button>
        <div className="flex justify-between">
          <div>
            <p className="text-m-title-desktop text-primary font-bold">Quản lí Claim</p>
            <p className="text-m-body-desktop">Tạo và theo dõi các yêu câu nghỉ phép của bạn</p>
          </div>
          <ClaimInfoSection/>
        </div>
        <ListClaimSection/>
      </div>
    </div>
  )
}
