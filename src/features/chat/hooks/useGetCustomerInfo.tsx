import useApiCall from '@/config/useApiCall'
import { useEffect, useState } from 'react'
import type { CustomerInfoDetailType } from '../types/customer-info-type'
import useContextValid from '@/hooks/useContextValid'
import SelectionMessageContext from '../context/SelectionMessageProvider'
import { toast } from 'react-toastify'

export default function useGetCustomerInfo() {
  const context = useContextValid(SelectionMessageContext)
  const [customerInfo, setCustomerInfo] = useState<CustomerInfoDetailType>()
  const { execute, loading } = useApiCall<CustomerInfoDetailType>()
  const [isRefetch, setIsRefetch] = useState(false)
  useEffect(() => {
    const fetchCustomerInfo = async () => {
      const apiData = await execute({
        apiUrl: `/customer-profile/${context.conversationId}`,
        method: 'get',
        type: 'private'
      })
      const { data, error } = apiData
      if (error) {
        toast.error(error)
        return
      }
      setCustomerInfo(data)
    }
    fetchCustomerInfo()
  }, [context.conversationId, isRefetch])
  return { customerInfo, loading, setIsRefetch }
}
