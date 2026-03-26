import { useContext, useMemo } from 'react'
import SelectionMessageContext from '../../context/SelectionMessageProvider'
import useGetResolveMessage from '../../hooks/useGetResolveMessage'
import { useAuthStore } from '@/features/auth/store/auth-store'
import AwaitMessageBox from '../ui/AwaitMessageBox'
import { getTimeHelper } from '../../utils/time-helper'

export default function ResolveMessage() {
  const context = useContext(SelectionMessageContext)
  const staffId = useAuthStore((state) => state.staffId)
  const { resolveMessageTab } = useGetResolveMessage(staffId)
  const platform = useMemo(() => {
    if (!context?.providerName) return 'Không xác định'
    if (context.providerName === 'Facebook') return 'messenger'
    else if (context.providerName === 'Zalo') return 'zalo'
    else return 'Không xác định'
  }, [context?.providerName])
  return (
    <div>
      <div className='border-b border-gray-200 py-4 px-5'>
        <p className='text-sm-body-desktop text-primary'>Tin nhắn được phân công</p>
        <p className='text-[0.95rem]'>{resolveMessageTab.length} cuộc hội thoại</p>
      </div>
      {resolveMessageTab ?
        resolveMessageTab.map((data) => (
          <div key={data.conversationId} className={`${context?.conversationId === data.conversationId && 'border-l-6 border-secondary bg-[#ebf3fb]'} hover:bg-[#F9FAFB] cursor-pointer`} onClick={() => context?.handleChoose(data.conversationId)}>
            <AwaitMessageBox
              customerName={data.customerName}
              message={data.lastMessage}
              time={getTimeHelper(data.updateDate)}
              platform={platform}
              totalAwaitMessage={data.unreadMessageCount}
            />
          </div>
        ))
        :
        <p className='text-sm-body-desktop'>Chưa có tin nhắn cần được xử lí</p>
      }
    </div>
  )
}

