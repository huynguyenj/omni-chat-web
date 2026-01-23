import { createContext, useState, type PropsWithChildren } from 'react'

type SelectionMessageContextProps = {
  conversationId: string
  providerName: string
  handleChoose: (conversationId: string) => void
  handleChooseProviderName: (providerName: string) => void
}

const SelectionMessageContext = createContext<SelectionMessageContextProps | undefined>(undefined)

export function SelectionMessageProvider({ children }: PropsWithChildren) {
  const [conversationId, setConversationId] = useState('')
  const [providerName, setProviderName] = useState('')
  const handleChoose = (conversationId: string) => {
    setConversationId(conversationId)
  }
  const handleChooseProviderName = (providerName: string) => {
    setProviderName(providerName)
  }
  return (
    <SelectionMessageContext value={{ conversationId, handleChoose, providerName, handleChooseProviderName }}>
      {children}
    </SelectionMessageContext>
  )
}

export default SelectionMessageContext