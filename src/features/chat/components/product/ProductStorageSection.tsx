import { useState } from 'react'
import type { ProductType } from '../../types/product-type'
import Button from '@/components/ui/button/Button'
import { LuPackage } from 'react-icons/lu'
import { AnimatePresence } from 'motion/react'
import PopupBasic from '@/components/ui/popup/PopupBasic'

export default function ProductStorageSection({ productData }: { productData: ProductType}) {
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
