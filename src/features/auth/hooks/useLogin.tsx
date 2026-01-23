import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AuthApi } from '../api/auth-api'
import { useAuthStore } from '../store/auth-store'
import { useNavigate } from 'react-router'

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
      console.log(loginData)
      const { accessToken, role, accountId, staffId } = loginData.data
      addAuthStore(accessToken, accountId, staffId, role)
      console.log(accessToken)
      navigate('/chat')
    } catch (error) {
      console.log(error)
    }
  }
  return { register, handleSubmit, onSubmit, errors }
}
