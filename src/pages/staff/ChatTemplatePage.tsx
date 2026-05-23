import Button from '@/components/ui/button/Button'
import ChatTemplateTab from '@/features/manager/components/tabs/ChatTemplateTab'
import { PRIVATE_PATH } from '@/router/path'
import { FaArrowLeft } from 'react-icons/fa6'
import { useNavigate } from 'react-router'

export default function ChatTemplatePage() {
  const navigate = useNavigate()
  return (
    <div className='relative w-full min-h-screen max-h-[120vh] flex  justify-center py-10 bg-[#F5F7FA] overflow-x-hidden'>
      <div className='w-[70%]'>
        <Button className='bg-transparent text-sm-body-desktop items-center gap-3 hover:bg-white' onClick={() => navigate(PRIVATE_PATH.CHAT)}>
          <FaArrowLeft/>
                   Quay lại trang chat
        </Button>
        <div className="flex justify-between items-center mt-5">
          <ChatTemplateTab/>
        </div>
      </div>
    </div>
  )
}
