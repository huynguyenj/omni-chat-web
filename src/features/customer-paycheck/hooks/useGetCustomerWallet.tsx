import useApiCall from '@/config/useApiCall'
import type { PaycheckTransactionSummary } from '../types/pay-check'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export default function useGetCustomerWallet({ customerId }: { customerId?: string }) {
  const { execute, loading } = useApiCall<PaycheckTransactionSummary>()
  const [wallet, setWallet] = useState<PaycheckTransactionSummary>()
  useEffect(() => {
    const fetchWallet = async () => {
      const apiData = await execute({
        apiUrl: `/wallets/${customerId}`,
        method: 'get',
        type:'private'
      })
      if (apiData.error) {
        toast.error(apiData.error)
        return
      }
      setWallet(apiData.data)
    }
    fetchWallet()
  }, [customerId])
  return { wallet, loading }
}
