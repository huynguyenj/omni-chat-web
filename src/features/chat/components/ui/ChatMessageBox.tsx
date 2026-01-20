type ChatMessageBoxType = {
  message: string
  time: string
  sender: boolean
}

export default function ChatMessageBox({ message, time, sender }: ChatMessageBoxType) {
  return (
    <div className={`px-5 py-3 ${sender ? 'bg-secondary' : 'bg-white'} w-fit rounded-[10px] border border-gray-300`}>
      <p className={`text-sm-body-desktop ${sender && 'text-white'}`}>{message}</p>
      <p className={`text-[0.85rem] ${sender ? 'text-gray-300' :'text-gray-500'}`}>{time}</p>
    </div>
  )
}
