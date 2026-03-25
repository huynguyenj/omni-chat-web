import Card from '@/components/ui/card/Card'
import { BsFillBoxSeamFill } from "react-icons/bs";

type OrderReviewType = {
   productName: string
   capacityProduct: number
   typeProduct: string
   totalProduct: number
   batch: string
   batchDate: string
   shipDate: string
   totalPrice: number
   company: number
}

export default function OrderReview({ batch, batchDate, capacityProduct, productName, shipDate, totalPrice, totalProduct, typeProduct, company }: Partial<OrderReviewType>) {
  return (
    <Card variant='default' className='py-4 px-5 my-5 border-2 border-border-primary text-sm-body-desktop'>
      <p className='text-primary font-medium'>Thông tin đơn hàng</p>
      <div className='mt-10'>
        <div className='flex justify-between mt-3'>
          <p className='text-soft-gray'>Hãng: </p>
          <p className='font-medium'>{company}</p>
        </div>
        <div className='flex justify-between mt-3'>
          <p className='text-soft-gray'>Sản phẩm: </p>
          <p className='font-medium'>{productName}</p>
        </div>
        <div className='flex justify-between mt-3'>
          <p className='text-soft-gray'>Loại: </p>
          <p className='font-medium'>{typeProduct}</p>
        </div>
        <div className='flex justify-between mt-3'>
          <p className='text-soft-gray'>Dung tích: </p>
          <p className='font-medium'>{capacityProduct}</p>
        </div>
        <hr className='border border-border-primary w-full'/>
        <p className='text-soft-gray'>Chi tiết lô hàng</p>
        <div>
          <BsFillBoxSeamFill className='size-4 text-secondary'/>
          <p className='text-pr'>{batch}</p>
          <p className='text-soft-gray'>HSD: {batchDate}</p>
        </div>
        <div className='flex justify-between mt-3'>
          <p className='text-soft-gray'>Tổng số lượng: </p>
          <p className='font-medium'>{totalProduct} sản phẩm</p>
        </div>
        <hr className='border border-border-primary my-3'/>
        <div className='flex justify-between font-medium mt-3'>
          <p className='text-primary'>Tổng tiền</p>
          <p className='text-green-accent'>{totalPrice ? totalPrice.toLocaleString('vi-VN') : 0}đ</p>
        </div>
      </div>
    </Card>
  )
}
