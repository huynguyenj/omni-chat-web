
import Button from '@/components/ui/button/Button'
import PopupBasic from '@/components/ui/popup/PopupBasic'
import { useState } from 'react'
import { BsStars } from 'react-icons/bs'
import { LuPackage } from 'react-icons/lu'
import type { Recommendation } from '../types/system-recommendation-type'
import { MdHistory } from 'react-icons/md'
import type { ProductType } from '../types/product-type'
import type { OrderType } from '../types/order-type'
import Card from '@/components/ui/card/Card'
import Tag from '@/components/ui/tag/Tag'
import { MdOutlineShoppingCart } from "react-icons/md";
import { AnimatePresence } from 'motion/react'
import TutorialBox from './ui/TutorialBox'
import Select from '@/components/ui/select/Select'


function ProductButton({ productData }: { productData: ProductType}) {
  const [isOpen, setIsOpen] = useState(false)
  const handleOpen = () => {
    setIsOpen((prev) => !prev)
  }
  return (
    <>
      <Button variant='outline' className='rounded-2xl py-2 border border-border-secondary hover:bg-secondary hover:text-white hover:border-none gap-2' onClick={handleOpen}>
        <LuPackage className='text-[1.25rem]'/>
        Tra cứu thông tin sản phẩm
      </Button>
      <AnimatePresence>

        { isOpen &&
            <PopupBasic title='Thông tin sản phẩm' onClose={handleOpen}>
              <p className='text-gray-400 text-sm-body-desktop'>Thông tin sản phẩm</p>
              <div className='flex gap-15 items-center mt-3'>
                <div>
                  <p className='text-sm-body-desktop text-gray-400'>Tên sản phẩm</p>
                  <p className='text-sm-body-desktop font-bold text-primary'>{productData.productName}</p>
                </div>
                <div>
                  <p className='text-sm-body-desktop text-gray-400'>Mã sản phẩm</p>
                  <p className='text-sm-body-desktop font-bold text-primary'>{productData.productCode}</p>
                </div>
              </div>
              <hr className='border border-gray-100 my-5'/>
              <div className='flex flex-col gap-5'>
                <p className='text-gray-400 text-sm-body-desktop'>Ảnh sản phẩm</p>
                <img src={productData.productImageUrl} alt="product image" className='w-50 h-40' />
              </div>
            </PopupBasic>
        }
      </AnimatePresence>
    </>
  )
}

function OrderHistoryButton({ orderHistoryData }: { orderHistoryData: OrderType }) {
  const [isOpen, setIsOpen] = useState(false)
  const handleOpen = () => {
    setIsOpen((prev) => !prev)
  }
  const tag = (status: string) => {
    switch (status) {
    case 'Đã giao': return <Tag className="text-[0.75rem] text-white font-bold" variant='success'>Đã giao </Tag>
    case 'Đang giao': return <Tag className="text-[0.75rem] text-white font-bold" variant='primary'>Đang giao</Tag>

    }
  }
  return (
    <>
      <Button variant='outline' className='rounded-2xl py-2 border border-border-secondary hover:bg-secondary hover:text-white hover:border-none gap-2' onClick={handleOpen}>
        <MdHistory className='text-[1.25rem]'/>
        Lịch sử đơn hàng
      </Button>
      <AnimatePresence>
        { isOpen &&
            <PopupBasic title='Thông tin sản phẩm' onClose={handleOpen}>
              <p className='text-gray-400'>Lịch sử mua hàng của khách hàng</p>
              <Card className='mt-3'>
                <div className="flex items-center justify-between">
                  <p className="text-m-body-desktop text-primary font-bold">{orderHistoryData.orderId}</p>
                  {tag(orderHistoryData.deliveryStatus)}
                </div>
                <div className="bg-gray-100 py-1 px-3 rounded-[5px] my-10">
                  <p className="text-sm-body-desktop text-gray-600">{orderHistoryData.orderName}</p>
                </div>
                <hr className="text-gray-200 mb-3"/>
                <div className="flex justify-between items-center">
                  <p className="text-sm-body-desktop text-gray-500">Số lượng: </p>
                  <p className="text-sm-body-desktop text-primary font-bold">{orderHistoryData.totalAmount.toLocaleString('vi-VN')}đ</p>
                </div>
              </Card>
            </PopupBasic>
        }
      </AnimatePresence>
    </>
  )
}

// function CustomerProfileButton({ customerData }: { customerData: CustomerType }) {
//   const [isOpen, setIsOpen] = useState(false)
//   const handleOpen = () => {
//     setIsOpen((prev) => !prev)
//   }
//   return (
//     <>
//       <Button variant='outline' className='rounded-2xl py-2 border border-blue-200 hover:bg-secondary hover:text-white hover:border-none gap-2'>
//         <IoPersonCircleOutline className='text-[1.25rem]'/>
//         Thông tin khách hàng
//       </Button>
//       { isOpen &&
//         <PopupBasic title='Thông tin sản phẩm' onClose={handleOpen}>
//         </PopupBasic>
//       }
//     </>
//   )
// }
function OrderButton() {
  const [isOpen, setIsOpen] = useState(false)
  const handleOpen = () => {
    setIsOpen((prev) => !prev)
  }
  return (
    <>
      <Button variant='outline' className='rounded-2xl py-2 border border-border-secondary hover:bg-secondary hover:text-white hover:border-none gap-2' onClick={handleOpen}>
        <MdOutlineShoppingCart/>
          Tạo đơn hàng mới
      </Button>
      <AnimatePresence>
        {isOpen &&
          <PopupBasic title='Tạo đơn hàng mới' onClose={handleOpen}>
            <p className='text-soft-gray text-[1rem]'>Hướng dẫn tạo đơn hàng mới</p>
            <div className='mt-7'>
              <TutorialBox step='Bước 1: Chọn sản phẩm sữa' description='Hãy chọn sản phẩm khách hàng muốn đặt'/>
              <Select>
                
              </Select>
            </div>
          </PopupBasic>
        }
      </AnimatePresence>
    </>
  )
}

export default function SystemRecommendation({ recommends }: { recommends?: Recommendation[] }) {
  const button = (recommend: Recommendation) => {
    //     if (recommend.recommendType === 'SearchCustomerInfo')
    //       return <CustomerProfileButton customerData={recommend.data} />

    if (recommend.recommendType === 'SearchOrderHistory')
      return <OrderHistoryButton orderHistoryData={recommend.data} />

    if (recommend.recommendType === 'SearchProduct')
      return <ProductButton productData={recommend.data} />
  }
  return (
    <div className="py-2 px-3 bg-linear-to-r from-blue-100 to-[#F9F5FF] border border-border-secondary rounded-lg mb-2 min-w-90">
      <div className="flex items-center gap-2">
        <BsStars className="text-secondary"/>
        <p className="text-sm-body-desktop text-primary">Gợi ý từ hệ thống</p>
      </div>
      <div className='grid grid-cols-2 items-center justify-center mt-2'>
        { recommends?.map((data) => (
          <div key={data.recommendType} className='mt-1'>
            {button(data)}
          </div>
        )) }
        <OrderButton/>
      </div>
    </div>
  )
}
