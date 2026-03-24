import Card from '@/components/ui/card/Card'

type OrderReviewType = {
   productName: string
   
}

export default function OrderReview() {
  return (
    <Card variant='default' className='py-4 px-5 my-5 border-2 border-border-primary text-m-body-desktop'>
      <p className='text-m-body-desktop text-primary'>Thông tin đơn hàng</p>
      <div className='mt-10'>
        <div className='flex justify-between mt-3'>
          <p className='text-soft-gray'>Sản phẩm: </p>
          <p className='font-medium'>{product?.name}</p>
        </div>
        <div className='flex justify-between mt-3'>
          <p className='text-soft-gray'>Dung tích: </p>
          <p className='font-medium'>{capacityProduct?.capacity}</p>
        </div>
        <div className='flex justify-between mt-3'>
          <p className='text-soft-gray'>Loại: </p>
          <p className='font-medium'>{typeProduct?.type}</p>
        </div>
        <div className='flex justify-between mt-3'>
          <p className='text-soft-gray'>Số lượng: </p>
          <p className='font-medium'>{numberOfProduct}</p>
        </div>
        <div className='flex justify-between mt-3'>
          <p className='text-soft-gray'>Lô hàng: </p>
          <p className='font-medium'>{batchChosen.batchId}</p>
        </div>
        <div className='flex justify-between mt-3'>
          <p className='text-soft-gray'>HSD: </p>
          <p className='font-medium'>{batchChosen.date}</p>
        </div>
        <div className='flex justify-between mt-3'>
          <p className='text-soft-gray'>Ngày giao: </p>
          <p className='font-medium'>{dateOfShipment}</p>
        </div>
        <hr className='border border-border-primary my-3'/>
        <div className='flex justify-between font-medium mt-3'>
          <p className='text-primary'>Tổng tiền</p>
          <p className='text-green-accent'>42.000đ</p>
        </div>
      </div>
    </Card>
  )
}
