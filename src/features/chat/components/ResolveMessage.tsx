import { useContext, useEffect } from 'react'
import AwaitMessageBox from './ui/AwaitMessageBox'
import SelectionMessageContext from '../context/SelectionMessageProvider'
import useGetResolveMessage from '../hooks/useGetResolveMessage'
import { getTimeHelper } from '../utils/time-helper'


export default function ResolveMessage() {
  const context = useContext(SelectionMessageContext)
  const { resolveMessageTab } = useGetResolveMessage('62cd54f0-d460-47c6-b4e4-1214328ba10d')
  useEffect(() => {

  }, [])
  return (
    <div>
      <div className='border-b border-gray-200 py-4 px-5'>
        <p className='text-sm-body-desktop text-primary'>Tin nhắn được phân công</p>
        <p className='text-[0.95rem]'>3 cuộc hội thoại</p>
      </div>
      {resolveMessageTab?.map((data) => (
        <div key={data.conversationId} className={`${context?.conversationId === data.conversationId && 'border-l-6 border-secondary bg-[#ebf3fb]'} hover:bg-[#F9FAFB] cursor-pointer`} onClick={() => context?.handleChoose(data.conversationId)}>
          <AwaitMessageBox customerName={data.customerName} message={data.lastMessage} time={getTimeHelper(data.updateDate)} platform='messenger'/>
        </div>
      ))}
    </div>
  )
}
