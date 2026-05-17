import ChatNavbar from '@/features/chat/components/navigation/ChatNavbar'
import MessageSection from '@/features/chat/components/message/MessageSection'
import ResolveMessage from '@/features/chat/components/message/ResolveMessage'
import { SelectionMessageProvider } from '@/features/chat/context/SelectionMessageProvider'
import { ChatLayoutFuncProvider } from '@/features/chat/context/ChatLayoutFuncProvider'

export default function ChatPage() {
  return (
    <div className='overflow-x-hidden'>
      <SelectionMessageProvider>
        <ChatLayoutFuncProvider>
          <ChatNavbar/>
          <div className='flex h-[calc(100vh-8.75rem)]'>
            <ResolveMessage/>
            <MessageSection/>
          </div>
        </ChatLayoutFuncProvider>
      </SelectionMessageProvider>
    </div>
  )
}
