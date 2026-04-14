import useApiCall from '@/config/useApiCall'
import type { TicketType } from '../types/ticket-type'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export default function useGetTicket({ customerId }: { customerId?: string }) {
  const { execute, loading } = useApiCall<TicketType[]>()
  const [listTickets, setListTickets] = useState<TicketType[]>()
  useEffect(() => {
    if (!customerId) {
      toast.error('Xảy ra lỗi không có customer id!')
      return
    }
    const fetchTicket = async () => {
      const apiData = await execute({
        apiUrl: `/support-conversations/customer/${customerId}/complete-history`,
        method: 'get',
        type: 'private'
      })
      const { data, error } = apiData
      if (error) {
        toast.error('Lấy danh sách ticket thất bại!')
        return
      }
      setListTickets(data)
    }
    fetchTicket()
  }, [customerId])
  return { loading, listTickets }
}
