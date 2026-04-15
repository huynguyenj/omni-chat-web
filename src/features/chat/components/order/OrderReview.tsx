import Card from '@/components/ui/card/Card'
import { PRODUCT_TYPE } from '../../const/product-type'
import type { BatchType } from '../../types/batch-type'
import type { ProductDetailType } from '../../types/product-type'
import { LuPackage } from 'react-icons/lu'
import type { OrderItems } from '../../types/order-type'
import { formatDate } from '@/utils/date-resolver'
import { useMemo } from 'react'

type OrderReviewType = {
   product: ProductDetailType
   listBatch: BatchType[]
   listOrderItems: OrderItems[]
}

export default function OrderReview({ listBatch, product, listOrderItems }: OrderReviewType) {
  const totalQuantity = useMemo(() => {
    return listOrderItems && listOrderItems.reduce((total, item) => {
      return item.quantity + total
    }, 0)
  }, [listOrderItems])
  return (
    <Card variant='default' className='py-4 px-5 my-5 border-2 border-border-primary text-sm-body-desktop'>
      <div className='flex justify-between items-center text-sm-body-desktop'>
        <p className='text-primary font-medium'>{product.brand} - {product.name}</p>
        <p className='text-green-accent font-medium'>{(product.price*totalQuantity).toLocaleString()}đ</p>
      </div>
      <p className='text-soft-gray text-sm-body-desktop'>{PRODUCT_TYPE[product.productKind].name}</p>
      { listBatch.map((batch) => (
        <Card key={batch.id} className='text-sm-body-desktop flex justify-between items-center border-none bg-[#F5F7FA] my-2'>
          <div className='flex gap-3 items-center'>
            <LuPackage className='text-secondary'/>
            <p className='text-primary font-medium'>{batch.code}</p>
            <p className='text-soft-gray'>HSD: {formatDate(batch.expiryDate)}</p>
          </div>
          <p className='text-primary font-medium'><span className='text-[0.85rem]'>x</span> {listOrderItems.find((item) => item.productBatchId == batch.id)?.quantity}</p>
        </Card>
      )) }
      <div className='flex items-center justify-between text-sm-body-desktop'>
        <p>Số lượng: </p>
        <p className='text-primary font-medium'>{totalQuantity} sản phẩm</p>
      </div>
    </Card>
  )
}
