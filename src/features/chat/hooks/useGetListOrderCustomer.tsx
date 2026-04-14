import useApiCall from '@/config/useApiCall'
import type { PaginationStructure } from '@/types/api-response'
import { useEffect, useState } from 'react'
import type { OrderType } from '../types/order-type'
import { toast } from 'react-toastify'

type UseGetListOrderCustomerProps = {
   customerId?: string
   currentPage: number
}

export default function useGetListOrderCustomer({ customerId, currentPage }: UseGetListOrderCustomerProps) {
  const { execute, loading } = useApiCall<PaginationStructure<OrderType>>()
  const [listOrders, setListOrders] = useState<PaginationStructure<OrderType>>()

  useEffect(() => {
    if (!customerId) {
      toast.error('Chưa lấy được id của khách hàng')
      return
    }
    const fetchCustomerOrder = async () => {
      const apiData = await execute({
        apiUrl: `/orders/customer/${customerId}/get?pageNumber=${currentPage}&pageSize=10&sortBy=orderDate&descending=true`,
        method: 'get',
        type: 'private'
      })
      const { data, error } = apiData
      if (error) {
        toast.error('Lấy danh sách đặt đơn lỗi!')
        return
      }
      setListOrders(data)
    }
    fetchCustomerOrder()
  }, [customerId, currentPage])
  return { listOrders, loading }
}
