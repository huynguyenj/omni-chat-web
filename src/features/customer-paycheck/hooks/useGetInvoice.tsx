import useApiCall from '@/config/useApiCall'
import { toast } from 'react-toastify'

export default function useGetInvoice() {
  const { execute, loading } = useApiCall<null>()
  const handleGetPayInvoice = async (invoiceId: string) => {
    const apiData = await execute({
      apiUrl: `/invoices/${invoiceId}/create-payment-link`,
      method: 'post',
      type: 'private'
    })
    if (apiData.error) {
      toast.error(apiData.error)
      return
    }
    toast.success('Hãy vào mail để kiểm tra')
  }
  return { handleGetPayInvoice, loading }
}
