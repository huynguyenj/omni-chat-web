import useApiCall from '@/config/useApiCall'
import type { PaginationStructure } from '@/types/api-response'
import { useEffect, useState } from 'react'
import type { OrderType } from '../types/order-type'
import { toast } from 'react-toastify'
import useContextValid from '@/hooks/useContextValid'
import SelectionMessageContext from '../context/SelectionMessageProvider'

type UseGetListOrderCustomerProps = {
   customerId?: string
   currentPage: number
}

export default function useGetListOrderCustomer({ currentPage }: UseGetListOrderCustomerProps) {
  const { execute, loading } = useApiCall<PaginationStructure<OrderType>>()
  const context = useContextValid(SelectionMessageContext)
  const [listOrders, setListOrders] = useState<PaginationStructure<OrderType>>()

  useEffect(() => {
    if (!context.customerId) {
      toast.error('Chưa lấy được id của khách hàng')
      return
    }
    const fetchCustomerOrder = async () => {
      const apiData = await execute({
        apiUrl: `/orders/customer/${context.customerId}/get?pageNumber=${currentPage}&pageSize=10&sortBy=orderDate&descending=true`,
        method: 'get',
        type: 'private'
      })
      const { data, error } = apiData
      if (error) {
        toast.error(error)
        return
      }
      setListOrders(data)
    }
    fetchCustomerOrder()
  }, [context.customerId, currentPage])
  return { listOrders, loading }
}
