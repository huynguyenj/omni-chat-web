import Button from '@/components/ui/button/Button'
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
        <ListClaimSection/>
      </div>
    </div>
  )
}
