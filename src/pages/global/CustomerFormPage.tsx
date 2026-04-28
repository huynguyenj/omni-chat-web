import { useParams } from 'react-router'
import Logo from '@/assets/logo.jpg'
import Input from '@/components/ui/input/Input'
import Button from '@/components/ui/button/Button'
import Boy from '@/assets/boy.png'
import useCreateCustomerForm from '@/features/customer/hooks/useCreateCustomerForm'
import LoadingSpinner from '@/components/ui/loading/LoadingSpinner'
export default function CustomerFormPage() {
  const { activeCustomerId } = useParams()
  const { errors, handleSubmit, loading, onSubmit, register } = useCreateCustomerForm({ activeCustomerId: activeCustomerId })
  return (
    <div className='w-full h-screen bg-secondary flex items-center justify-center lg:justify- px-30'>
      <div className='hidden lg:flex w-fit h-[70%] mr-5 flex-col justify-center items-start'>
        <p className='font-bold text-white text-m-title-desktop uppercase text-start w-[70%]'>Omni chat phục vụ khách hàng tận tâm</p>
        <p className='text-m-body-desktop font-medium text-white w-[70%] text-start'>Sự hài lòng của quý khách là niềm vui của chúng tôi</p>
        <div className='w-[70%] h-[70%] flex '>
          <img src={Boy} alt="boy" className='w-full'/>
        </div>
      </div>
      <div className='min-w-90 w-[40%] min-h-150 h-[60%] bg-white rounded-2xl px-5 lg:px-8 py-10'>
        <div className='w-15 lg:w-20 xl:w-30 aspect-square rounded-full shadow-[-2px_2px_4px_4px_rgba(0,0,0,0.1)]'>
          <img src={Logo} alt="logo" className='w-full h-full rounded-full'/>
        </div>
        <h1 className='text-sm-title-desktop lg:text-m-title-desktop text-center font-medium text-primary'>Thông tin khách hàng</h1>
        <div className='flex flex-col gap-2 px-2 lg:px-10 mx-auto my-5'>
          <Input {...register('address')} label='Địa chỉ' placeholder='Thành phố HCM, quận 9' variant='gray' error={errors.address?.message}/>
          <Input {...register('phone')} label='Số điện thoại' placeholder='0979898929' variant='gray' error={errors.phone?.message}/>
          <Input {...register('email')} label='Email' placeholder='nguyenvana@gmail.com' variant='gray' error={errors.email?.message}/>
          { loading ?
            <LoadingSpinner size='sm'/>
            :
            <Button className='mt-5' onClick={handleSubmit(onSubmit)}>Gửi</Button>
          }
        </div>
      </div>
    </div>
  )
}
