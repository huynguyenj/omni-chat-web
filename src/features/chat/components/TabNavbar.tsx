import { useState } from 'react'
import { navbarItems } from '../const/chat-navbar-item'

export default function TabNavbar() {
  const [tabChoice, setTabChoice] = useState(navbarItems[0].name.toLocaleLowerCase())
  const handleChoose = (selected: string) => {
    setTabChoice(selected)
  }
  return (
    <div className="flex gap-5 py-3 px-5 border-b border-gray-200 w-full">
      {navbarItems.map((item) => (
        <div key={item.name} className={`flex items-center gap-2 ${tabChoice === item.name.toLocaleLowerCase() ? 'bg-secondary text-white' : 'bg-white text-black'} px-3 py-2 rounded-[10px] cursor-pointer`} onClick={() => handleChoose(item.name.toLocaleLowerCase())}>
          <item.icon className="text-[1.25rem]"/>
          <p className="font-bold">{item.name}</p>
        </div>
      ))}
    </div>
  )
}
