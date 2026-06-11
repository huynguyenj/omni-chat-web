import useApiCall from '@/config/useApiCall'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import z from 'zod'

const allocateSchema = z.object({
  deductedAmount: z.number({ error: 'Số lượng không được để trống' }).min(0, { error: 'Số tiền không được < 0' })
})

type AllocateType = z.infer<typeof allocateSchema>

type UseAllocateWalletType = {
  onRefresh: () => void
}

export default function useAllocateWallet({ onRefresh }: UseAllocateWalletType) {
  const { execute, loading } = useApiCall<null>()
  const { register, handleSubmit, reset, formState: { errors } } = useForm<AllocateType>({ resolver: zodResolver(allocateSchema) })
  const [invoiceId, setInvoiceId] = useState('')
  const onSubmit = async (formData: AllocateType, walletId?: string) => {
    if (!walletId) {
      toast.error('Hãy tải lại trang để lấy dữ liệu ví tiền')
      return
    }
    const submitData: { walletId: string, deductedAmount: number } = {
      walletId: walletId,
      deductedAmount: formData.deductedAmount
    }
    const apiData = await execute({
      apiUrl: `/wallets/allocate-to-invoice/${invoiceId}`,
      method: 'post',
      type: 'private',
      body: submitData
    })
    if (apiData.error) {
      toast.error(apiData.error)
      return
    }
    toast.success('Đã dùng tiền trong ví thành công!')
    onRefresh()
  }
  return { register, handleSubmit, reset, loading, onSubmit, setInvoiceId, errors }
}
