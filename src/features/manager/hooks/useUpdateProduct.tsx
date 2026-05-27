import useApiCall from '@/config/useApiCall'
import { type ProductDetailType } from '@/features/chat/types/product-type'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import z from 'zod'

const updateProductSchema = z.object({
  name: z.string().min(1, { error: 'Tên không được để trống' }),
  description: z.string().optional(),
  price: z.number({ error: 'Giá không được để trống' }).refine((val) => !isNaN(val), { error: 'Giá không được để trống' }).min(1, { error: 'Giá không được để trống' })
})

const updateProductImageSchema = z.object({
  Image: z.any().refine((file) => file instanceof File, 'Vui lòng chọn ảnh')
})

type UpdateProductFormType = z.infer<typeof updateProductSchema>
type UpdateImageFormType = z.infer<typeof updateProductImageSchema>

type UseUpdateProductProps = {
  onRefresh: Dispatch<SetStateAction<boolean>>
}

export default function useUpdateProduct({ onRefresh }: UseUpdateProductProps) {
  const [productUpdateSelected, setProductUpdateSelected] = useState<ProductDetailType>()
  const { register: registerProductInfoUpdate, formState: { errors }, handleSubmit: handleSubmitProductInfo, reset: resetProductInfo } = useForm<UpdateProductFormType>({ resolver: zodResolver(updateProductSchema) })
  const { register: registerImageProductUpdate, reset: resetImage, handleSubmit: handleSubmitImage, watch, control: controlProductUpdateImage } = useForm<UpdateImageFormType>({ resolver: zodResolver(updateProductImageSchema) })
  const { execute, loading } = useApiCall<null>()
  const [newImagePreview, setNewImagePreview] = useState<string | null>()
  const newImage = watch('Image')
  const onProductInfoSubmit = async (formData: UpdateProductFormType) => {
    if (!productUpdateSelected) return
    const apiData = await execute({
      apiUrl: `/products/update/${productUpdateSelected.id}`,
      method: 'put',
      type: 'private',
      body: formData
    })
    if (apiData.error) {
      toast.error(apiData.error)
      return
    }
    toast.success('Cập nhật thông tin sản phẩm thành công')
    onRefresh(prev => !prev)
  }

  const onProductImageSubmit = async (formData: UpdateImageFormType) => {
    if (!productUpdateSelected) return
    const form = new FormData()
    form.append('Image', formData.Image)
    const apiData = await execute({
      apiUrl: `/products/update/${productUpdateSelected.id}/image`,
      method: 'put',
      type: 'private',
      body: form
    })
    if (apiData.error) {
      toast.error(apiData.error)
      return
    }
    toast.success('Cập nhật thông tin sản phẩm thành công')
    onRefresh(prev => !prev)
  }


  useEffect(() => {
    if (!newImage) return
    const image = newImage as File
    const url = URL.createObjectURL(image)
    setNewImagePreview(url)

    return () => URL.revokeObjectURL(url)
  }, [newImage])

  return { handleSubmitImage, handleSubmitProductInfo, onProductImageSubmit, onProductInfoSubmit, newImagePreview, loading, errors, setProductUpdateSelected, resetImage, resetProductInfo, registerImageProductUpdate, registerProductInfoUpdate, setNewImagePreview, controlProductUpdateImage, productUpdateSelected }
}
