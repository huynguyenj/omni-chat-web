import Logo from '@/assets/logo.jpg'
import Button from '@/components/ui/button/Button'
import Input from '@/components/ui/input/Input'
import LoadingSpinner from '@/components/ui/loading/LoadingSpinner'
import useLogin from '@/features/auth/hooks/useLogin'
export default function LoginPage() {
  const { errors, handleSubmit, onSubmit, register, loading } = useLogin()
  return (
    <div className='w-screen h-screen flex items-center justify-center bg-graphite'>
      <div className='w-100 md:w-[60] xl:w-120 min-w-90 px-10 py-12 border border-border-primary shadow-[0px_8px_10px_1px_rgba(0,0,0,0.1)] rounded-2xl bg-white'>
        <div className='flex flex-col items-center mb-12'>
          <img src={Logo} alt="Logo" className='w-15 h-15 mb-5'/>
          <p className='text-m-body-desktop font-semibold text-primary'>Đăng nhập vào OmniChat</p>
          <p className='text-sm-body-desktop'>Quản lí nhắn khách hàng hiệu quả</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='flex flex-col gap-5 my-8'>
            <Input {...register('username')} type='text' variant='gray' label='Email' placeholder='example@company.com' error={errors.username?.message}/>
            <Input {...register('password')} type='password' variant='gray' label='Mật khẩu' placeholder='123456789' error={errors.password?.message}/>
          </div>
          <Button variant='default' className={`w-full ${loading && 'bg-soft-gray text-white'}`} disabled={loading}>
            {
              loading ?
                <LoadingSpinner size='md'/>
                :
                'Đăng nhập'
            }
          </Button>
        </form>
      </div>
    </div>
  )
}
