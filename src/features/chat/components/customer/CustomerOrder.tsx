import Alert from '@/components/ui/alert/Alert'
import Button from '@/components/ui/button/Button'
import Card from '@/components/ui/card/Card'
import Input from '@/components/ui/input/Input'
import PopupBasic from '@/components/ui/popup/PopupBasic'
import Tag from '@/components/ui/tag/Tag'
import { AnimatePresence } from 'motion/react'
import { useState } from 'react'
import { FiRotateCcw } from 'react-icons/fi'

type CustomerOrderType = {
  id: string
  date: string
  status: string
  product: string
  quantity: number
  total: string
}

const CustomerOrderData: CustomerOrderType[] = [
  {
    id: 'ORD001',
    date: '15/01/2026',
    product: 'Sữa tươi Vinamilk không đường + 1 sản phẩm khác',
    quantity: 5,
    total: '148.000đ',
    status: 'Đã giao'
  },
  {
    id: 'ORD002',
    date: '10/01/2026',
    product: 'Sữa đặc có đường Ông Thọ',
    quantity: 1,
    total: '42.000đ',
    status: 'Đã giao'
  },
  {
    id: 'ORD003',
    date: '28/12/2025',
    product: 'Sữa bột Ensure Gold 850g + 1 sản phẩm khác',
    quantity: 3,
    total: '755.000đ',
    status: 'Đã giao'
  },
  {
    id: 'ORD004',
    date: '20/12/2025',
    product: 'Sữa chua uống Vinamilk có đường',
    quantity: 5,
    total: '150.000đ',
    status: 'Đang giao'
  },
  {
    id: 'ORD005',
    date: '15/12/2025',
    product: 'Sữa bột Grow Plus+ 900g',
    quantity: 2,
    total: '900.000đ',
    status: 'Đã giao'
  },
  {
    id: 'ORD006',
    date: '08/12/2025',
    product: 'Sữa tươi Vinamilk không đường + 1 sản phẩm khác',
    quantity: 10,
    total: '296.000đ',
    status: 'Đã giao'
  },
  {
    id: 'ORD007',
    date: '01/12/2025',
    product: 'Sữa đặc có đường Ông Thọ',
    quantity: 3,
    total: '126.000đ',
    status: 'Đã giao'
  },
  {
    id: 'ORD008',
    date: '25/11/2025',
    product: 'Sữa tươi tiệt trùng Dalat Milk + 1 sản phẩm khác',
    quantity: 9,
    total: '295.000đ',
    status: 'Đã giao'
  }
]
const tag = (status: string) => {
  switch (status) {
  case 'Đã giao': return <Tag className="text-[0.75rem] text-white font-bold" variant='success'>Đã giao </Tag>
  case 'Đang giao': return <Tag className="text-[0.75rem] text-white font-bold" variant='primary'>Đang giao</Tag>

  }
}
function OrderCard({ data, openRefund }: { data: CustomerOrderType, openRefund?: () => void }) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <p className="text-m-body-desktop text-primary font-bold">{data.id}</p>
        {tag(data.status)}
      </div>
      <p className="text-sm-body-desktop text-gray-500">{data.date}</p>
      <div className="bg-gray-100 py-1 px-3 rounded-[5px] my-10">
        <p className="text-sm-body-desktop text-gray-600">{data.product}</p>
      </div>
      <hr className="text-gray-200 mb-3"/>
      <div className="flex justify-between items-center">
        <p className="text-sm-body-desktop text-gray-500">Số lượng: {data.quantity}</p>
        <p className="text-sm-body-desktop text-green-accent">{data.total}</p>
      </div>
      { data.status === 'Đã giao' && openRefund &&
              <Button variant='outline' className='border-orange-400 text-orange-600 hover:bg-orange-50 hover:text-black' onClick={openRefund}>
                <FiRotateCcw className='size-4'/>
                Yêu cầu hoàn tiền
              </Button>
      }
    </Card>
  )
}

export default function CustomerOrder() {
  const [isOpen, setIsOpen] = useState(false)
  const handleOpen = () => {
    setIsOpen((prev) => !prev)
  }
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm-body-desktop">Lịch sử đơn hàng</p>
        <Tag className="border border-gray-300">{CustomerOrderData.length} đơn</Tag>
      </div>
      <div className="flex flex-col gap-3">
        {CustomerOrderData.map((data) => (
          <>
            <OrderCard key={data.id} data={data} openRefund={handleOpen}/>
            {isOpen &&
            <AnimatePresence>
              <PopupBasic title='Yêu cầu hoàn tiền' onClose={handleOpen}>
                <p className='text-sm-body-desktop text-soft-gray mb-3'>Đơn hàng {data.id} - {data.total}</p>
                <Card className='my-3 bg-[#F5F7FA] rounded-[10px]'>
                  <div className="flex items-center justify-between my-2">
                    <p className='text-sm-body-desktop text-primary font-bold'>{data.id}</p>
                    {tag(data.status)}
                  </div>
                  <p className='text-sm-body-desktop text-soft-gray'>{data.product}</p>
                  <p className='text-sm-body-desktop text-soft-gray'>Ngày đặt: {data.date}</p>
                  <p className='text-sm-body-desktop text-primary font-bold'>Tổng tiền: <span className='text-green-accent'>{data.total}</span></p>
                </Card>
                <label htmlFor="reason" className='text-sm-body-desktop text-soft-gray'>Lý do hoàn tiền <span className='text-red-500'>*</span></label>
                <Input variant='gray' type='text' placeholder='Nhập lý do hoàn tiền' id='reason'/>
                <label htmlFor="refundAmount" className='text-sm-body-desktop text-soft-gray'>Số tiền hoàn trả (VND)<span className='text-red-500'>*</span></label>
                <Input variant='gray' type='number' placeholder={`$Tối đa: ${data.total}`} id='refundAmount'/>
                <p className='text-[0.85rem] text-soft-gray'>Số tiền tối đa có thể hoàn: <span className='text-primary font-bold'>{data.total}</span></p>
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
        ))}
      </div>
    </div>
  )
}
