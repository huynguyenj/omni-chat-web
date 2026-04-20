import PopupBasic from '@/components/ui/popup/PopupBasic'
import type { ProductDetailType } from '../../types/product-type'
import { useEffect, useState } from 'react'
import TutorialBox from '../ui/TutorialBox'
import Card from '@/components/ui/card/Card'
import Tag from '@/components/ui/tag/Tag'
import Checkbox from '@/components/ui/input/Checkbox'
import { IoIosArrowForward } from 'react-icons/io'
import Button from '@/components/ui/button/Button'
import OrderReview from './OrderReview'
import { LuCircleCheckBig } from 'react-icons/lu'
import useGetListBatchByProductId from '../../hooks/useGetListBatchByProductId'
import type { BatchType } from '../../types/batch-type'
import NodataCard from '@/components/ui/card/NodataCard'
import CardSkeleton from '@/components/ui/skeleton/CardSkeleton'
import PaginationBar from '@/components/ui/pagination/PaginationBar'
import useContextValid from '@/hooks/useContextValid'
import SelectionMessageContext from '../../context/SelectionMessageProvider'
import useCreateOrder from '../../hooks/useCreateOrder'
import { toast } from 'react-toastify'
import { type OrderItems, type OrderRequestType, type OrderReviewType } from '../../types/order-type'
import LoadingSpinner from '@/components/ui/loading/LoadingSpinner'
import { PRODUCT_TYPE } from '../../const/product-type'
import BatchItem from './BatchItem'
import { ScrollArea } from '@/components/ui/scrollbar/ScrollArea'

type CreateOrderSearchSectionProps = {
  handleOpenCreate: () => void
  product: ProductDetailType
}


