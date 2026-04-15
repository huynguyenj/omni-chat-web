import Button from '@/components/ui/button/Button'
import PopupBasic from '@/components/ui/popup/PopupBasic'
import { AnimatePresence } from 'motion/react'
import { useState } from 'react'
import { MdOutlineShoppingCart } from 'react-icons/md'
import OrderStepOne from './order-process/OrderStepOne'
import type { ProductDetailType } from '../../types/product-type'
import OrderStepTwo from './order-process/OrderStepTwo'
import type { OrderReviewType } from '../../types/order-type'
import OrderStepThree from './order-process/OrderStepThree'


export default function CreateOrderSection() {
  const [isOpen, setIsOpen] = useState(false)
  const [index, setIndex] = useState(1)
  const [listProductSelected, setListProductSelected] = useState<ProductDetailType[]>([])
  const [listProductsWithOrderItems, setListProductsWithOrderItems] = useState<Map<string, OrderReviewType>>(new Map())
  const handleOpen = () => {
    setIsOpen((prev) => !prev)
  }

  const handlePrev = () => {
    if (index == 1) return
    setIndex((page) => page - 1)
  }
  const handleNext = () => {
    if (index == 4) return
    setIndex((page) => page + 1)
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
            <div className='flex gap-2 items-center my-5'>
              <div className={`text-soft-gray flex items-center gap-2 ${index === 1 && 'text-secondary'}`}>
                <div className={`flex items-center justify-center bg-gray-200 font-medium rounded-full w-8 h-8  ${index === 1 && 'text-white bg-secondary'}`}>1</div>
                <p className={`text-sm-body-desktop ${index === 1 && 'font-medium text-secondary'}`}>Chọn SP</p>
              </div>
              <hr className='border-2 border-border-primary w-10'/>
              <div className={`text-soft-gray flex items-center gap-2 ${index === 2 && 'text-secondary'}`}>
                <div className={`flex items-center justify-center bg-gray-200 font-medium rounded-full w-8 h-8  ${index === 2 && 'text-white bg-secondary'}`}>2</div>
                <p className={`text-sm-body-desktop ${index === 2 && 'font-medium text-secondary'}`}>Chọn Lô</p>
              </div>
              <hr className='border-2 border-border-primary w-10'/>
              <div className={`text-soft-gray flex items-center gap-2 ${index === 3 && 'text-secondary'}`}>
                <div className={`flex items-center justify-center bg-gray-200 font-medium rounded-full w-8 h-8  ${index === 3 && 'text-white bg-secondary'}`}>3</div>
                <p className={`text-sm-body-desktop ${index === 3 && 'font-medium text-secondary'}`}>Xác nhận</p>
              </div>
            </div>
            { index == 1 &&
            <OrderStepOne
              onNextStep={handleNext}
              setListProductSelected={setListProductSelected}
            />
            }
            { index == 2 &&
              <OrderStepTwo
                listProductSelected={listProductSelected}
                listProductWithOrderItems={listProductsWithOrderItems}
                setListProductWithOrderItems={setListProductsWithOrderItems}
                onNext={handleNext}
                onPrevious={handlePrev}
              />
            }
            { index == 3 &&
             <OrderStepThree
               onPrevious={handlePrev}
               listProductWithOrderItems={listProductsWithOrderItems}
             />
            }
          </PopupBasic>
        }
      </AnimatePresence>
    </>
  )
}
