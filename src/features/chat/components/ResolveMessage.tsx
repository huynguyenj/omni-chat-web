import { useContext } from 'react'
import AwaitMessageBox from './ui/AwaitMessageBox'
import SelectionMessageContext from '../context/SelectionMessageProvider'

type DataMessageType = {
  customer: string
  message: string
  avatar?: string
  time: string
  conversationId: string
}

const dataMessage: DataMessageType[] = [
  { customer: 'Nguyen Van A', message: 'Cho minh hoi san pham Y', time: '3:30', conversationId: '1' },
  { customer: 'Nguyen Thi A', message: 'Cho minh hoi san pham X', time: '4:30', conversationId: '2' },
  { customer: 'Nguyen A', message: 'Cho minh hoi san pham Z', time: '5:30', conversationId: '3' }
]

export default function ResolveMessage() {
  const context = useContext(SelectionMessageContext)
  return (
    <div>
      <div className='border-b border-gray-200 py-4 px-5'>
        <p className='text-sm-body-desktop text-primary'>Tin nhắn được phân công</p>
        <p className='text-[0.95rem]'>3 cuộc hội thoại</p>
      </div>
      {dataMessage.map((data) => (
        <div key={data.conversationId} className={`${context?.conversationId === data.conversationId && 'border-l-6 border-secondary bg-[#ebf3fb]'} hover:bg-[#F9FAFB] cursor-pointer`} onClick={() => context?.handleChoose(data.conversationId)}>
          <AwaitMessageBox customerName={data.customer} message={data.message} time={data.time} platform='messenger'/>
        </div>
      ))}
    </div>
  )
}
