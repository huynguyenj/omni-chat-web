import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AuthApi } from '../api/auth-api'

const LoginFormSchema = z.object({
  username: z.email(),
  password: z.string().min(8, { error: 'Password must at least 8 characters' })
})

export type LoginFormType = z.infer<typeof LoginFormSchema>
export default function useLogin() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormType>({ resolver: zodResolver(LoginFormSchema) })
  const onSubmit = async (formData: LoginFormType) => {
    try {
      const loginData = await AuthApi.login(formData)
      console.log(loginData)
    } catch (error) {
      console.log(error)
    }
  }
  return { register, handleSubmit, onSubmit, errors }
}
