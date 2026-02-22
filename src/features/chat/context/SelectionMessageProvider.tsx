import { createContext, useState, type PropsWithChildren } from 'react'

type SelectionMessageContextProps = {
  conversationId: string | null
  providerName: string
  handleChoose: (conversationId: string) => void
  handleChooseProviderName: (providerName: string) => void
}

const SelectionMessageContext = createContext<SelectionMessageContextProps | undefined>(undefined)

export function SelectionMessageProvider({ children }: PropsWithChildren) {
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [providerName, setProviderName] = useState('Facebook')
  const handleChoose = (conversationId: string) => {
    setConversationId(conversationId)
  }
  const handleChooseProviderName = (providerName: string) => {
    setProviderName(providerName)
    setConversationId(null)
  }

  return (
    <SelectionMessageContext value={{ conversationId, handleChoose, providerName, handleChooseProviderName }}>
      {children}
    </SelectionMessageContext>
  )
}

export default SelectionMessageContext