import { formatTime } from '@/utils/date-resolver'
import type { Recommendation } from '../../types/system-recommendation-type'
import SystemRecommendation from '../message/SystemRecommendation'

type ChatMessageBoxType = {
  message: string
  time: number
  sender: string
  recommends?: Recommendation[]
  highlightWords?: string[]
  index?: boolean
}

export default function ChatMessageBox({ message, time, sender, index }: ChatMessageBoxType) {
  return (
    <div className='flex flex-col'>
      { sender === 'customer' && index &&
        <SystemRecommendation/>
      }
      <div className={`px-5 py-2 ${sender !== 'customer' ? 'bg-secondary' : 'bg-white'} w-fit rounded-[10px] border border-gray-300`}>
        <p className={`text-sm-body-desktop ${sender !== 'customer' && 'text-white'}`}>{message}</p>
        <p className={`text-[0.85rem] ${sender !== 'customer' ? 'text-gray-300' :'text-soft-gray'}`}>{formatTime(time)}</p>
      </div>
    </div>
  )
}
