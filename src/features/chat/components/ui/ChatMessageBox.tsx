import type { Recommendation } from '../../types/system-recommendation-type'
import { getTimeHelper } from '../../utils/time-helper'
import SystemRecommendation from '../SystemRecommendation'

type ChatMessageBoxType = {
  message: string
  time: number
  sender: string
  recommends?: Recommendation[]
  highlightWords?: string[]
}

export default function ChatMessageBox({ message, time, sender, recommends }: ChatMessageBoxType) {
  return (
    <div className='flex flex-col'>
      { sender === 'customer' }
      <SystemRecommendation recommends={recommends}/>
      <div className={`px-5 py-2 ${sender !== 'customer' ? 'bg-secondary' : 'bg-white'} w-fit rounded-[10px] border border-gray-300`}>
        <p className={`text-sm-body-desktop ${sender !== 'customer' && 'text-white'}`}>{message}</p>
        <p className={`text-[0.85rem] ${sender ? 'text-gray-300' :'text-gray-500'}`}>{getTimeHelper(time)}</p>
      </div>
    </div>
  )
}
