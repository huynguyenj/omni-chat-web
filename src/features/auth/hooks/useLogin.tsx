import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuthStore } from '../store/auth-store'
import { useNavigate } from 'react-router'
import type { LoginResponseType } from '../types/login-types'
import useApiCall from '@/config/useApiCall'
import { toast } from 'react-toastify'
import { ROLE_HOME } from '@/router/const/role-route'

const LoginFormSchema = z.object({
  username: z.email({ error: 'Hãy nhập đúng định dạng của email @gmail.com' }),
  password: z.string().min(8, { error: 'Mật khẩu ít nhất 8 kí tự' })
})

export type LoginFormType = z.infer<typeof LoginFormSchema>
export default function useLogin() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormType>({ resolver: zodResolver(LoginFormSchema) })
  const addAuthStore = useAuthStore((state) => state.setAuthInfo)
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
      toast.error(error)
      return
    }
    const { accessToken, refreshToken, role, accountId, staffId, avatarUrl, staffName } = apiData.data
    toast.success('Đăng nhập thành công')
    addAuthStore(accessToken, refreshToken, accountId, staffId, role, staffName, avatarUrl)
    navigate(ROLE_HOME[role])
  }
  return { register, handleSubmit, onSubmit, errors, loading }
}
