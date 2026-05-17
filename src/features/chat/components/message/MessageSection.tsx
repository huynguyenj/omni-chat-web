import { useEffect, useRef, useState } from 'react'
import Avatar from '@/assets/avatar-sample.jpg'
import ChatMessageBox from '../ui/ChatMessageBox'
import { FiSend } from 'react-icons/fi'
import type { MessageType, SenderMessage } from '../../types/message-type'
import { useAuthStore } from '@/features/auth/store/auth-store'
import CustomerInfo from '../customer/CustomerInfo'
import Button from '@/components/ui/button/Button'
import Input from '@/components/ui/input/Input'
import Logo from '@/assets/logo.jpg'
import { toast } from 'react-toastify'
import { TbLayoutSidebarRightExpandFilled } from 'react-icons/tb'
import { TbLayoutSidebarLeftExpandFilled } from 'react-icons/tb'
import { AnimatePresence, motion } from 'motion/react'
import useConnectChat from '../../hooks/useConnectChat'
import ChatContentSkeleton from '@/components/ui/skeleton/ChatContentSkeleton'
import type { KeywordsRecommendation } from '../../types/system-recommendation-type'
import { MdOutlineMoreHoriz } from 'react-icons/md'
import CreateOrderSection from '../order/CreateOrderSection'
import OrderHistorySection from '../order/OrderHistorySection'
import { SiGoogleforms } from 'react-icons/si'
import { CiLink } from 'react-icons/ci'
import { LIST_ACCEPTANCE_WORD } from '../../const/acceptance-word'
import Tag from '@/components/ui/tag/Tag'
import { ScrollArea, ScrollBar } from '@/components/ui/scrollbar/ScrollArea'
import AutoOrderButton from '../order/AutoOrderButton'
import useContextValid from '@/hooks/useContextValid'
import ChatLayoutFuncContext from '../../context/ChatLayoutFuncProvider'
import { IoIosArrowBack } from 'react-icons/io'

