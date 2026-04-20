import Button from '@/components/ui/button/Button'
import TutorialBox from '../../ui/TutorialBox'
import { LuCircleCheckBig } from 'react-icons/lu'
import type { OrderItems, OrderRequestType, OrderReviewType } from '@/features/chat/types/order-type'
import OrderReview from '../OrderReview'
import useCreateOrder from '@/features/chat/hooks/useCreateOrder'
import useContextValid from '@/hooks/useContextValid'
import SelectionMessageContext from '@/features/chat/context/SelectionMessageProvider'
import { toast } from 'react-toastify'
import LoadingSpinner from '@/components/ui/loading/LoadingSpinner'
import { ScrollArea } from '@/components/ui/scrollbar/ScrollArea'

type OrderStepThreeProps = {
   onPrevious: () => void
   listProductWithOrderItems: Map<string, OrderReviewType>
}

export default function OrderStepThree({ onPrevious, listProductWithOrderItems }: OrderStepThreeProps) {
  const { handleOrder, loading } = useCreateOrder()
  const context = useContextValid(SelectionMessageContext)
  const handleOrderProduct = () => {
    if (!context.customerId) {
      toast.error('Không nhận đưa id khách hàng')
      return
    }
    const listProducts = Array.from(listProductWithOrderItems.values())
    const listOrderItems: OrderItems[] = []
    listProducts.forEach(product => {
      product.orderItems.forEach(orderItem =>
        listOrderItems.push(orderItem)
      )
    })
    const fullOrderBody: OrderRequestType = {
      customerId: context.customerId,
      name: '',
      orderItems: [
        ...listOrderItems
      ]
    }
    handleOrder(fullOrderBody)
  }
  return (
    <div id='index#3'>
      <div className='mt-7'>
        <TutorialBox step='Bước 3: Xác nhận đơn hàng' description='Kiểm tra lại thông tin khi tạo đơn'/>
        { listProductWithOrderItems &&
          <ScrollArea className='h-100'>
            { Array.from(listProductWithOrderItems.values()).map((product) => (
              <OrderReview
                listBatch={product.listBatch}
                listOrderItems={product.orderItems}
                product={product}
              />
            ))}
          </ScrollArea>

        }
      </div>
      { loading ?
        <div className='flex justify-center'>
          <LoadingSpinner size='lg'/>
        </div>
        :
        <div className='flex gap-2'>
          <Button variant='outline' className='w-full font-bold border-2 border-border-primary text-black hover:bg-gray-100' onClick={onPrevious}>
                     Quay lại
          </Button>
          <Button variant='success' className='w-full font-bold items-center' onClick={handleOrderProduct}>
            <LuCircleCheckBig/>
                     Tạo đơn hàng
          </Button>
        </div>

      }
    </div>
  )
}
