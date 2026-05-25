import { useContext, useEffect, useState } from 'react'
import { messageItem } from '../../const/chat-navbar-item'
import SelectionMessageContext from '../../context/SelectionMessageProvider'
import Button from '@/components/ui/button/Button'
import { GiHamburgerMenu } from 'react-icons/gi'
import { BsListTask } from 'react-icons/bs'
import { CgDanger } from 'react-icons/cg'
import { AnimatePresence, motion } from 'motion/react'
import { useNavigate } from 'react-router'
import { PRIVATE_PATH } from '@/router/path'
import { IoChatbubblesOutline } from 'react-icons/io5'

export default function ChatNavbar() {
  const [tabChoice, setTabChoice] = useState(messageItem[0].name)
  const [isOpen, setIsOpen] = useState(false)
  const context = useContext(SelectionMessageContext)
  const navigate = useNavigate()
  useEffect(() => {
    context?.handleChooseProviderName(tabChoice)
  }, [tabChoice])
  const handleChoose = (selected: string) => {
    setTabChoice(selected)
  }
  const handleOpen = () => {
    setIsOpen((prev) => !prev)
  }
  return (
    <div className="flex justify-between items-center h-15 gap-5 py-2 px-5 border-b border-gray-200 w-full">
      <div className='flex gap-2'>
        {messageItem.map((item) => (
          <div key={item.name} className={`flex items-center gap-2 ${tabChoice === item.name ? 'bg-secondary text-white' : 'bg-white text-black'} px-3 py-2 rounded-[10px] cursor-pointer`} onClick={() => handleChoose(item.name)}>
            <item.icon className="text-[1.25rem]"/>
            <p className="font-bold">{item.name}</p>
          </div>
        ))}
      </div>
      <div className='relative'>
        <Button variant='outline' className='py-3 hover:bg-blue-100' onClick={handleOpen}>
          <GiHamburgerMenu/>
        </Button>
        <AnimatePresence>
          { isOpen &&
            <motion.div
              initial={{ opacity: 0, y: -40, x: 10 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, y: -20, x: 10 }}
              className='absolute flex flex-col gap-1 min-w-62.5 w-fit right-0 mt-1 py-2 px-1 rounded-lg shadow-[0px_1px_6px_0px_rgba(0,0,0,0.2)] bg-white z-20'>
              <Button className='flex rounded-sm py-1 bg-white text-black w-full hover:bg-gray-200 justify-start font-normal' onClick={() => navigate(PRIVATE_PATH.TASK)}>
                <BsListTask className='text-green-accent text-[1.2rem]'/>
                Xem lịch sử tasks
              </Button>
              <Button className='flex rounded-sm py-1 bg-white text-black w-full hover:bg-gray-200 justify-start font-normal' onClick={() => navigate(PRIVATE_PATH.CLAIM)}>
                <CgDanger className='text-[#FB2C36] text-[1.2rem]'/>
                Tạo đơn
              </Button>
              <Button className='flex rounded-sm py-1 bg-white text-black w-full hover:bg-gray-200 justify-start font-normal' onClick={() => navigate(PRIVATE_PATH.CHAT_TEMPLATE)}>
                <IoChatbubblesOutline className='text-secondary text-[1.2rem]'/>
                Mẫu chat
              </Button>
            </motion.div>
          }
        </AnimatePresence>
      </div>
    </div>
  )
}
