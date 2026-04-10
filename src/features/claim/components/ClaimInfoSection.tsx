import Button from '@/components/ui/button/Button'
import Input from '@/components/ui/input/Input'
import PopupBasic from '@/components/ui/popup/PopupBasic'
import { AdvSelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select/AdvSelect'
import useGetAllClaimType from '@/features/claim/hooks/useGetAllClaimType'
import { AnimatePresence } from 'motion/react'
import { useState } from 'react'
import { BsPlusLg } from 'react-icons/bs'
import { CLAIM_TYPE } from '../const/claim-type'
import { Controller } from 'react-hook-form'
import useCreateClaim from '@/features/claim/hooks/useCreateClaim'

export default function ClaimInfoSection() {
  const [isOpen, setIsOpen] = useState(false)
  const { claimCategories } = useGetAllClaimType()
  const { control, handleSubmit, register, onSubmit, errors } = useCreateClaim()
  const handleOpen = () => {
    setIsOpen((state) => !state)
  }
  return (
    <div>
      <Button onClick={handleOpen}>
        <BsPlusLg/>
        Tạo Claim mới
      </Button>
      <AnimatePresence>
        {isOpen &&
                    <PopupBasic title='Tạo claim mới' onClose={handleOpen}>
                      <p className='text-soft-gray'>Tạo yêu cầu claim mới cho quản lí</p>
                      <div className='mt-10 text-sm-body-desktop text-sm/9'>
                        <label htmlFor="claim-select" className='font-medium'>Loại claim</label>
                        <Controller
                          control={control}
                          name='claimTypeId'
                          render={({ field }) => (
                            <AdvSelect
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder='Chọn loại claim'/>
                              </SelectTrigger>
                              <SelectContent>
                                { claimCategories ?
                                  claimCategories.map((category) => (
                                    <SelectItem value={category.id}>{CLAIM_TYPE[category.typeName]}</SelectItem>
                                  ))
                                  :
                                  <SelectItem value=''></SelectItem>
                                }
                              </SelectContent>
                            </AdvSelect>
                          )}
                        />
                        { errors.claimTypeId?.message && <p className='text-sm-body-desktop text-red-400 mb-3 font-medium'>{errors.claimTypeId.message}</p> }
                        <label htmlFor="reason" className='font-medium'>Lý do</label>
                        <Input {...register('reason')} id='reason' variant='gray' placeholder='Lý do cho yêu cầu này' type='text' className='pb-6' error={errors.reason?.message}/>
                        <label htmlFor="description" className='font-medium'>Mô tả</label>
                        <Input {...register('description')} id='description' variant='gray' placeholder='Mô tả chi tiết về yêu cầu của bạn...' type='text' className='pb-6'/>
                      </div>
                      <div className='flex items-center justify-end gap-2 mt-4'>
                        <Button variant='outline' className='border border-border-primary text-black px-5 hover:bg-gray-200' onClick={handleOpen}>
                              Hủy
                        </Button>
                        <Button onClick={handleSubmit(onSubmit)}>
                              Gửi Claim
                        </Button>
                      </div>
                    </PopupBasic>
        }
      </AnimatePresence>
    </div>
  )
}
