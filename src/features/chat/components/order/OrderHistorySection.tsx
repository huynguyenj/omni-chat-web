import { useState } from 'react'
import type { OrderType } from '../../types/order-type'
import Tag from '@/components/ui/tag/Tag'
import Button from '@/components/ui/button/Button'
import { MdHistory } from 'react-icons/md'
import { AnimatePresence } from 'motion/react'
import PopupBasic from '@/components/ui/popup/PopupBasic'
import Card from '@/components/ui/card/Card'
import { FiRotateCcw } from 'react-icons/fi'
import Input from '@/components/ui/input/Input'
import Alert from '@/components/ui/alert/Alert'

export default function OrderHistorySection({ orderHistoryData }: { orderHistoryData: OrderType }) {
  const [isHistoryOrderOpen, setIsHistoryOrderOpen] = useState(false)
  const [isRefundOrderOpen, setRefundOrderOpen] = useState(false)

  const handleHistoryOrderOpen = () => {
    setIsHistoryOrderOpen((prev) => !prev)
  }
  const handleRefundOrderOpen = () => {
    setRefundOrderOpen((prev) => !prev)
  }
  const tag = (status: string) => {
    switch (status) {
    case 'Đã giao': return <Tag className="text-[0.75rem] text-white font-bold" variant='success'>Đã giao </Tag>
    case 'Đang giao': return <Tag className="text-[0.75rem] text-white font-bold" variant='primary'>Đang giao</Tag>

    }
  }
  return (
    <>
      <Button variant='outline' className='rounded-2xl py-2 border border-border-secondary hover:bg-secondary hover:text-white hover:border-none gap-2' onClick={handleHistoryOrderOpen}>
        <MdHistory className='text-[1.25rem]'/>
        Lịch sử đơn hàng
      </Button>
      <AnimatePresence>
        { isHistoryOrderOpen &&
            <PopupBasic title='Thông tin sản phẩm' onClose={handleHistoryOrderOpen}>
              <p className='text-gray-400'>Lịch sử mua hàng của khách hàng</p>
              <Card className='mt-3'>
                <div className="flex items-center justify-between">
                  <p className="text-m-body-desktop text-primary font-bold">{orderHistoryData.id}</p>
                  {tag(orderHistoryData.deliveryStatus)}
                </div>
                <div className="bg-gray-100 py-1 px-3 rounded-[5px] my-10">
                  <p className="text-sm-body-desktop text-gray-600">{orderHistoryData.name}</p>
                </div>
                <hr className="text-gray-200 mb-3"/>
                <div className="flex justify-between items-center">
                  <p className="text-sm-body-desktop text-gray-500">Số lượng: </p>
                  <p className="text-sm-body-desktop text-primary font-bold">{orderHistoryData.totalAmount.toLocaleString('vi-VN')}đ</p>
                </div>
              </Card>
              {orderHistoryData.deliveryStatus === 'Đã giao' &&
              <Button variant='outline' className='text-sm-body-desktop border-orange-400 text-orange-600 hover:bg-orange-50 hover:text-black w-full' onClick={handleRefundOrderOpen}>
                <FiRotateCcw className='size-4'/>
                Yêu cầu hoàn tiền
              </Button>
              }
            </PopupBasic>
        }
      </AnimatePresence>
      {isRefundOrderOpen &&
            <AnimatePresence>
              <PopupBasic title='Yêu cầu hoàn tiền' onClose={handleRefundOrderOpen}>
                <p className='text-sm-body-desktop text-soft-gray mb-3'>Đơn hàng {orderHistoryData.id} - {orderHistoryData.totalAmount}</p>
                <Card className='my-3 bg-[#F5F7FA] rounded-[10px]'>
                  <div className="flex items-center justify-between my-2">
                    <p className='text-sm-body-desktop text-primary font-bold'>{orderHistoryData.id}</p>
                    {tag(orderHistoryData.status)}
                  </div>
                  <p className='text-sm-body-desktop text-soft-gray'>{orderHistoryData.name}</p>
                  <p className='text-sm-body-desktop text-soft-gray'>Ngày đặt: {}</p>
                  <p className='text-sm-body-desktop text-primary font-bold'>Tổng tiền: <span className='text-green-accent'>{orderHistoryData.totalAmount}</span></p>
                </Card>
                <label htmlFor="reason" className='text-sm-body-desktop text-soft-gray'>Lý do hoàn tiền <span className='text-red-500'>*</span></label>
                <Input variant='gray' type='text' placeholder='Nhập lý do hoàn tiền' id='reason'/>
                <label htmlFor="refundAmount" className='text-sm-body-desktop text-soft-gray'>Số tiền hoàn trả (VND)<span className='text-red-500'>*</span></label>
                <Input variant='gray' type='number' placeholder={`$Tối đa: ${orderHistoryData.totalAmount}`} id='refundAmount'/>
                <p className='text-[0.85rem] text-soft-gray'>Số tiền tối đa có thể hoàn: <span className='text-primary font-bold'>{orderHistoryData.totalAmount}</span></p>
                <Alert variant='danger'>
                  <p className='text-[0.9rem]'>Yêu cầu hoàn tiền sẽ được gửi cho quản lí để xem xét và phê duyệt. Vui lòng điền đầy đủ thông tin</p>
                </Alert>
                <div className='flex items-center gap-3 my-3'>
                  <Button variant='outline'>
                  Hủy
                  </Button>
                  <Button className='bg-orange-600 hover:bg-orange-700 text-white'>
                    <FiRotateCcw className='size-4'/>
                  Yêu cầu hoàn tiền
                  </Button>
                </div>
              </PopupBasic>
            </AnimatePresence>
      }
    </>
  )
}
