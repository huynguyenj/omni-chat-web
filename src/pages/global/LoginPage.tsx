import Logo from '@/assets/logo.jpg'
import Input from '@/components/ui/input/Input'
import useLogin from '@/features/auth/hooks/useLogin'
export default function LoginPage() {
  const { errors, handleSubmit, onSubmit, register } = useLogin()
  return (
    <div className='w-screen h-screen flex items-center justify-center'>
      <div className='min-w-[30%] max-w-[35%] px-10 py-12 shadow-[0px_5px_10px_1px_rgba(0,0,0,0.2)] rounded-2xl'>
        <div className='flex flex-col items-center mb-12'>
          <img src={Logo} alt="Logo" className='w-15 h-15 mb-5'/>
          <p className='text-m-body-desktop font-semibold text-primary'>Đăng nhập vào OmniChat</p>
          <p className='text-sm-body-desktop'>Quản lí nhắn khách hàng hiệu quả</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='flex flex-col gap-5 my-8'>
            <Input {...register('username')} type='text' variant='gray' label='Email' placeHolder='example@company.com' error={errors.username?.message}/>
            <Input {...register('password')} type='password' variant='gray' label='Mật khẩu' placeHolder='123456789' error={errors.password?.message}/>
          </div>
          <button className='py-2 px-3 text-center bg-secondary rounded-lg text-white font-semibold w-full hover:bg-secondary-hover cursor-pointer'>Đăng nhập</button>
        </form>
      </div>
    </div>
  )
}
