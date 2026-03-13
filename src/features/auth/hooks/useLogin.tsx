import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AuthApi } from '../api/auth-api'
import { useAuthStore } from '../store/auth-store'
import { useNavigate } from 'react-router'
import { PRIVATE_PATH } from '@/router/path'
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
  const onSubmit = async (formData: LoginFormType) => {
    try {
      const loginData = await AuthApi.login(formData)
      const { accessToken, role, accountId, staffId } = loginData.data
      addAuthStore(accessToken, accountId, staffId, role)
      navigate(PRIVATE_PATH.CHAT)
    } catch (error) {
      console.log(error)
      toast.error('Login fail')
    }
  }
  return { register, handleSubmit, onSubmit, errors }
}
