import useApiCall from '@/config/useApiCall'
import type { TicketType } from '../types/ticket-type'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import useContextValid from '@/hooks/useContextValid'
import SelectionMessageContext from '../context/SelectionMessageProvider'

export default function useGetTicket() {
  const { execute, loading } = useApiCall<TicketType[]>()
  const [listTickets, setListTickets] = useState<TicketType[]>()
  const context = useContextValid(SelectionMessageContext)
  useEffect(() => {
    if (!context.customerId) {
      toast.error('Xảy ra lỗi không có customer id!')
      return
    }
    const fetchTicket = async () => {
      const apiData = await execute({
        apiUrl: `/support-conversations/customer/${context.customerId}/complete-history`,
        method: 'get',
        type: 'private'
      })
      const { data, error } = apiData
      if (error) {
        toast.error(error)
        return
      }
      setListTickets(data)
    }
    fetchTicket()
  }, [context.customerId])
  return { loading, listTickets }
}
