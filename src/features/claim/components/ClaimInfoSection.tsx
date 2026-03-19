import Button from '@/components/ui/button/Button'
import Input from '@/components/ui/input/Input'
import PopupBasic from '@/components/ui/popup/PopupBasic'
import { AdvSelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select/AdvSelect'
import { AnimatePresence } from 'motion/react'
import { useState } from 'react'
import { BsPlusLg } from 'react-icons/bs'

export default function ClaimInfoSection() {
  const [isOpen, setIsOpen] = useState(false)

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
                        <AdvSelect>
                          <SelectTrigger>
                            <SelectValue placeholder='Chọn loại claim'/>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='absence'>Nghỉ phép</SelectItem>
                            <SelectItem value='sick-absence'>Nghỉ ốm</SelectItem>
                            <SelectItem value='quit'>Nghỉ việc</SelectItem>
                          </SelectContent>
                        </AdvSelect>
                        <label htmlFor="description" className='font-medium'>Mô tả</label>
                        <Input id='description' variant='gray' placeholder='Mô tả chi tiết về yêu cầu của bạn...' type='text' className='pb-6'/>
                        <label htmlFor="reason" className='font-medium'>Lý do</label>
                        <Input id='reason' variant='gray' placeholder='Lý do cho yêu cầu này' type='text' className='pb-6'/>
                      </div>
                      <div className='flex items-center justify-end gap-2 mt-4'>
                        <Button variant='outline' className='border border-border-primary text-black px-5 hover:bg-gray-200' onClick={handleOpen}>
                              Hủy
                        </Button>
                        <Button>
                              Gửi Claim
                        </Button>
                      </div>
                    </PopupBasic>
        }
      </AnimatePresence>
    </div>
  )
}
