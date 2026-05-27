import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import useApiCall from '@/config/useApiCall'
import { toast } from 'react-toastify'
import { z } from 'zod'
import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'

export const createProductSchema = z.object({
  name: z.string().min(1, { error: 'Tên không được để trống' }),

  productPackagingType: z.string({ error: 'Loại hộp không được để trống' }),
  productKind: z.string({ error: 'Loại sữa không được để trống' }),

  volumeMl: z.string({ error: 'Dung tích không được để trống' }),

  description: z.string().optional(),

  brandId: z.string({ error: 'Hãng sữa không được để trống' }),

  price: z.number({ error: 'Giá không được để trống' }),

  lifeSpan: z.number({ error: 'Hạn sử dụng không được để trống' }),

  image: z
    .any()
    .refine((file) => file instanceof File, 'Vui lòng chọn ảnh')
})

type UseCreateProductProps = {
  onRefresh: Dispatch<SetStateAction<boolean>>
}

type CreateProductForm = z.infer<typeof createProductSchema>
export default function useCreateProduct({ onRefresh }: UseCreateProductProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch
  } = useForm<CreateProductForm>({
    resolver: zodResolver(createProductSchema)
  })

  const { execute, loading } = useApiCall<null>()
  const imageFile = watch('image')
  const [preview, setPreview] = useState<string | null>(null)


  const onSubmit = async (formData: CreateProductForm) => {
    const form = new FormData()

    form.append('Name', formData.name)
    form.append('ProductPackagingType', formData.productPackagingType)
    form.append('ProductKind', formData.productKind)
    form.append('VolumeMl', String(formData.volumeMl))
    form.append('Description', formData.description || '')
    form.append('BrandId', formData.brandId)
    form.append('Price', String(formData.price))
    form.append('LifeSpan', String(formData.lifeSpan))
    form.append('Image', formData.image)
    const res = await execute({
      apiUrl: '/products/create',
      method: 'post',
      type: 'private',
      body: form
    })

    if (res.error) {
      toast.error(res.error)
      return
    }

    toast.success('Tạo sản phẩm thành công')
    onRefresh(prevState => !prevState)
    reset()
  }

  useEffect(() => {
    if (!imageFile) return

    const file = imageFile as File
    const url = URL.createObjectURL(file)

    setPreview(url)

    return () => URL.revokeObjectURL(url)
  }, [imageFile])

  return {
    register,
    handleSubmit,
    control,
    errors,
    loading,
    onSubmit,
    preview,
    imageFile,
    reset,
    setPreview
  }
}