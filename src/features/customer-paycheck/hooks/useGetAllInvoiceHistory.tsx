import useApiCall from '@/config/useApiCall'
import type { PaginationStructure } from '@/types/api-response'
import type { Paycheck } from '../types/pay-check'
import { useEffect, useState } from 'react'

export default function useGetAllInvoiceHistory({ customerId }: { customerId?: string }) {
  const { execute, loading } = useApiCall<PaginationStructure<Paycheck>>()
  const [paycheckHistory, setPaycheckHistory] = useState<PaginationStructure<Paycheck>>()
  const [currentPage, setCurrentPage] = useState(1)
  const [isRefresh, setIsRefresh] = useState(false)
  useEffect(() => {
    const fetchInvoiceHistory = async () => {
      const param = new URLSearchParams()
      param.append('pageNumber', currentPage.toString())
      param.append('pageSize', '10')
      const apiUrl = `/invoices/customer/${customerId}/histories?${param}`
      const apiData = await execute({
        apiUrl: apiUrl,
        method: 'get',
        type: 'private'
      })
      setPaycheckHistory(apiData.data)
    }
    fetchInvoiceHistory()
  }, [customerId, currentPage, isRefresh])
  const handleRefresh = () => {
    setCurrentPage(1)
    setIsRefresh(prev => !prev)
  }
  return { loading, paycheckHistory, handleRefresh, currentPage, setCurrentPage }
}