export default function CreateOrderSearchSection({ handleOpenCreate, product }: CreateOrderSearchSectionProps) {
  const [index, setIndex] = useState(1)
  const [checked, setChecked] = useState(false)
  const { listBatch, loading, setCurrentPage, currentPage, setNewFilter } = useGetListBatchByProductId({ productId: product.id })
  // const [newestBatchChosen, setNewestBatchChosen] = useState<BatchType>()
  const [listOrderItems, setListOrderItems] = useState<Map<string, OrderItems>>(new Map())
  const [listBatchChosen, setListBatchChosen] = useState<Map<string, BatchType>>(new Map())
  const context = useContextValid(SelectionMessageContext)
  const [listProducts, setListProducts] = useState<Map<string, OrderReviewType>>(new Map())
  const { handleOrder, loading: orderLoading } = useCreateOrder()
  const handleChecked = () => {
    setChecked((prev) => !prev)
    setNewFilter((prevState) => !prevState)
  }
  const handlePrev = () => {
    if (index == 1) return
    setIndex((page) => page - 1)
  }
  const handleNext = () => {
    if (index == 4) return
    setIndex((page) => page + 1)
  }

  const handleOrderProduct = () => {
    if (!context.customerId) {
      toast.error('Không nhận đưa id khách hàng')
      return
    }
    const fullOrderBody: OrderRequestType = {
      customerId: context.customerId,
      name: product.name,
      orderItems: [
        ...Array.from(listOrderItems.values())
      ]
    }
    handleOrder(fullOrderBody)
  }

  const handleOrderItemSelected = (batch: BatchType) => {
    const newListItems = new Map(listOrderItems)
    const newListBatchChosen = new Map(listBatchChosen)
    if (newListItems.has(batch.id)) {
      newListItems.delete(batch.id)
      newListBatchChosen.delete(batch.id)
      setListOrderItems(newListItems)
      setListBatchChosen(newListBatchChosen)
      return
    }
    newListItems.set(batch.id, { productBatchId: batch.id, quantity: 1 })
    newListBatchChosen.set(batch.id, batch)
    setListOrderItems(newListItems)
    setListBatchChosen(newListBatchChosen)
  }

  useEffect(() => {
    const handleSetOrderReview = () => {
      const newProductList = new Map(listProducts)
      newProductList.set(product.id, { ...product, listBatch: Array.from(listBatchChosen.values()), orderItems: Array.from(listOrderItems.values()) })
      setListProducts(newProductList)
    }
    handleSetOrderReview()
  }, [listBatchChosen, listOrderItems, product])

  return (
    <PopupBasic title='Đặt hàng' onClose={handleOpenCreate}>
      { index == 1 &&
                  <div id='index#2'>
                    <div className='mt-7'>
                      <TutorialBox step='Bước 1: Chọn lô hàng & Số lượng' description='Chọn lô hàng và nhập số lượng mong muốn'/>
                      <Card className='bg-[#EFF6FF] border-2 border-[#C9D9F5] rounded-xl my-5'>
                        <p className='text-sm-body-desktop text-soft-gray'>Sản phẩm đã chọn</p>
                        <p className='text-sm-body-desktop text-primary font-medium text-sm/7'>{product.name}</p>
                        <div className='flex items-center gap-3 my-2'>
                          <Tag className={`bg-transparent rounded-2xl px-2 py-0.5 border ${PRODUCT_TYPE[product.productKind].style}`}>
                            {PRODUCT_TYPE[product.productKind].name}
                          </Tag>
                          <Tag className='bg-transparent border rounded-2xl px-2 py-0.5 text-secondary font-medium border-secondary'>
                            {product.volumeMl}ml
                          </Tag>
                          <p className='text-sm-body-desktop text-soft-gray'>Tồn kho: <span className='font-medium text-primary'>{product.quantity}</span></p>
                        </div>
                      </Card>
                      <div className='flex items-center gap-3 my-4 bg-[#F5F7FA] py-3 px-4 rounded-xl'>
                        <Checkbox id='check-batch' onCheckedChange={handleChecked} checked={checked}/>
                        <div>
                          <label htmlFor="check-batch" className='text-sm-body-desktop font-semibold text-primary'>Tự động lọc lô hàng mới nhất (FIFO)</label>
                          <p className='text-[0.85rem] text-soft-gray'>Hệ thống sẽ tự động hiện lô có hạn sử dụng xa nhất</p>
                        </div>
                      </div>
                      { loading ?
                        <CardSkeleton/>
                        :
                        <>
                          {listBatch && listBatch.items.length > 0 ?
                            <div>
                              { listOrderItems &&
                                <>
                                  <p className='text-sm-body-desktop text-primary font-medium mt-2'>Chọn lô hàng theo HSD</p>
                                  { listBatch.items.length > 0 &&
                                    <ScrollArea className='h-50'>
                                      { listBatch?.items.map((batch, i) => (
                                        <BatchItem
                                          key={batch.id}
                                          batch={batch}
                                          isSelected={listBatchChosen.has(batch.id)}
                                          setListOrderItems={setListOrderItems}
                                          onSelect={() => handleOrderItemSelected(batch)}
                                          showQuantity={listOrderItems.has(batch.id)}
                                          listOrderItems={listOrderItems}
                                          indexItem={i}
                                          isNewestBoxChecked={checked}
                                        />
                                      )) }
                                    </ScrollArea>
                                  }

                                </>
                              }
                              <PaginationBar
                                currentPage={currentPage}
                                setPage={setCurrentPage}
                                totalPage={listBatch.meta.total_pages}
                              />
                            </div>
                            :
                            <NodataCard content='Sản phẩm này chưa có lô hàng'/>
                          }
                        </>
                      }
                    </div>
                    <div className='flex gap-2 mt-3'>
                      <Button className={`w-full font-bold ${listOrderItems.size == 0 && 'opacity-50'}`} onClick={handleNext} disabled={listOrderItems.size > 0 ? false : true}>
                        Tiếp theo
                        <IoIosArrowForward/>
                      </Button>
                    </div>
                  </div>
      }
      { index == 2 &&
                    <div id='index#3'>
                      <div className='mt-7'>
                        <TutorialBox step='Bước 2: Xác nhận đơn hàng' description='Kiểm tra lại thông tin khi tạo đơn'/>
                        { listOrderItems.size > 0 && listProducts &&
                          Array.from(listProducts.values()).map((product) => (
                            <OrderReview
                              listBatch={product.listBatch}
                              listOrderItems={product.orderItems}
                              product={product}
                            />
                          ))
                        }
                      </div>
                      { orderLoading ?
                        <div className='flex justify-center items-center w-full'>
                          <LoadingSpinner size='lg'/>
                        </div>
                        :
                        <div className='flex gap-2'>
                          <Button variant='outline' className='w-full font-bold border-2 border-border-primary text-black hover:bg-gray-100' onClick={handlePrev}>
                              Quay lại
                          </Button>
                          <Button variant='success' className='w-full font-bold items-center' onClick={handleOrderProduct}>
                            <LuCircleCheckBig/>
                              Tạo đơn hàng
                          </Button>
                        </div>
                      }
                    </div>
      }
    </PopupBasic>
  )
}
