import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import z from 'zod'
import type { StaffDetailType, StaffUpdateType } from '../types/staff-type'
import { useState, type Dispatch, type SetStateAction } from 'react'
import useApiCall from '@/config/useApiCall'
import { toast } from 'react-toastify'

const updateStaffInfoSchema = z.object({
  name: z.string({ error: 'Tên không được để trống' }),
  email: z.string({ error: 'Email không được để trống' }),
  phone: z.string({ error: 'Số điện thoại không được để trống' })
})

type UpdateStaffInfoForm = z.infer<typeof updateStaffInfoSchema>

type UseUpdateStaffInfoProps = {
  onRefresh: Dispatch<SetStateAction<boolean>>
}

export default function useUpdateStaffInfo({ onRefresh }: UseUpdateStaffInfoProps) {
  const { handleSubmit, register, formState: { errors }, reset } = useForm<UpdateStaffInfoForm>({ resolver: zodResolver(updateStaffInfoSchema) })
  const { execute, loading } = useApiCall<null>()
  const [checkedIntentType, setCheckIntentType] = useState<Set<string>>(new Set())
  const [staffInfoEdit, setStaffInfoEdit] = useState<StaffDetailType>()
  const onSubmit = async (formData: UpdateStaffInfoForm) => {
    const finalForm: StaffUpdateType = {
      ...formData,
      staffIntentTypes: Array.from(checkedIntentType).map((intent => {
        return { intentId: intent }
      }))
    }
    const apiData = await execute({
      apiUrl: `/staff/update/${staffInfoEdit?.id}`,
      method: 'put',
      type: 'private',
      body: finalForm
    })
    const { error } = apiData
    if (error) {
      toast.error(error)
      return
    }
    toast.success('Cập nhật thông tin của nhân viên thành công')
    onRefresh((prev) => !prev)
  }

  return { errors, handleSubmit, register, checkedIntentType, setCheckIntentType, setStaffInfoEdit, loading, onSubmit, staffInfoEdit, reset }
}