export default function MessageSection() {
  const { connectionRef, conversationDetail, messages, setMessages, context, loading } = useConnectChat()
  const chatLayoutContext = useContextValid(ChatLayoutFuncContext)
  const staffId = useAuthStore((state) => state.staffId)
  const inputRef = useRef<HTMLInputElement>(null)
  const messageEndRef = useRef<HTMLDivElement>(null)
  // const [isConnected, setIsConnected] = useState(false)
  const [isCustomerOpen, setIsCustomerOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const toggleBtnRef = useRef<HTMLButtonElement | null>(null)
  const [isSettingOpen, setIsSettingOpen] = useState(false)

  const handleSend = async () => {
    if (!inputRef.current) return
    const value = inputRef.current?.value
    const time = new Date().getTime()
    if (!staffId) return
    const connection = connectionRef.current
    if (connection === null) {
      toast.error('Lỗi kết nối hãy thử lại')
      return
    }
    if (value) {
      const newMessage: MessageType = {
        content: value,
        senderId: staffId,
        senderType: 'Staff',
        timestamp: time
      }
      inputRef.current.value = ''
      setMessages((prevMessage) => [...prevMessage, newMessage])
      try {
        const message: SenderMessage = {
          Content: value,
          StaffId: staffId,
          SupportConversationId: context?.conversationId
        }
        console.log(message)
        await connection.invoke('StaffSendMessage', context?.providerName, message)
      } catch (error) {
        console.log('Singlr connected fail', error)
      }
    }
  }
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // useEffect(() => {
  //   if (!isCustomerOpen) return

  //   const onPointerDown = (e: PointerEvent) => {
  //     const target = e.target as Node | null
  //     if (!target) return

  //     const clickedPanel = panelRef.current?.contains(target)
  //     const clickedButton = toggleBtnRef.current?.contains(target)

  //     if (!clickedPanel && !clickedButton) {
  //       setIsCustomerOpen(false)
  //     }
  //   }

  //   document.addEventListener('pointerdown', onPointerDown, true)
  //   return () => document.removeEventListener('pointerdown', onPointerDown, true)
  // }, [isCustomerOpen])

  const handleCustomerInfoOpen = () => {
    setIsCustomerOpen((prev) => !prev)
  }

  const checkedRecommendation = (
    extractKeywords: KeywordsRecommendation | null | undefined
  ) => {
    if (extractKeywords?.recommends?.length) {
      return extractKeywords.recommends
    }
    return []
  }

  const handleOpenSetting = () => {
    setIsSettingOpen(prevState => !prevState)
  }
  const handleLinkProductMessage = () => {
    if (inputRef.current) {
      inputRef.current.value = 'https://omni-chat-web.vercel.app/product'
    }
  }

  const handleLinkCustomerFormMessage = () => {
    if (inputRef.current) {
      inputRef.current.value = `https://omni-chat-web.vercel.app/customer/${conversationDetail?.activeCustomerId}`
    }
  }
  const checkScreenWidth = () => {
    if (chatLayoutContext.screenWidth >= 1000) return
    if (chatLayoutContext.isScreenChatOpen) return 'block'
    else return 'hidden'
  }
  return (
    <div className={`max-w-330 w-full xl:w-315 border-r border-gray-200 h-full ${checkScreenWidth()}`}>
      <div className='h-full flex overflow-x-hidden'>
        {context?.conversationId ?
          <>
            <div className='flex-2 w-[50%] border-r border-gray-200'>
              <div className='flex items-center justify-between gap-3 border-b border-gray-200 py-4 lg:px-10'>
                <div className='flex gap-2 items-center'>
                  { chatLayoutContext.screenWidth < 1000 &&
                  <Button className='bg-transparent text-black px-2 hover:bg-soft-gray' onClick={chatLayoutContext.handleOpenScreenChat}>
                    <IoIosArrowBack />
                  </Button>
                  }
                  <img src={conversationDetail?.avartarUrl ?? Avatar} alt="avatar" className='w-12 h-12 rounded-full'/>
                  <div>
                    <p className='text-sm-body-desktop'>{conversationDetail?.customerName}</p>
                    <p className='text-[0.95rem]'>Đang hoạt động</p>
                  </div>
                </div>
                <Button ref={toggleBtnRef} onClick={handleCustomerInfoOpen} className={`${isCustomerOpen ? 'bg-secondary text-white' : 'bg-white text-black'} hover:text-white`}>
                  {isCustomerOpen ?
                    <TbLayoutSidebarLeftExpandFilled className='size-5'/>
                    :
                    <TbLayoutSidebarRightExpandFilled className='size-5'/>
                  }
                </Button>
              </div>
              <div className='bg-[#F5F7FA] overflow-y-auto h-[65%] py-5 px-5'>
                { loading ?
                  <ChatContentSkeleton count={3}/>
                  :
                  <>
                    {messages.map((message, i) => (
                      <div key={message.timestamp} className={`mt-5 flex ${message.senderType !== 'Customer' && 'justify-end'}`}>
                        <ChatMessageBox
                          message={message.content}
                          sender={message.senderType.toLocaleLowerCase()}
                          time={message.timestamp}
                          highlightWords={message.extractKeywordResponses?.highlights}
                          recommends={checkedRecommendation(message.extractKeywordResponses)}
                          index={i === messages.length - 1}
                        />
                      </div>
                    ))}

                  </>
                }
                <div ref={messageEndRef}></div>
              </div>
              <div className='flex flex-col py-1'>
                <div className='px-5 flex gap-3'>
                  <div className='relative flex items-center group'>
                    <Button className='bg-transparent text-black p-2 hover:bg-gray-200' onClick={handleOpenSetting}><MdOutlineMoreHoriz /></Button>
                    <AnimatePresence>
                      { isSettingOpen &&
                        <motion.div
                          initial={{ opacity: 0, x: -100 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -200 }}
                          className='absolute -top-60 w-fit bg-gray-100 rounded-xl px-2 py-2 flex flex-col gap-1 items-start justify-center shadow-[0px_0px_4px_2px_rgba(0,0,0,0.1)]'>
                          <CreateOrderSection/>
                          <OrderHistorySection/>
                          <Button className='bg-transparent text-black rounded-lg w-full justify-start p-2 hover:bg-secondary hover:text-white hover:border-none gap-2' onClick={handleLinkCustomerFormMessage}>
                            <SiGoogleforms className='size-4'/>
                            <p className='text-nowrap'>Đơn thông tin gửi khách hàng</p>
                          </Button>
                          <Button className='bg-transparent text-black rounded-lg  w-full justify-start p-2 hover:bg-secondary hover:text-white hover:border-none gap-2' onClick={handleLinkProductMessage}>
                            <CiLink className='size-4'/>
                            <p className='text-nowrap'>Gửi link sản phẩm cho khách</p>
                          </Button>
                          <AutoOrderButton/>
                        </motion.div>
                      }
                    </AnimatePresence>
                  </div>
                  <Input ref={inputRef} variant='gray' placeholder='Nhập tin nhắn...'/>
                  <Button onClick={handleSend} variant='default' className='py-0 px-5 lg:py-0.5 lg:px-4'>
                    <FiSend className='text-white size-3 lg:size-4'/>
                  </Button>
                </div>
                <div className='flex py-2 gap-3 items-start px-2 2xl:px-8'>
                  <p className='text-sm-body-desktop font-medium text-wrap hidden lg:block'>Các từ ràng buộc trước khi đặt đơn cho khách<span className='text-red-500'>*</span>: </p>
                  <ScrollArea className='w-50 sm:w-85 md:w-90 lg:w-120 2xl:w-190 pb-2'>
                    <div className='flex items-center gap-2'>
                      { LIST_ACCEPTANCE_WORD.map((word, i) => (
                        <Tag key={i} className='bg-gray-100 border-none px-2 py-0.5 text-nowrap font-normal'>
                          {word}
                        </Tag>
                      )) }
                    </div>
                    <ScrollBar orientation='horizontal' className='bg-gray-50 h-1.5'/>
                  </ScrollArea>
                </div>
              </div>
            </div>
            <AnimatePresence>
              { isCustomerOpen &&
              <motion.div
                ref={panelRef}
                initial={{ x:100 }}
                animate={{ x:0 }}
                className='md:flex-1 xl:flex-1.5 w-[40%] lg:w-[50%] right-0 lg:block z-10'>
                <CustomerInfo
                  customerName={conversationDetail?.customerName}
                  activeCustomerId={conversationDetail?.activeCustomerId}
                  avartarUrl={conversationDetail?.avartarUrl}
                />
              </motion.div>
              }
            </AnimatePresence>
          </>
          :
          <div className='w-full flex flex-col items-center justify-center'>
            <img src={Logo} alt="Logo" className='w-40 h-40'/>
            <p className='text-m-body-desktop font-medium text-gray-600'>Chào mừng đến với Omni chat!</p>
            <p className='text-sm-body-desktop text-gray-500 w-[30%] text-center'>Chọn tin nhắn để phản hồi nhu cầu và mong muốn của khách hàng về sản phẩm</p>
          </div>
        }
      </div>
    </div>
  )
}
