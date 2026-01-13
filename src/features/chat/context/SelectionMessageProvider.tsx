import { createContext, useState, type PropsWithChildren } from 'react'

type SelectionMessageContextProps = {
  conversationId: string
  handleChoose: (conversationId: string) => void
}

const SelectionMessageContext = createContext<SelectionMessageContextProps | undefined>(undefined)

export function SelectionMessageProvider({ children }: PropsWithChildren) {
  const [conversationId, setConversationId] = useState('')
  const handleChoose = (conversationId: string) => {
    setConversationId(conversationId)
  }
  return (
    <SelectionMessageContext value={{ conversationId, handleChoose }}>
      {children}
    </SelectionMessageContext>
  )
}

export default SelectionMessageContext