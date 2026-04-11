import Alert from '@/components/ui/alert/Alert'
import Button from '@/components/ui/button/Button'
import Card from '@/components/ui/card/Card'
import PopupBasic from '@/components/ui/popup/PopupBasic'
import Tag from '@/components/ui/tag/Tag'
import { AnimatePresence } from 'motion/react'
import { useState } from 'react'
import { FiRotateCcw } from 'react-icons/fi'
import useGetListOrderCustomer from '../../hooks/useGetListOrderCustomer'
import CardSkeleton from '@/components/ui/skeleton/CardSkeleton'
import { formatDate } from '@/utils/date-resolver'
import type { OrderType } from '../../types/order-type'
import PaginationBar from '@/components/ui/pagination/PaginationBar'
import NodataCard from '@/components/ui/card/NodataCard'
import { DELIVERY_STATUS } from '../../const/order-status'
import Checkbox from '@/components/ui/input/Checkbox'
import { PiWarningCircleBold } from 'react-icons/pi'

function OrderCard({ data }: { data: OrderType }) {
  const [orderItemCheck, setOrderItemCheck] = useState<Set<string>>(new Set())
  const [isOpen, setIsOpen] = useState(false)
  const handleOpen = () => {
    setIsOpen((prev) => !prev)
  }
  const handleCheckOrderItem = (id: string) => {
    setOrderItemCheck((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
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
                          <div key={item.id} className='flex flex-col gap-2'>
                            <div className='flex gap-3 items-center'>
                              <Checkbox 
                                id={item.productName}
                                checked={orderItemCheck.has(item.id)}
                                onCheckedChange={() => handleCheckOrderItem(item.id)}
                              />
                              <label htmlFor={item.productName} className='text-sm-body-desktop font-medium text-primary'>{item.productName}</label>
                            </div>
                            <div className='flex gap-3 text-[0.85rem] text-soft-gray ml-8'>
                              <p>Đơn giá: <span className='font-medium text-green-accent'>{item.itemsPrice.toLocaleString()}đ</span></p>
                              <p>SL trong đơn: {item.quantity}</p>
                            </div>
                          </div>
                        )) }
                      </Card>
                    </div>
                    <Alert variant='danger' className='rounded-xl flex items-center justify-center gap-2'>
                      <PiWarningCircleBold size={20} color='#CA3500' className='font-bold'/>
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
    </Card>
  )
}

export default function CustomerOrder({ customerId }: { customerId?: string }) {
  const [currentPage, setCurrentPage] = useState(1)
  const { listOrders, loading } = useGetListOrderCustomer({ customerId: customerId, currentPage:  currentPage })

  return (
    <div className="flex flex-col">
      { loading ?
        <CardSkeleton count={3}/>
        :
        <>
          { listOrders ?
            <>
              <div className="flex items-center justify-between mb-5">
                <p className="text-sm-body-desktop">Lịch sử đơn hàng</p>
                <Tag className="border border-gray-300">{listOrders?.meta.total_items} đơn</Tag>
              </div>
              { listOrders.items.length === 0 && <NodataCard content='Khách hàng chưa có đơn hàng'/>}
              <div className="flex flex-col gap-3">
                {listOrders?.items.map((data) => (
                  <OrderCard key={data.code} data={data}/>
                ))}
                { listOrders.meta.total_pages > 0 &&
                  <PaginationBar
                    currentPage={currentPage}
                    setPage={setCurrentPage}
                    totalPage={listOrders.meta.total_pages}
                  />
                }
              </div>
            </>
            :
            <p></p>
          }
        </>
      }
    </div>
  )
}
