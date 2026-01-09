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
        <div className='flex-1'>
          <ResolveMessage/>
        </div>
        <div className='flex-2'>
          <MessagePart/>
        </div>
        <div className='flex-1'>
          <CustomerInfo/>
        </div>
      </div>
    </div>
  )
}
