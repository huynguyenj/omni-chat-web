import ChatNavbar from '@/features/chat/components/ChatNavbar'
import MessageSection from '@/features/chat/components/MessageSection'
import ResolveMessage from '@/features/chat/components/ResolveMessage'
import { SelectionMessageProvider } from '@/features/chat/context/SelectionMessageProvider'

export default function ChatPage() {
  return (
    <div>
      <SelectionMessageProvider>
        <ChatNavbar/>
        <div className='flex h-[73vh]'>
          <div className='flex-1 border-r border-gray-200 h-full'>
            <ResolveMessage/>
          </div>
          <div className='flex-3 border-r border-gray-200 h-full'>
            <MessageSection/>
          </div>
        </div>
      </SelectionMessageProvider>
    </div>
  )
}
