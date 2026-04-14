import Alert from '@/components/ui/alert/Alert'
import Button from '@/components/ui/button/Button'
import Card from '@/components/ui/card/Card'
import Checkbox from '@/components/ui/input/Checkbox'
import Input from '@/components/ui/input/Input'
import PopupBasic from '@/components/ui/popup/PopupBasic'
import Tag from '@/components/ui/tag/Tag'
import { AnimatePresence } from 'motion/react'
import { FiRotateCcw } from 'react-icons/fi'
import { PiWarningCircleBold } from 'react-icons/pi'
import { DELIVERY_STATUS } from '../../const/order-status'
import { formatDate } from '@/utils/date-resolver'
import { useState } from 'react'
import useRefundRequest from '../../hooks/useRefundRequest'
import type { OrderType } from '../../types/order-type'
import LoadingSpinner from '@/components/ui/loading/LoadingSpinner'

export default function OrderCard({ data }: { data: OrderType }) {
  const [orderItemCheck, setOrderItemCheck] = useState<Map<string, number>>(new Map())
  const [isOpen, setIsOpen] = useState(false)
  const [reasonValue, setReasonValue] = useState('')
  const { handleRefundOrder, loading } = useRefundRequest({ orderId: data.id })
  const handleOpen = () => {
    setIsOpen((prev) => !prev)
  }
  const handleCheckOrderItem = (id: string) => {
    setOrderItemCheck((prev) => {
      const newMap = new Map(prev)
      if (newMap.has(id)) {
        newMap.delete(id)
      } else {
        newMap.set(id, 1)
      }
      return newMap
    })
  }

  const handleCheckInputValid = () => {
    if (reasonValue && orderItemCheck.size > 0) {
      return true
    }
    return false
  }

  const handleItemQuantity = (id: string, operator: 'plus' | 'minus', maximumItemQuantity: number) => {
    setOrderItemCheck((prev) => {
      const newMap = new Map(prev)
      const currentQuantity = newMap.get(id) ?? 0
      if (currentQuantity == 1 && operator === 'minus') return newMap
      if (currentQuantity == maximumItemQuantity && operator === 'plus') return newMap
      let updatedItemQuantity
      if (operator === 'plus') {
        updatedItemQuantity = currentQuantity + 1
      }
      else {
        updatedItemQuantity = currentQuantity - 1
      }
      newMap.set(id, updatedItemQuantity)
      return newMap
    })
  }
  return (
    <Card>
      <div className="flex items-center justify-between">
        <p className="text-m-body-desktop text-primary font-bold">{data.code}</p>
        <Tag variant={DELIVERY_STATUS[data.deliveryStatus].tagVariant}>
          {DELIVERY_STATUS[data.deliveryStatus].name}
        </Tag>
      </div>
      <p className="text-sm-body-desktop text-gray-500">{formatDate(data.orderDate)}</p>
      <div className="flex flex-col gap-5 bg-gray-100 py-5 px-3 rounded-[5px] my-10">
        <p className="text-sm-body-desktop text-gray-600">Tổng số sản phẩm: {data.orderItems.length}</p>
        <p className="text-sm-body-desktop text-gray-600">Danh sách sản phẩm: {data.orderItems.map((item) => item.productName).join(', ')}</p>
        <Button>Xem chi tiết</Button>
      </div>
      <hr className="text-gray-200 mb-3"/>
      <div className="flex justify-between items-center">
        {/* <p className="text-sm-body-desktop text-gray-500">Số lượng: {data.quantity}</p> */}
        <p className="text-m-body-desktop font-medium text-green-accent">{data.totalAmount.toLocaleString()}đ</p>
      </div>
      { data.status === 'Completed' &&
              <Button variant='outline' className='w-full my-3 border-orange-400 text-orange-600 hover:bg-orange-50 hover:text-black' onClick={handleOpen}>
                <FiRotateCcw className='size-4'/>
                Yêu cầu hoàn tiền
              </Button>
      }
      {isOpen &&
                <AnimatePresence>
                  <PopupBasic title='Yêu cầu hoàn tiền' onClose={handleOpen}>
                    <p className='text-sm-body-desktop text-soft-gray'>Đơn hàng {data.code} - {data.totalAmount.toLocaleString()}đ</p>
                    <Card className='my-3 bg-[#F5F7FA] rounded-[10px]'>
                      <div className="flex items-center justify-between my-1">
                        <p className='text-sm-body-desktop text-primary font-bold'>{data.code}</p>
                        <Tag variant={DELIVERY_STATUS[data.deliveryStatus].tagVariant} className='py-0.5'>
                          {DELIVERY_STATUS[data.deliveryStatus].name}
                        </Tag>
                      </div>
                      <p className='text-sm-body-desktop text-soft-gray'>  { data.orderItems.map((item) => item.productName).join(', ') }</p>
                      <p className='text-sm-body-desktop text-soft-gray'>Ngày đặt: {formatDate(data.orderDate)}</p>
                      <p className='text-sm-body-desktop text-primary font-medium'>Tổng tiền: <span className='text-green-accent'>{data.totalAmount.toLocaleString()}đ</span></p>
                    </Card>
                    <div className='flex flex-col gap-3 my-5'>
                      <p className='text-sm-body-desktop font-bold text-primary'>Sản phẩm hoàn trả <span className='text-red-500 font-bold'>*</span></p>
                      <Card variant='default' className='rounded-xl'>
                        { data.orderItems.map((item) => (
                          <div key={item.id} className='flex flex-col'>
                            <div className='flex gap-3 justify-between items-center'>
                              <div className='flex gap-3 items-center'>
                                <Checkbox
                                  id={item.productName}
                                  checked={orderItemCheck.has(item.id)}
                                  onCheckedChange={() => handleCheckOrderItem(item.id)}
                                />
                                <label htmlFor={item.productName} className='text-sm-body-desktop font-medium text-primary'>{item.productName}</label>
                              </div>
                              { orderItemCheck.has(String(item.id)) &&
                                <div className='flex items-center gap-2'>
                                  <Button className='py-0.5 px-3 border-3 border-border-primary hover:bg-gray-200' variant='outline' onClick={() => handleItemQuantity(item.id, 'minus', item.quantity)}>
                                    <p className='text-m-body-desktop font-bold text-black'>-</p>
                                  </Button>
                                  <div className='px-8 py-1 rounded-sm border-3 border-border-primary'>
                                    <p>{orderItemCheck.get(String(item.id))}</p>
                                  </div>
                                  <Button className='py-0.5 px-3 border-3 border-border-primary hover:bg-gray-200' variant='outline' onClick={() => handleItemQuantity(item.id, 'plus', item.quantity)}>
                                    <p className='text-m-body-desktop font-bold text-black'>+</p>
                                  </Button>
                                </div>
                              }
                            </div>
                            <div className='flex gap-3 text-[0.9rem] text-soft-gray ml-8'>
                              <p>Đơn giá: <span className='font-medium text-green-accent'>{item.itemsPrice.toLocaleString()}đ</span></p>
                              <p>SL trong đơn: {item.quantity}</p>
                            </div>
                          </div>
                        )) }
                      </Card>
                    </div>
                    <label htmlFor="reason" className='text-sm-body-desktop font-bold text-primary'>Lí do trả hàng <span className='text-red-500'>*</span></label>
                    <Input value={reasonValue} onChange={(e) => setReasonValue(e.target.value)} variant='gray' id='reason' placeholder='Lí do bạn trả hàng'/>
                    <Alert variant='danger' className='rounded-xl flex items-center justify-center gap-2 my-5'>
                      <PiWarningCircleBold size={20} color='#CA3500' className='font-bold'/>
                      <p className='text-[0.9rem]'>Yêu cầu hoàn tiền sẽ được gửi cho quản lí để xem xét và phê duyệt. Vui lòng điền đầy đủ thông tin</p>
                    </Alert>
                    { loading ?
                      <div className='w-full flex justify-center py-5'>
                        <LoadingSpinner size='lg'/>
                      </div>
                      :
                      <>
                        <div className='flex w-full items-center gap-3 my-3'>
                          <Button variant='outline' className='basis-[50%] border-3 border-border-primary text-black hover:bg-gray-200'>
                              Hủy
                          </Button>
                          <Button className={`bg-orange-600 hover:bg-orange-700 text-white basis-[50%] ${!handleCheckInputValid() && 'opacity-50'}`} disabled={!handleCheckInputValid()} onClick={() => handleRefundOrder(orderItemCheck, reasonValue, data.customerId)}>
                            <FiRotateCcw className='size-4'/>
                        Yêu cầu hoàn tiền
                          </Button>
                        </div>

                      </>
                    }
                  </PopupBasic>
                </AnimatePresence>
      }
    </Card>
  )
}