import { createContext, useEffect, useState, type PropsWithChildren } from 'react'

type ChatLayoutFuncContextProps = {
   screenWidth: number
   handleOpenScreenChat: () => void
   isScreenChatOpen: boolean
}

const ChatLayoutFuncContext = createContext<ChatLayoutFuncContextProps | undefined>(undefined)

export function ChatLayoutFuncProvider({ children }: PropsWithChildren) {
  const [isScreenChatOpen, setIsScreenChatOpen] = useState(false)
  const [screenWidth, setScreenWidth] = useState(window.innerWidth)
  const handleOpenScreenChat = () => {
    if (screenWidth > 1000) return
    setIsScreenChatOpen(prevState => !prevState)
  }
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])
  return (
    <ChatLayoutFuncContext.Provider value={{ isScreenChatOpen, handleOpenScreenChat, screenWidth }}>
      {children}
    </ChatLayoutFuncContext.Provider>
  )
}
export default ChatLayoutFuncContext