import useApiCall from '@/config/useApiCall'
import { useState } from 'react'
import type { PaycheckDetail } from '../types/pay-check'
import { toast } from 'react-toastify'

export default function useGetInvoiceDetail() {
  const { execute, loading } = useApiCall<PaycheckDetail[]>()
  const [paycheckDetail, setPaycheckDetail] = useState<PaycheckDetail[]>()

  const handleGetInvoice = async (invoiceId: string) => {
    const apiData = await execute({
      apiUrl: `/orders/invoice/${invoiceId}`,
      method: 'get',
      type: 'private'
    })
    if (apiData.error) {
      toast.error(apiData.error)
      return
    }
    setPaycheckDetail(apiData.data)
  }
  return { paycheckDetail, loading, handleGetInvoice }
}
