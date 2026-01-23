export type ResolveMessageType = {
  conversationId: string
  customerName: string
  avartarUrl: string
  providerName: string
  lastMessage: string
  updateDate: string
}

export type MessageType = {
   senderType: string
   senderId: string
   content: string
   timestamp: number
}

export type SenderMessage = {
  conversationId?: string
  staffId: string
  content: string
}

export type ConversationDetail = {
  id: string
  createdDate: Date
  status: string
  isDistributed: boolean
  customerName: string
  avartarUrl: string
  activeStaffId: string
  activeCustomerId: string
  providerId: string
  messages: MessageType[]
}