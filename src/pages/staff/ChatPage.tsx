import ChatNavbar from '@/features/chat/components/navigation/ChatNavbar'
import MessageSection from '@/features/chat/components/message/MessageSection'
import ResolveMessage from '@/features/chat/components/message/ResolveMessage'
import { SelectionMessageProvider } from '@/features/chat/context/SelectionMessageProvider'

export default function ChatPage() {
  return (
    <div className='overflow-x-hidden'>
      <SelectionMessageProvider>
        <ChatNavbar/>
        <div className='flex h-[calc(100vh-8.75rem)]'>
          <div className='flex-1 border-r border-gray-200 h-full'>
            <ResolveMessage/>
          </div>
          <div className='flex-4 border-r border-gray-200 h-full'>
            <MessageSection/>
          </div>
        </div>
      </SelectionMessageProvider>
    </div>
  )
}
