import { useContext, useEffect, useState } from 'react'
import { messageItem } from '../const/chat-navbar-item'
import SelectionMessageContext from '../context/SelectionMessageProvider'

export default function ChatNavbar() {
  const [tabChoice, setTabChoice] = useState(messageItem[0].name)
  const context = useContext(SelectionMessageContext)
  useEffect(() => {
    context?.handleChooseProviderName(tabChoice)
  }, [tabChoice])
  const handleChoose = (selected: string) => {
    setTabChoice(selected)
  }
  return (
    <div className="flex h-15 gap-5 py-2 px-5 border-b border-gray-200 w-full">
      {messageItem.map((item) => (
        <div key={item.name} className={`flex items-center gap-2 ${tabChoice === item.name ? 'bg-secondary text-white' : 'bg-white text-black'} px-3 py-2 rounded-[10px] cursor-pointer`} onClick={() => handleChoose(item.name)}>
          <item.icon className="text-[1.25rem]"/>
          <p className="font-bold">{item.name}</p>
        </div>
      ))}
    </div>
  )
}
