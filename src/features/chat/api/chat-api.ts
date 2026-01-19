import { apiPrivate } from '@/config/axios'
import type { ResolveMessageType } from '../types/message-type'
import type { ApiResponseStructure } from '@/types/api-response'

export const chatApi = {
  getSidebarConversationList: async (staffId: string): Promise<ApiResponseStructure<ResolveMessageType[]>> => await apiPrivate.get(`/api/v1/support-conversations/staff/${staffId}/pending`)
}