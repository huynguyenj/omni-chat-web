import { createContext, useState, type PropsWithChildren } from 'react'

type SelectionMessageContextProps = {
  conversationId: string | null
  customerId: string | null
  providerName: string
  handleChoose: (conversationId: string) => void
  handleChooseProviderName: (providerName: string) => void
  handleSaveCustomerId: (customerId: string) => void
}

const SelectionMessageContext = createContext<SelectionMessageContextProps | undefined>(undefined)

export function SelectionMessageProvider({ children }: PropsWithChildren) {
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [customerId, setCustomerId] = useState('')
  const [providerName, setProviderName] = useState('Facebook')
  const handleChoose = (conversationId: string) => {
    setConversationId(conversationId)
  }
  const handleChooseProviderName = (providerName: string) => {
    setProviderName(providerName)
    setConversationId(null)
  }

  const handleSaveCustomerId = (customerId: string) => {
    setCustomerId(customerId)
  }

  return (
    <SelectionMessageContext value={{ customerId, conversationId, handleChoose, providerName, handleChooseProviderName, handleSaveCustomerId }}>
      {children}
    </SelectionMessageContext>
  )
}

export default SelectionMessageContext