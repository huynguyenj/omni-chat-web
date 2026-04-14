import PopupBasic from '@/components/ui/popup/PopupBasic'
import Input from '@/components/ui/input/Input'
import { CiSearch } from 'react-icons/ci'
import useGetProductList from '../../hooks/useGetProductList'
import useDebounce from '@/hooks/useDebounce'
import Card from '@/components/ui/card/Card'
import Tag from '@/components/ui/tag/Tag'
import { ScrollArea } from '@/components/ui/scrollbar/ScrollArea'
import { FaWarehouse } from 'react-icons/fa6'
import Button from '@/components/ui/button/Button'
import { IoIosArrowForward } from 'react-icons/io'
import PaginationBar from '@/components/ui/pagination/PaginationBar'
import CardSkeleton from '@/components/ui/skeleton/CardSkeleton'
import { useState } from 'react'
import { motion } from 'motion/react'
import { FiShoppingCart } from 'react-icons/fi'
import type { ProductDetailType } from '../../types/product-type'
import CreateOrderSearchSection from '../order/CreateOrderSearchSection'

type ListProductSectionProps = {
  isOpen: boolean
  handleOpen: () => void
}

export default function ListProductSection({ isOpen, handleOpen }: ListProductSectionProps) {
  const { currentPage, listProducts, loading, setCurrentPage, setSearchName } = useGetProductList()
  const [isDetailOpen, setIsDetailOpen] = useState({ id: '', state: false })
  const [isCreateOrderOpen, setCreateOrderOpen] = useState(false)
  const [productCreateOrderChose, setProductCreateOrderChose] = useState<ProductDetailType>()
  const handleSearch = (value: string) => {
    setCurrentPage(1)
    setSearchName(value)
  }
  const debounce = useDebounce(handleSearch, 500)
  const handleOpenProductDetail = (productId: string) => {
    setIsDetailOpen((prevState) => {
      if (productId === prevState.id) {
        return {
          id: '',
          state: false
        }
      } else if (productId !== prevState.id && prevState.state === true) {
        return {
          id: productId,
          state: true
        }
      } else {
        return {
          id: productId,
          state: true
        }
      }
    })
  }
  const handleOpenCreateOrderProduct = (product: ProductDetailType) => {
    setCreateOrderOpen((prev) => !prev)
    setProductCreateOrderChose(product)
  }
  const handleCloseCreateOrderProduct = () => {
    setCreateOrderOpen(prevState => !prevState)
  }
  return (
    <div>
      {isOpen &&
      <PopupBasic onClose={handleOpen} title='Tìm kiếm sản phẩm'>
        <p className='text-gray-400 mb-2'>Nhập tên hoặc mã sản phẩm để tra cứu thông tin nhanh</p>
        <Input onChange={(e) => debounce(e.target.value)} icon={CiSearch} type='text' variant='gray' placeholder='Tìm kiếm theo tên hoặc mã sản phẩm'/>
        { loading ?
          <CardSkeleton count={3}/>
          :
          <>
            { listProducts ?
              <>
                <ScrollArea className='h-120 mb-3'>
                  { listProducts?.items.map((item) => (
                    <Card key={item.id} variant='primary' className='my-3 py-4 flex flex-col gap-3'>
                      <div className='flex justify-between items-center text-sm-body-desktop'>
                        <div>
                          <div className='flex gap-3 items-center'>
                            <p className='text-primary font-medium w-[60%]'>{item.name}</p>
                            <Tag className='py-0.5 border-border-primary border-3'>{item.brand}</Tag>
                          </div>
                          <div className='text-sm-body-desktop flex gap-5'>
                            <p className='font-bold text-green-accent'>{item.price.toLocaleString()}đ</p>
                            <p className='flex gap-2 items-center'>
                              <FaWarehouse className='text-secondary size-4'/>
                      Tồn: <span className='font-medium'>{item.quantity}</span>
                            </p>
                          </div>
                        </div>
                        <Button className='bg-transparent hover:bg-transparent hover:border-3 hover:border-border-primary' onClick={() => handleOpenProductDetail(item.id)}>
                          <motion.div
                            initial={{ rotate: 0 }}
                            animate= { isDetailOpen.state && isDetailOpen.id === item.id ? { rotate: 90 } : { rotate: 0 } }
                          >
                            <IoIosArrowForward className='text-soft-gray size-5'/>
                          </motion.div>
                        </Button>
                      </div>
                      <Card className={`bg-border-primary border-none rounded-sm text-sm-body-desktop ${isDetailOpen.state && isDetailOpen.id === item.id ? 'h-fit block' : 'h-0 hidden'}`}>
                        <div className='flex items-center gap-30'>
                          <div>
                            <p className='text-soft-gray'>Mã sản phẩm</p>
                            <p className='text-primary font-medium'>{item.code}</p>
                          </div>
                          <div>
                            <p className='text-soft-gray'>Hạn sử dụng</p>
                            <p className='text-primary font-medium'>{item.lifeSpan} ngày</p>
                          </div>
                        </div>
                        <div className='flex items-center gap-30'>
                          <div>
                            <p className='text-soft-gray'>Dung tích</p>
                            <Tag variant='primary' className='py-0.5'>{item.volumeMl}ml</Tag>
                          </div>
                          {/* <div>
                    <p className='text-soft-gray'>Hạn sử dụng</p>
                    <p className='text-primary font-medium'>{item.lifeSpan} ngày</p>
                  </div> */}
                        </div>
                        <Button className='w-full my-5' onClick={() => handleOpenCreateOrderProduct(item)}>
                          <FiShoppingCart />
                          Tạo đơn
                        </Button>
                      </Card>
                    </Card>
                  )) }
                </ScrollArea>
                <PaginationBar
                  currentPage={currentPage}
                  setPage={setCurrentPage}
                  totalPage={listProducts?.meta.total_pages}
                />
              </>
              :
              <div className='flex flex-col items-center justify-center py-10'>
                <CiSearch size={50} className='font-bold text-gray-400'/>
                <p className='text-gray-400'>Nhập từ khóa sản phẩm</p>
              </div>
            }
          </>
        }
      </PopupBasic>
      }
      { isCreateOrderOpen && productCreateOrderChose &&
        <CreateOrderSearchSection
          product={productCreateOrderChose}
          handleOpenCreate={handleCloseCreateOrderProduct}/>
      }
    </div>
  )
}
