import useApiCall from '@/config/useApiCall'
import { useState } from 'react'
import { toast } from 'react-toastify'
import type { InvoiceType } from '../types/pay-check'

export default function useGetInvoiceById() {
  const { execute, loading } = useApiCall<InvoiceType>()
  const [invoice, setInvoice] = useState<InvoiceType>()
  const handleGetPayInvoiceId = async (invoiceId: string) => {
    const apiData = await execute({
      apiUrl: `/invoices/get/${invoiceId}`,
      method: 'get',
      type: 'private'
    })
    if (apiData.error) {
      toast.error(apiData.error)
      return
    }
    setInvoice(apiData.data)
  }
  return { handleGetPayInvoiceId, loading, invoice }
}
