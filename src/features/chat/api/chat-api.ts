import { apiPrivate } from '@/config/axios'
import type { ConversationDetail, ResolveMessageType } from '../types/message-type'
import type { ApiResponseStructure } from '@/types/api-response'

export const chatApi = {
  getSidebarConversationList: async (staffId: string): Promise<ApiResponseStructure<ResolveMessageType[]>> => await apiPrivate.get(`/support-conversations/staff/${staffId}/pending`),
  getConversationDetail: async (conversationId: string): Promise<ApiResponseStructure<ConversationDetail>> => await apiPrivate.get(`/support-conversations/${conversationId}`)
}