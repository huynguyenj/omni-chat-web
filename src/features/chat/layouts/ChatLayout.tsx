import ChatNavbar from '../components/ChatNavbar'
import CustomerInfo from '../components/CustomerInfo'
import MessagePart from '../components/MessagePart'
import ResolveMessage from '../components/ResolveMessage'
import TabNavbar from '../components/TabNavbar'

export default function ChatLayout() {
  return (
    <div>
      <div>
        <TabNavbar/>
        <ChatNavbar/>
      </div>
      <div className='flex'>
        <div className='flex-1 border-r border-gray-200 h-full'>
          <ResolveMessage/>
        </div>
        <div className='flex-3 border-r border-gray-200 h-full'>
          <MessagePart/>
        </div>
        <div className='flex-1'>
          <CustomerInfo/>
        </div>
      </div>
    </div>
  )
}
