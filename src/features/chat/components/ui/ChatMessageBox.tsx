import { getTimeHelper } from '../../utils/time-helper'

type ChatMessageBoxType = {
  message: string
  time: number
  sender: string
}

export default function ChatMessageBox({ message, time, sender }: ChatMessageBoxType) {
  return (
    <div className={`px-5 py-3 ${sender !== 'customer' ? 'bg-secondary' : 'bg-white'} w-fit rounded-[10px] border border-gray-300`}>
      <p className={`text-sm-body-desktop ${sender !== 'customer' && 'text-white'}`}>{message}</p>
      <p className={`text-[0.85rem] ${sender ? 'text-gray-300' :'text-gray-500'}`}>{getTimeHelper(time)}</p>
    </div>
  )
}
