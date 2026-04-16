import { useState } from 'react'
import type { BatchCreateType } from '../types/batch-type'
import useApiCall from '@/config/useApiCall'
import type { ProductDetailType } from '@/features/chat/types/product-type'
import { toast } from 'react-toastify'
import z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const batchSchema = z.object({
  manuFactureDate: z.date(),
  quantity: z.number()
})

type BatchItemType = z.infer<typeof batchSchema>

export default function useCreateBatchProduct() {
  const [listBatchItems, setListBatchItems] = useState<BatchItemType[]>([])
  const [productChoseForBatch, setProductChoseForBatch] = useState<ProductDetailType>()
  const { register, handleSubmit, reset } = useForm<BatchItemType>({ resolver: zodResolver(batchSchema) })
  const { execute, loading } = useApiCall<null>()

  const handleCreateBatch = async () => {
    if (!productChoseForBatch) return
    const productBatchData: BatchCreateType = {
      productId: productChoseForBatch.id,
      productBatch: [...listBatchItems]
    }
    const apiData = await execute({
      apiUrl: '/products/add-stock',
      method: 'post',
      type: 'private',
      body: [productBatchData]
    })
    const { error } = apiData
    if (error) toast.error('Tạo lô sản phẩm thất bại')
  }
  const handleAddBatch = (formData: BatchItemType) => {
    setListBatchItems(prev => [...prev, formData])
    reset({
      manuFactureDate: undefined,
      quantity: 1
    })
  }
  const handleDeleteBatch = (batchItem: BatchItemType) => {
    const updateListBatch = listBatchItems.filter((batch) => batch !== batchItem)
    setListBatchItems(updateListBatch)
    reset({
      manuFactureDate: undefined,
      quantity: 1
    })
  }
  return { handleCreateBatch, setListBatchItems, listBatchItems, setProductChoseForBatch, productChoseForBatch, loading, handleAddBatch, handleDeleteBatch, register, handleSubmit }
}
