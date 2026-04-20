import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuthStore } from '../store/auth-store'
import { useNavigate } from 'react-router'
import { PRIVATE_PATH } from '@/router/path'
import type { LoginResponseType } from '../types/login-types'
import useApiCall from '@/config/useApiCall'
import { toast } from 'react-toastify'

const LoginFormSchema = z.object({
  username: z.email(),
  password: z.string().min(8, { error: 'Password must at least 8 characters' })
})

export type LoginFormType = z.infer<typeof LoginFormSchema>
export default function useLogin() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormType>({ resolver: zodResolver(LoginFormSchema) })
  const addAuthStore = useAuthStore((state) => state.setAccessToken)
  const navigate = useNavigate()
  const { execute, loading } = useApiCall<LoginResponseType>()
  const onSubmit = async (formData: LoginFormType) => {
    const apiData = await execute({
      apiUrl: '/auth/login',
      method: 'post',
      type: 'public',
      body: formData
    })
    const error = apiData.error
    if (error) {
      toast.error('Tài khoản hoặc mật khẩu sai!')
      return
    }
    const { accessToken, role, accountId, staffId, avatarUrl, staffName } = apiData.data
    toast.success('Đăng nhập thành công')
    addAuthStore(accessToken, accountId, staffId, role, staffName, avatarUrl)
    navigate(PRIVATE_PATH.CHAT)
  }
  return { register, handleSubmit, onSubmit, errors, loading }
}
